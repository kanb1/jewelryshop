import express, { Request, Response } from 'express';
import RecycledProduct from '../models/RecycledProduct';
import authenticateJWT, { adminMiddleware } from '../routes/authMiddleware';
import multer from 'multer';
import path from 'path';
import transporter from '../helpers/emailConfig'; // Import the transporter from emailConfig




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

router.put("/:id", authenticateJWT, async (Request: any, Response) => {
  try {
    const { id } = Request.params;
    const userId = Request.user?.userId;
    const { visibility } = Request.body; // 'public' or 'private'


    // Check if user is authenticated
    if (!userId) {
      Response.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Fetch the existing product
    const product = await RecycledProduct.findById(id);
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
    await product.save();

    // Update other product details (like name, price, size, visibility, and type)
    product.name = Request.body.name || product.name;
    product.price = Request.body.price || product.price;
    product.size = Request.body.size || product.size;
    product.visibility = Request.body.visibility || product.visibility;
    product.type = Request.body.type || product.type;

    // Save the updated product
    await product.save();

    Response.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    Response.status(500).json({ error: "Failed to update product" });
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
router.delete("/:productId", authenticateJWT, adminMiddleware, async (Request, Response) => {
  const { productId } = Request.params;

  try {
    // Find the product and populate the userId field to get the associated user document
    const deletedProduct = await RecycledProduct.findByIdAndDelete(productId).populate('userId');

    if (!deletedProduct) {
      Response.status(404).json({ error: "Product not found" });
      return;
    }

    // Check if the populated product has a userId field, and access the user's email
    const ownerEmail = deletedProduct.userId.email; // Now, userId is populated with the full User document

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address from environment variable
      to: ownerEmail, // Recipient address
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

    // Send success response
    Response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    Response.status(500).json({ error: "Failed to delete product" });
  }
});


export default router;
