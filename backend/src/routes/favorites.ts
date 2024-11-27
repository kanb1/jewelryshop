import express, { Request, Response } from "express";
import Favorite from "../models/Favorites"; // Import Favourite model
import authenticateJWT from "../routes/authMiddleware";
import mongoose from "mongoose";

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
    user?: { userId: string };
  }

const router = express.Router();

// GET /favourites?userId=123 - Fetch user's favourite products
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract the userId from the token
      const userId = req.user?.userId;
  
      // Validate userId
      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }
  
      // Fetch favourites for the authenticated user
      const favourites = await Favorite.find({ userId }).populate("productId");
  
      res.status(200).json(favourites);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      res.status(500).json({ error: "Failed to fetch favourites" });
    }
  });

// POST /favourites - Add a product to user's favourites
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.body;
    const userId = req.user?.userId; // Extract userId from the authenticated JWT middleware
  
    try {
      // Validate userId and productId
      if (!userId || !mongoose.isValidObjectId(userId)) {
        res.status(400).json({ error: "Invalid or missing user ID" });
        return;
      }
      if (!productId || !mongoose.isValidObjectId(productId)) {
        res.status(400).json({ error: "Invalid or missing product ID" });
        return;
      }
  
      // Check if the product is already in favourites
      const existingFavourite = await Favorite.findOne({ userId, productId });
      if (existingFavourite) {
        res.status(409).json({ error: "Product is already in favourites" });
        return;
      }
  
      // Create and save the favourite
      const newFavourite = new Favorite({ userId, productId });
      await newFavourite.save();
  
      res.status(201).json({ message: "Product added to favourites successfully" });
    } catch (error) {
      console.error("Error adding to favourites:", error);
      res.status(500).json({ error: "Failed to add to favourites" });
    }
  });
  

// DELETE /favourites/:id - Remove a product from user's favourites
router.delete("/:id", authenticateJWT, async (Request, Response) => {
  const { id } = Request.params;

  try {
    const favourite = await Favorite.findByIdAndDelete(id);
    if (!favourite) {
       Response.status(404).json({ error: "Favourite not found" });
       return;
    }

    Response.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    console.error("Error removing favourite:", error);
    Response.status(500).json({ error: "Failed to remove favourite" });
  }
});

export default router;
