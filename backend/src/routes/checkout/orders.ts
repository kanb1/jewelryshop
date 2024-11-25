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
    // Validate all productIds
    const invalidItems = items.filter((item: any) => !mongoose.isValidObjectId(item.productId));
    if (invalidItems.length > 0) {
       res.status(400).json({
        error: "Invalid productId(s) found",
        invalidItems,
      });
      return;
    }

    // Ensure all productIds exist in the database
    for (const item of items) {
      const productExists = await Products.exists({ _id: item.productId });
      if (!productExists) {
         res.status(404).json({
          error: `Product with ID ${item.productId} not found`,
        });
        return;
      }
    }

    // Generate unique order number
    const orderNumber = `EP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    // Create and save order
    const order = new Order({
      userId,
      items,
      totalPrice,
      deliveryInfo,
      orderNumber,
      paymentStatus: "Pending",
      createdAt: new Date(),
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



  

  

export default router;
