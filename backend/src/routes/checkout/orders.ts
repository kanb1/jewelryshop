import dotenv from "dotenv";
import express, { Request, Response } from "express";
import Order from "../../models/Order";
import authenticateJWT from "../authMiddleware"; // Ensure the user is authenticated
import mongoose from "mongoose";
import Products from "../../models/Products";
import User from "../../models/User"; // Import the User model
import transporter from "../../helpers/emailConfig";

// Load environment variables
dotenv.config();

const router = express.Router();

// Extend the Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Adjust the structure of `user` if needed
}

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
      <h1>Order Confirmation</h1>
      <p>Order Number: ${orderNumber}</p>
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




  

  

export default router;
