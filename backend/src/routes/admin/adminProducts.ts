import express from "express";
import Product from "../../models/Products";
import adminMiddleware from "../authMiddleware";
import multer from "multer";
import path from "path";
// vi vil gerne fjerne billederne fra uploads når produktet bliver slettet
import fs from "fs"; 


const router = express.Router();
router.use(adminMiddleware); // Apply admin middleware to all routes in this file!!

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // destination where uploaded files will be stored on the server
    cb(null, path.join(__dirname, "../../../../public/uploads")); 
  },
  filename: (req, file, cb) => {
    //  renames files with a timestamp to ensure unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// initilaize multer for handling file upload
const upload = multer({ storage });

  //************************************************************************* ADD NEW PRODUCT
  // uses multer to handle image uploads from the frontend-request
  router.post("/", adminMiddleware, upload.array("images"), async (req, res) => {
    const { name, type, productCollection, price, sizes } = req.body;

    // checks for required fields
    if (!name || !type || !price || !sizes) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    try {
      
      // Maps the uploaded files to an array of paths (/uploads/<filename>), which are saved in the database.
      const imagePaths =
        (req.files as Express.Multer.File[])?.map(
          (file) => `/uploads/${file.filename}`
        ) || [];

        // Creates a new Product document with the extracted details and image paths.
      const product = new Product({
        name,
        type,
        productCollection,
        price,
        sizes: sizes.split(",").map((size: string) => size.trim()), // Convert sizes to array
        images: imagePaths, // Save image paths
      });

      // Saves the product to MongoDB 
      await product.save();
      res
        .status(201)
        .json({ message: "Product created successfully.", product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

  //************************************************************************* UPDATE  PRODUCT
  router.put(
  "/:id",
  adminMiddleware,
  upload.array("images"), // Handle multiple images
  async (req, res) => {
    // Extracts the product ID from the URL and updates from the request body.
    const { id } = req.params;
    const updates = req.body;

    try {
      // If new images are uploaded, maps them to paths and adds them to the updates object.
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const imagePaths = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/${file.filename}`
        );
        updates.images = imagePaths;
      }

      // Finds the product by ID and updates its details in MongoDB. The { new: true } option returns the updated document.
      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!product) {
        res.status(404).json({ error: "Product not found." });
        return;
      }

      res
        .status(200)
        .json({ message: "Product updated successfully.", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

  //************************************************************************* DELETE A  PRODUCT
  router.delete("/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    // Slet billederne fra uploads-mappen
    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => {
        // Construct the full path relative to the project directory
        const fullPath = path.join(__dirname, "../../../../public", imagePath);
    
        // Delete the file using fs.unlink
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete image: ${fullPath}`, err);
          } else {
            console.log(`Deleted image: ${fullPath}`);
          }
        });
      });
    }
    

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
