import dotenv from "dotenv";
import express, { Request, Response } from "express";
import Order from "../../models/Order";
import authenticateJWT from "../authMiddleware"; // Ensure the user is authenticated
import mongoose from "mongoose";
import Products from "../../models/Products";
import User from "../../models/User"; 
import transporter from "../../helpers/emailConfig";
import { v4 as uuidv4 } from "uuid";


// Load environment variables
dotenv.config();


// Extend the Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  // is added after authentication via authenticateJWT 
  user?: { userId: string }; 
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

//**************************************** *GET orders
// Express checks the route handler in order
// first authenticateJWT runs, then AuthenticatedRequest defines to TS that the req object will ahve req.user after the authenticateJWT middleware runs. To prevent the TS error 
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  // Extracts userId from the JWT-protected request (req.user).
  const userId = req.user?.userId;
  //extracts the status query paraemter from the requst
      //eg GET /api/orders?status=Completed
      //req.query contains all the query parameters in the request URL.
  const { status } = req.query;

  // ensruing user exist and is a valid mongodb objectid
  if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(400).json({ error: "Valid user ID is required" });
      return;
  }

  try {
    // Creates a query object to filter orders by userId
    // intiially it only includes the userId, but later we will dynamically add the status property to the query object
      const query: any = { userId };

      // checks if the status query parameter exists
      // regular expression for pattern matching
      if (status) {
        // pattern says what is exactly "status" 
          query.status = new RegExp(`^${status}$`, "i"); // Case-insensitive (for mongodb field)
      }

      // Query to MongoDB: { userId: "12345", status: /^Completed$/i }
      console.log("Query to MongoDB:", query);

      // this query will then be passed to Order.find() to fetch orders belonging to the current user
      const orders = await Order.find(query).sort({ createdAt: -1 });

      // maps the raw mongodb orders into a clean, structure response
      const mappedOrders = orders.map((order) => ({
        orderId: order._id,
        status: order.status,
        createdAt: order.createdAt,
        returnId: order.returnId || null,
        returnStatus: order.returnStatus || null,
        returnInitiatedAt: order.returnInitiatedAt || null,
        // isEligibleForReturn(order.createdat) --> checks if the order was placed within 30 days
        isReturnable: order.status === "In Progress" && isEligibleForReturn(order.createdAt),
    }));
    

      res.status(200).json(mappedOrders);
  } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
  }
});


//**************************************** *CREATE ORDER
// When in the billing frontend we "save"/create the order after the payment is succesful
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  // the frontend sends all this data in the POST request body
  const { items, totalPrice, deliveryInfo, deliveryMethod, paymentIntentId } = req.body;
  const userId = req.user?.userId;

  try {
    console.log("Step 1: Starting order creation...");
    console.log("Received items:", items);
    console.log("Delivery method:", deliveryMethod);
    console.log("Delivery info:", deliveryInfo);

    // Validate delivery method (ensures it's either home or parcelshop)
    if (!deliveryMethod || !["home", "parcel-shop"].includes(deliveryMethod)) {
      console.error("Validation failed: Invalid delivery method", { deliveryMethod });
      res.status(400).json({ error: "Invalid delivery method" });
      return;
    }

    // Validate all product IDs
    // Each product in items has a productid
    // mongoose.isValidObjectId() ensures the productId format is valid for mongodb
    const invalidItems = items.filter((item: any) => !mongoose.isValidObjectId(item.productId));
    if (invalidItems.length > 0) {
      console.error("Validation failed: Invalid product IDs", { invalidItems });
      res.status(400).json({ error: "Invalid productId(s)", invalidItems });
      return;
    }

    console.log("Step 2: All product IDs are valid. Proceeding...");

    // Check product existence
    // Ensures each productId in the items exists in the Products collection.
    // Products.exists is efficient because it only checks for the document's existence, not the full document.
    for (const item of items) {
      const productExists = await Products.exists({ _id: item.productId });
      if (!productExists) {
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
      res.status(400).json({ error: "Incomplete home delivery address" });
      return;
    }
    if (deliveryMethod === "parcel-shop" && !deliveryInfo.address) {
      res.status(400).json({ error: "Parcel shop address is missing" });
      return;
    }

    console.log("Step 4: Delivery info validated. Proceeding to create order...");

    // Generate unique order number
    // gets the last 6 digits of the current timestamp
    // Math.random() * 1000 adds a random 3-digit number.
    // (EP)123456789
    const orderNumber = `EP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    console.log("Generated order number:", orderNumber);

    // Prepare order payload (all necessary order data into a single object)
    const orderPayload = {
      userId,
      items,
      totalPrice,
      deliveryInfo,
      deliveryMethod,
      orderNumber,
      paymentIntentId, // Save Stripe's Payment Intent ID here
      paymentStatus: "Succeeded", // Update the status after payment success
      createdAt: new Date(),
    };

    console.log("Step 5: Saving order to database...");
    // Creates new Order document using the mongoose model and saves it to the db
    const order = new Order(orderPayload);
    await order.save();
    console.log("Order successfully saved:", order);

    console.log("Step 6: Sending confirmation email...");

    // Fetch user's email by userId
    const user = await User.findById(order.userId);
    if (!user || !user.email) {
      res.status(404).json({ error: "User or email not found" });
      return;
    }

    // using trnasporter (configured with nodemailer) to send email
    const emailBody = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${user.name || "Customer"}!</p>
      <p>Your order number is: ${orderNumber}</p>
      <p>Stripe Payment ID: ${paymentIntentId}</p>
      <p>Total: $${totalPrice}</p>
      <p>We will notify you once your order has been shipped.</p>
    `;
    await transporter.sendMail({
      from: "your-email@example.com",
      to: user.email,
      subject: "Order Confirmation",
      html: emailBody,
    });

    console.log("Email sent successfully.");
    res.status(201).json({ message: "Order created successfully", order });
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
    await order.save(); //gem opdateringerne i db'en

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
