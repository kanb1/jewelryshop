import express, { Router, Request, Response } from 'express';
import RecycledProduct from '../models/RecycledProduct';
import authenticateJWT from '../routes/authMiddleware';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';



const router = express.Router(); // Create a new router instance

// Interface for handling authenticated requests
interface AuthenticatedRequest extends Request {
    user?: { userId: string; username: string; role?: string }; // Ensure user info is available
  }


  // Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Save the image in the 'recycleproduct_images' folder
      cb(null, path.join(__dirname, "../../../public/recycleproduct_images"));
    },
    filename: (req, file, cb) => {
      // Generate unique filename using timestamp
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });






//*************************************************** ADD A NEW RECYCLED PRODUCT
// Route to create a new recycled product with image upload
router.post("/", authenticateJWT, upload.single("image"), async (Request: any, Response) => {
    const { name, price, size, visibility, type } = Request.body;
    const userId = Request.user?.userId; // Ensure the user is authenticated

  if (!userId) {
     Response.status(401).json({ error: "Unauthorized" });
     return;
  }

  try {
    const imagePath = Request.file ? `recycleproduct_images/${Request.file.filename}` : null;

    const newProduct = new RecycledProduct({
      name,
      price,
      size,
      visibility,
      type,
      userId,
      images: imagePath, // Store the image path
    });

    await newProduct.save();
    Response.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    Response.status(500).json({ error: "Failed to create product" });
  }
  });
  

// ************************************************************************ UPDATE OTHER DETAILS
//   router.put("/:id", authenticateJWT, upload.single("image"), async (Request: any, Response) => {
//     try {
//       // Get the product ID and user ID
//       const { id } = Request.params;
//       const userId = Request.user?.userId;
  
//       // Check if user is authenticated
//       if (!userId) {
//          Response.status(401).json({ error: "Unauthorized" });
//          return;
//       }
  
//       // Fetch the existing product
//       const product = await RecycledProduct.findById(id);
//       if (!product) {
//          Response.status(404).json({ error: "Product not found" });
//         return;

//       }
  
//       // If a new image is uploaded, delete the old one
//       if (Request.file) {
//         // Delete old image if it exists
//         if (product.images) {
//           const oldImagePath = path.join(__dirname, '../../../../public', product.images);
//           try {
//             fs.unlinkSync(oldImagePath);  // Delete the old image from the filesystem
//             console.log(`Deleted old image: ${oldImagePath}`);
//           } catch (err) {
//             console.error("Failed to delete old image:", err);
//           }
//         }
  
//         // Update the product with the new image path
//         product.images = `recycleproduct_images/${Request.file.filename}`;
//       }
  
//       // Update other product details (like name, price, etc.)
//       product.name = Request.body.name || product.name;
//       product.price = Request.body.price || product.price;
//       product.size = Request.body.size || product.size;
//       product.visibility = Request.body.visibility || product.visibility;
//       product.type = Request.body.type || product.type;
  
//       // Save the updated product
//       await product.save();
  
//       Response.status(200).json({ message: "Product updated successfully!", product });
//     } catch (error) {
//       console.error("Error updating product:", error);
//       Response.status(500).json({ error: "Failed to update product" });
//     }
//   });
  

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

router.put("/:productId/visibility", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
  const { productId } = req.params;
  const { visibility } = req.body; // either 'public' or 'private'
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

    if (product.userId.toString() !== userId) {
       Response.status(403).json({ error: "You can only edit your own products" });
      return;

    }

    product.visibility = visibility;
    await product.save();

    Response.status(200).json({ message: "Product visibility updated successfully" });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    Response.status(500).json({ error: "Failed to update product visibility" });
  }
});

//*************************************************** DELETE A RECYCLED PRODUCT (ADMIN & PRODUCTOWNER)
router.delete("/:productId", authenticateJWT, async (req: AuthenticatedRequest, Response) => {
    const { productId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
  
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
  
      // Check if the logged-in user is the owner or an admin
      if (product.userId.toString() !== userId && userRole !== "admin") {
         Response.status(403).json({ error: "You can only delete your own products or if you're an admin" });
         return;
      }
  
      await RecycledProduct.findByIdAndDelete(productId); 
  
      Response.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      Response.status(500).json({ error: "Failed to delete product" });
    }
  });

export default router;
