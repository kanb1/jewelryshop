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
  const { items, totalPrice, deliveryInfo } = req.body;
  const userId = req.user?.userId;

  try {
     // Log the received items to ensure correct payload structure
     console.log("Items received in request:", items);

    // Validate all productIds
    const invalidItems = items.filter((item: any) => !mongoose.isValidObjectId(item.productId));
    if (invalidItems.length > 0) {
      console.log("Invalid product IDs found:", invalidItems);
       res.status(400).json({
        error: "Invalid productId(s) found",
        invalidItems,
      });
      return;
    }

    // Ensure all productIds exist in the database
    for (const item of items) {
      console.log(`Checking existence of product ID: ${item.productId}`);
      const productExists = await Products.exists({ _id: item.productId });
      console.log(`Product exists for ID ${item.productId}:`, productExists);
      if (!productExists) {
         res.status(404).json({
          error: `Product with ID ${item.productId} not found`,
        });
        return;
      }
    }

    // Generate unique order number
    const orderNumber = `EP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    console.log("Generated order number:", orderNumber);

    // Log full order payload before saving
    const orderPayload = {
      userId,
      items,
      totalPrice,
      deliveryInfo,
      orderNumber,
      paymentStatus: "Pending",
      createdAt: new Date(),
    };
    console.log("Order payload to be saved:", orderPayload);

    // Create and save order
    const order = new Order(orderPayload);
    await order.save();

    

    // Send the confirmation email
    const emailBody = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Delivery Address:</strong></p>
      <p>${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}, ${deliveryInfo.country}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${items
          .map(
            (item: any) =>
              `<li>${item.quantity} x ${item.size} - ${item.productId} (ID: ${item.productId})</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> $${totalPrice}</p>
    `;

    console.log("Email body prepared:", emailBody);


    // Find the user who placed the order
      const user = await User.findById(order.userId); // Replace `order.userId` with the actual field holding the user ID
      if (!user || !user.email) {
        console.error("User or email not found for the order");
         res.status(404).json({ error: "User or email not found" });
         return;
      }

      console.log("User details fetched for email:", { email: user.email });


      await transporter.sendMail({
        from: "kanzafullstackexam@gmail.com",
        to: user.email, // Use the user's email address dynamically
        subject: "Order Confirmation",
        html: emailBody, // Replace this with your formatted email body
      });

    console.log("Order confirmation email sent successfully");


    console.log("Order created successfully:", order);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error during order processing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



  

  

export default router;
