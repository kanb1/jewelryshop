import dotenv from "dotenv";
import express, { Request, Response } from "express";
import Order from "../../models/Order";
import authenticateJWT from "../authMiddleware"; // Ensure the user is authenticated
import mongoose from "mongoose";
import Products from "../../models/Products";
import User from "../../models/User"; // Import the User model
import transporter from "../../helpers/emailConfig";
import { v4 as uuidv4 } from "uuid";


// Load environment variables
dotenv.config();


// Extend the Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Adjust the structure of `user` if needed
}
const router = express.Router();


// Helper function to check if an order is eligible for return
const isEligibleForReturn = (orderDate: Date): boolean => {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffInDays <= 30;
};

// GET /orders

router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { status } = req.query;

  if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: "Valid user ID is required" });
      return;
  }

  try {
      const query: any = { userId };

      if (status) {
          query.status = new RegExp(`^${status}$`, "i"); // Case-insensitive
      }

      console.log("Query to MongoDB:", query);

      const orders = await Order.find(query).sort({ createdAt: -1 });

      const mappedOrders = orders.map((order) => ({
        orderId: order._id,
        status: order.status,
        createdAt: order.createdAt,
        returnId: order.returnId || null,
        returnStatus: order.returnStatus || null,
        returnInitiatedAt: order.returnInitiatedAt || null,
        isReturnable: order.status === "In Progress" && isEligibleForReturn(order.createdAt),
    }));
    

      res.status(200).json(mappedOrders);
  } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
  }
});



// POST /orders - Create a new order
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { items, totalPrice, deliveryInfo, deliveryMethod } = req.body;
  const userId = req.user?.userId;

  try {
    console.log("Step 1: Starting order creation...");
    console.log("Received items:", items);
    console.log("Delivery method:", deliveryMethod);
    console.log("Delivery info:", deliveryInfo);

    // Validate delivery method
    if (!deliveryMethod || !["home", "parcel-shop"].includes(deliveryMethod)) {
      console.error("Validation failed: Invalid delivery method", { deliveryMethod });
      res.status(400).json({ error: "Invalid delivery method" });
      return;
    }

    // Validate all product IDs
    const invalidItems = items.filter((item: any) => !mongoose.isValidObjectId(item.productId));
    if (invalidItems.length > 0) {
      console.error("Validation failed: Invalid product IDs", { invalidItems });
      res.status(400).json({ error: "Invalid productId(s)", invalidItems });
      return;
    }

    console.log("Step 2: All product IDs are valid. Proceeding...");

    // Check product existence
    for (const item of items) {
      const productExists = await Products.exists({ _id: item.productId });
      console.log(`Product existence check for ID ${item.productId}:`, productExists);
      if (!productExists) {
        console.error("Product not found in database:", { productId: item.productId });
        res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        return;
      }
    }

    console.log("Step 3: Products exist. Validating delivery info...");

    // Validate delivery info
    if (
      deliveryMethod === "home" &&
      (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.country)
    ) {
      console.error("Validation failed: Incomplete home delivery address", { deliveryInfo });
      res.status(400).json({ error: "Incomplete home delivery address" });
      return;
    }
    if (deliveryMethod === "parcel-shop" && !deliveryInfo.address) {
      console.error("Validation failed: Parcel shop address is missing", { deliveryInfo });
      res.status(400).json({ error: "Parcel shop address is missing" });
      return;
    }

    console.log("Step 4: Delivery info validated. Proceeding to create order...");

    // Generate unique order number
    const orderNumber = `EP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    console.log("Generated order number:", orderNumber);

    // Prepare order payload
    const orderPayload = {
      userId,
      items,
      totalPrice,
      deliveryInfo,
      deliveryMethod,
      orderNumber,
      paymentStatus: "Pending",
      createdAt: new Date(),
    };

    console.log("Step 5: Saving order to database...");
    const order = new Order(orderPayload);
    await order.save();
    console.log("Order successfully saved:", order);

    console.log("Step 6: Sending confirmation email...");

    // Fetch user's email
    const user = await User.findById(order.userId);
    if (!user || !user.email) {
      console.error("User or email not found:", { userId: order.userId });
      res.status(404).json({ error: "User or email not found" });
      return;
    }

    console.log("User email found:", user.email);

    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h1 style="color: #6EBF8B;">Thank You for Your Order!</h1>
    <p>Hi ${user.name || "Customer"},</p>
    <p>We're excited to let you know that your order has been successfully placed. Below are your order details:</p>
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Order Number</th>
        <td style="padding: 8px;">${orderNumber}</td>
      </tr>
      <tr>
        <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Total Amount</th>
        <td style="padding: 8px;">$${order.totalPrice.toFixed(2)}</td>
      </tr>
      <tr>
        <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Delivery Method</th>
        <td style="padding: 8px;">${order.deliveryMethod === "home" ? "Home Delivery" : "Parcel Shop Pickup"}</td>
      </tr>
    </table>
    <p>If you have any questions or need to make changes, please contact our support team at support@jewelryshop.com.</p>
    <p>We hope you enjoy your purchase!</p>
    <p style="margin-top: 30px;">Warm regards,<br/>The JewelryShop Team</p>
  </div>
    `;
    await transporter.sendMail({
      from: "kanzafullstackexam@gmail.com",
      to: user.email,
      subject: "Order Confirmation",
      html: emailBody,
    });

    console.log("Step 7: Email sent successfully.");

    res.status(201).json({ message: "Order created successfully", order });
    console.log("Final response sent to frontend.");
  } catch (error) {
    console.error("Error during order processing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// ***************************************************************RETURNS
// POST /orders/:id/return - Initiate a return for an order
router.post("/:id/return", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.id;
  const userId = req.user?.userId;

  try {
    // Validate the order ID
    if (!mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    // Find the order
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      res.status(404).json({ error: "Order not found or unauthorized" });
      return;
    }

    // Check if the order is eligible for return
    if (!isEligibleForReturn(order.createdAt)) {
      res.status(400).json({ error: "Return period expired" });
      return;
    }

    // Generate a unique return ID and update the order
    const returnId = uuidv4();
    order.returnId = returnId;
    order.status = "Return Initiated"; // Update order status
    order.returnStatus = "Pending"; // Add return status (Pending by default)
    order.returnInitiated = true; // Set return initiated flag
    order.returnInitiatedAt = new Date(); // Set the return initiation date
    await order.save();

    // Fetch the user's email
    const user = await User.findById(userId);
    if (!user?.email) {
      res.status(404).json({ error: "User email not found" });
      return;
    }

    // Send the return label email
    const emailBody = `
      <h1>Return Label</h1>
      <p>Your return ID: ${returnId}</p>
      <p>Return address: Kanza Jewelryshop Aps, Købmagergade 62, 3. sal. 1150 København K</p>
      <p>Ship your return by: ${new Date(new Date().setDate(new Date().getDate() + 30)).toDateString()}</p>
    `;

    await transporter.sendMail({
      from: "noreply@yourshop.com",
      to: user.email,
      subject: "Return Label for Your Order",
      html: emailBody,
    });

    res.status(200).json({ message: "Return initiated successfully", returnId });
  } catch (err) {
    console.error("Error initiating return:", err);
    res.status(500).json({ error: "Failed to initiate return" });
  }
});

  

  

export default router;
