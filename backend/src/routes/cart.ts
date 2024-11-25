import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Products";
import authenticateJWT from "./authMiddleware";

const router = express.Router();

// Extend Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Adjust the structure of `user` if needed
}

// GET - Fetch all items in the user's cart
router.get("/cart", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const userId = req.user?.userId;

  try {
    const cartItems = await Cart.find({ userId }).populate("productId"); // Ensure `productId` is populated
    Response.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    Response.status(500).json({ error: "Error fetching cart items" });
  }
});

// POST - Add a product to the cart
router.post("/cart", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { productId, size, quantity } = req.body;
  const userId = req.user?.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
       res.status(400).json({ error: "Invalid productId format" });
       return;
    }

    const product = await Product.findById(productId);
    if (!product) {
       res.status(404).json({ error: "Product not found" });
      return;

    }

    const existingItem = await Cart.findOne({ userId, productId, size });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
       res.status(200).json({ message: "Cart updated", cartItem: existingItem });
       return;

    } else {
      const newCartItem = new Cart({ userId, productId, size, quantity });
      await newCartItem.save();
       res.status(201).json({ message: "Product added to cart", cartItem: newCartItem });
       return;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE - Remove an item from the cart
router.delete("/cart/:id", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const cartId = req.params.id;

  try {
    const deletedItem = await Cart.findByIdAndDelete(cartId);
    if (!deletedItem) {
       Response.status(404).json({ error: "Cart item not found" });
       return;
    }

    Response.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    Response.status(500).json({ error: "Internal server error" });
  }
});

// PUT - Update cart item quantity
router.put("/cart/:id", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
     Response.status(400).json({ error: "Quantity must be greater than 0" });
     return;
  }

  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
       Response.status(404).json({ error: "Cart item not found" });
      return;

    }

    Response.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    Response.status(500).json({ error: "Internal server error" });
  }
});

export default router;
