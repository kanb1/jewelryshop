import express, { Request, Response } from "express";
import Favorite from "../../models/Favorites";
import authenticateJWT from "../authMiddleware";
import mongoose from "mongoose";

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
    user?: { userId: string };
  }

const router = express.Router();

//************************************************************************************Fetch user's favourite products
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
      // populate("productId"): Replaces the productId with the full product document from the Product collection.
      const favourites = await Favorite.find({ userId }).populate("productId");
  
      res.status(200).json(favourites);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      res.status(500).json({ error: "Failed to fetch favourites" });
    }
  });

//************************************************************************************ADD PRODUCT TO USER'S LIST
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
  
      // Check if the product is already in favourites by finding all the favorite documents belonging to the user by querying the Favorite model where userId matches the logged user's id
      const existingFavourite = await Favorite.findOne({ userId, productId });
      if (existingFavourite) {
        res.status(409).json({ error: "Product is already in favourites" });
        return;
      }
  
      // Creates a new favorite document with the userId and productId, then saves it to the database.
      const newFavourite = new Favorite({ userId, productId });
      await newFavourite.save();
  
      res.status(201).json({ message: "Product added to favourites successfully" });
    } catch (error) {
      console.error("Error adding to favourites:", error);
      res.status(500).json({ error: "Failed to add to favourites" });
    }
  });
  

//************************************************************************************DELETE PRODUCT FROM USERS LIST
router.delete("/:id", authenticateJWT, async (Request, Response) => {
  // Extracts the favorite document ID (id) from the URL parameters.
  const { id } = Request.params;

  try {
    // Finds the favorite document by its ID and deletes it. If the document doesn't exist, a 404 Not Found is returned.
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
