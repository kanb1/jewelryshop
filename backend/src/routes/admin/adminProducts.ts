import express from "express";
import Product from "../../models/Products";
import adminMiddleware from "../authMiddleware";
import multer from "multer";
import path from "path";
// vi vil gerne fjerne billederne fra uploads når produktet bliver slettet
import fs from "fs"; 
// ****SEcurity
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";


const router = express.Router();
router.use(adminMiddleware); // Apply admin middleware to all routes in this file!!

// Opsætter en virtuel DOM til DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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

interface ProductRequestBody {
  name?: string;
  type?: string;
  productCollection?: string;
  price?: number;
  sizes?: string;
  images?: string[]; // Optional, depending on how you handle this
}


  //************************************************************************* ADD NEW PRODUCT
  // uses multer to handle image uploads from the frontend-request
  router.post("/", adminMiddleware, upload.array("images"), async (req, res) => {
    try {
      // Rens input med DOMPurify
      const name = DOMPurify.sanitize(req.body.name);
      const type = DOMPurify.sanitize(req.body.type);
      const productCollection = req.body.productCollection
        ? DOMPurify.sanitize(req.body.productCollection)
        : undefined;
      const price = parseFloat(req.body.price);
      const sizes = DOMPurify.sanitize(req.body.sizes);
  
      // Tjek for manglende eller ugyldige felter
      if (!name || !type || isNaN(price) || !sizes) {
        res.status(400).json({ error: "Missing or invalid fields." });
        return;
      }
  
      // Håndtering af billeder
      const imagePaths =
        (req.files as Express.Multer.File[])?.map(
          (file) => `/uploads/${file.filename}`
        ) || [];
  
      // Opret nyt produkt
      const product = new Product({
        name,
        type,
        productCollection,
        price,
        sizes: sizes.split(",").map((size: string) => size.trim()),
        images: imagePaths,
      });
  
      await product.save();
      res
        .status(201)
        .json({ message: "Product created successfully.", product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  //************************************************************************* UPDATE  PRODUCT
  router.put("/:id", adminMiddleware, upload.array("images"), async (req, res) => {
    const { id } = req.params;
  
    try {
      const updates: ProductRequestBody = {
        name: req.body.name ? DOMPurify.sanitize(req.body.name) : undefined,
        type: req.body.type ? DOMPurify.sanitize(req.body.type) : undefined,
        productCollection: req.body.productCollection
          ? DOMPurify.sanitize(req.body.productCollection)
          : undefined,
        price: req.body.price ? parseFloat(req.body.price) : undefined, // parseFloat remains here
        sizes: req.body.sizes ? DOMPurify.sanitize(req.body.sizes) : undefined,
      };
  
      // Handle uploaded images
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const imagePaths = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/${file.filename}`
        );
        updates.images = imagePaths;
      }
  
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  
      if (!product) {
        res.status(404).json({ error: "Product not found." });
        return;
      }
  
      res.status(200).json({ message: "Product updated successfully.", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  
  

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
