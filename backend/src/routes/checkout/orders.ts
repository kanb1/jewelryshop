import express, { Request, Response } from "express";
import Order from "../../models/Order";
import authenticateJWT from "../authMiddleware"; // Ensure the user is authenticated
import mongoose from "mongoose";
import Products from "../../models/Products";

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

    console.log("Order created successfully:", order);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



  

  

export default router;
