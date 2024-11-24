import express, { Request, Response } from "express";
import Order from "../../models/Order";
import authenticateJWT from "../authMiddleware"; // Ensure the user is authenticated

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
      // Generate a unique order number (e.g., based on timestamp or random number)
      const orderNumber = `EP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  
      // Create a new order
      const order = new Order({
        userId,
        items,
        totalPrice,
        deliveryInfo,
        orderNumber, // Add the generated order number
        paymentStatus: "Pending",
        createdAt: new Date(),
      });
  
      // Save the order to the database
      await order.save();
  
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

export default router;
