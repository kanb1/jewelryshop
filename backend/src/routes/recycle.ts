import express, { Request, Response } from 'express';
import RecycledProduct from '../models/RecycledProduct';
import authenticateJWT, { adminMiddleware } from '../routes/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';  
import transporter from '../helpers/emailConfig'; 
import { body, param, validationResult } from "express-validator";
import crypto from "crypto"; 




const router = express.Router(); // Create a new router instance

// Interface for handling authenticated requests
interface AuthenticatedRequest extends Request {
    user?: { userId: string; username: string; role?: string }; // Ensure user info is available
  }


// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************

// Set up multer storage with file type and size validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../public/recycleproduct_images"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueSuffix = crypto.randomBytes(4).toString("hex"); // Add randomness
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************


//*************************************************** ADD A NEW RECYCLED PRODUCT
router.post(
  "/",
  authenticateJWT,
  upload.single("image"), // Use the multer middleware
  [
    body("name")
      .isString()
      .trim()
      .escape() // Escape input to prevent XSS
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters."),
    body("price")
      .isFloat({ gt: 0, lt: 10000 })
      .withMessage("Price must be a positive value and below 10,000."),
    body("size")
      .isIn(["Onesize", "6", "7", "8", "9", "10"])
      .withMessage("Invalid size value."),
    body("visibility")
      .isIn(["public", "private"])
      .withMessage("Invalid visibility value.")
      .escape(), // Escape visibility field
    body("type")
      .isIn(["ring", "necklace", "bracelet", "earring"])
      .withMessage("Invalid type of jewelry.")
      .escape(), // Escape type field
  ],
  async (req: AuthenticatedRequest, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
       res.status(400).json({ errors: errors.array() });
       return;
    }

    const { name, price, size, visibility, type } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      console.error("User ID missing in request.");
       res.status(401).json({ error: "Access denied." });
      return;

    }

    if (!req.file) {
      console.error("File upload failed. No file found in request.");
       res.status(400).json({ error: "File upload failed. Please upload a valid file." });
      return;
    }

    // Validering af filtypen
    if (!["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
       res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and JPG are allowed." });
       return;
    }

    try {
      const imagePath = `recycleproduct_images/${req.file.filename}`;

      const newProduct = new RecycledProduct({
        name,
        price,
        size,
        visibility,
        type,
        userId,
        images: imagePath,
      });

      await newProduct.save();
      console.log("New product saved successfully:", newProduct);

      res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  }
);



// ************************************************************************ UPDATE OTHER DETAILS

router.put("/:id", authenticateJWT, [
  body("name").optional().trim().escape(),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be positive."),
  param("id").isMongoId().withMessage("Invalid product ID."),
  ],async (Request: any, res: Response) => {
  try {
    const { id } = Request.params;
    const userId = Request.user?.userId;
    const { visibility } = Request.body; // 'public' or 'private'


    // Check if user is authenticated
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Fetch the existing product
    const product = await RecycledProduct.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Ensure the product belongs to the authenticated user
    if (product.userId.toString() !== userId) {
      res.status(403).json({ error: "You can only edit your own products" });
       return;
    }

    // Update the product's visibility
    product.visibility = visibility;
    await product.save();

    // Update other product details (like name, price, size, visibility, and type)
    product.name = Request.body.name || product.name;
    product.price = Request.body.price || product.price;
    product.size = Request.body.size || product.size;
    product.visibility = Request.body.visibility || product.visibility;
    product.type = Request.body.type || product.type;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});


//*************************************************** GET ALL RECYCLED PRODUCTS, THAT IS VIEWABLE FOR ALL
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await RecycledProduct.find({ visibility: "public" });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recycled products:", error);
    res.status(500).json({ error: "Failed to fetch recycled products" });
  }
});

//*************************************************** GET ALL PRODUCTS CREATED BY LOGGED IN USER
router.get("/user", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const userId = req.user?.userId;

  if (!userId) {
     Response.status(401).json({ error: "Unauthorized" });
     return;
  }

  try {
    const userProducts = await RecycledProduct.find({ userId });
    Response.status(200).json(userProducts);
  } catch (error) {
    console.error("Error fetching user's recycled products:", error);
    Response.status(500).json({ error: "Failed to fetch user's recycled products" });
  }
});


//*************************************************** EDIT VISIBILITY OF A RECYCLED PRODUCT (PUBLIC/PRIVATE)
// Endpoint to update the visibility of a recycled product (public/private)
router.put("/:productId/visibility", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const { productId } = req.params;
  const { visibility } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
     Response.status(401).json({ error: "Unauthorized" });
    return;

  }

  try {
    const product = await RecycledProduct.findById(productId);
    if (!product) {
       Response.status(404).json({ error: "Product not found" });
      return;

    }

    // Ensure the product belongs to the authenticated user
    if (product.userId.toString() !== userId) {
       Response.status(403).json({ error: "You can only edit your own products" });
       return;
    }

    // Update the product's visibility
    product.visibility = visibility;
    const updatedProduct = await product.save();

    Response.status(200).json({ message: "Product visibility updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    Response.status(500).json({ error: "Failed to update product visibility" });
  }
});




//*************************************************** DELETE A RECYCLED PRODUCT (ADMIN & PRODUCTOWNER)
router.delete("/:productId", authenticateJWT, adminMiddleware, [
  param("productId").isMongoId().withMessage("Invalid product ID."),
  ], async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    // Find the product and populate the userId field to get the associated user document
    const deletedProduct = await RecycledProduct.findByIdAndDelete(productId).populate('userId');

    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (deletedProduct.images && deletedProduct.images.length > 0) {
      deletedProduct.images.forEach((image: string) => {
        // Ensure the correct path relative to the 'public' folder
        const imagePath = path.join(__dirname, '../../../public', image);

    
        if (fs.existsSync(imagePath)) {
          // Delete the image file
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${image}`);
        } else {
          console.log(`Image not found: ${imagePath}`);
        }
      });
    }


    // Check if the populated product has a userId field, and access the user's email
    const ownerEmail = deletedProduct.userId.email; 

    const mailOptions = {
      from: process.env.EMAIL_USER,  
      to: ownerEmail, 
      subject: "Your product has been banned", 
      text: `Dear user,\n\nYour product "${deletedProduct.name}" has been banned from the platform due to policy violations.\n\nRegards,\nJewelryShop Team`,
    };

    // Send email notification to the product owner
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


export default router;
