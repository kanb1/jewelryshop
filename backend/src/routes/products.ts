import express from 'express';
import { Request, Response, Router} from "express";
import Product from '../models/Products'; // Importer din produktmodel
import mongoose from 'mongoose';
import { isValidObjectId } from "mongoose";
import NodeCache from 'node-cache';
import Comment from '../models/Comment';
import authenticateJWT from '../routes/authMiddleware';
// ****Security 
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { body, validationResult } from "express-validator";






// Express Router is a feature of the Express.js framework that helps you organize your REST API 
// Each router defines routes (URLs) and their associated HTTP methods
const router = express.Router(); // Opret en ny router

// Caching optimizes performance by storing frequent data responses.
// For read-heavy operations like displaying orders, the backend could cache results, but this was not directly implemented.
// Opretter en ny cache-instans
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // stdTTL = cache tid i sekunder, checkperiod = opdateringstid


const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

interface AuthenticatedRequest extends Request {
  user?: { userId: string; username: string; role?: string };
}

// ******************************************************************* GET PRODUCTS
// Pagination, Filtering and Sorting while fetching
// GET route for fetching products with 
router.get("/", async (Request, Response) => {
  try {
    // extracts parameters from request.query (from the frontend) as part of the URL
    // example --> /api/products?type=rings&page=2&limit=10 --> request query would be like {"type": "rings", "page": "2", "limit": "10"} and so on
    // sort is the sortingorder
    const { type, collection, minPrice, maxPrice, page = 1, limit = 6, sort } = Request.query;

    // filter object --> describes how u want to filter the data from the db
      // sendes som argument til Product.find(filter)
    const filter: any = {};
    // hvis type parameteren findes --> Gør det til array altid, ellers konverter den
    if (type) {
      const types = Array.isArray(type) ? type : [type]; 
      filter.type = {
        // opretter et mognodb filter for type ($in), som tillader flere værdier:
        //  "type": {"$in": [/^rings$/i, /^necklaces$/i]
        // matcher værdier case-insensitive ved hjælp af regexp men virker ikke
        $in: types.map((t) => new RegExp(`^${String(t)}$`, "i")), 
      };
    }
        if (collection) {
      filter.productCollection = { $in: Array.isArray(collection) ? collection : [collection] };
    }
    // tilføjer minimum og maksismumspris til filter.price
    // $gte --> større end eller lig med, $lte --> mindre end
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };

    //************** */ sortering af prisen
    // opretter et objekt til at specificere sorteringsrækkefølge: -1 sorter faldende (høj til lav), 1 sorter stigende
    // example: URL /api/products?sort=priceHighToLow
    // sorting would then be --> {"price": -1}
    const sortOptions: any = {};
    if (sort === "priceHighToLow") sortOptions.price = -1;
    else if (sort === "priceLowToHigh") sortOptions.price = 1;


    //************* */ pagination
    // beregner hvor mange resultater der skal sprignes over for den aktuelle side
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // query til mongoDB
    // filtrerer produkterne baseret på filter
    // sorterer resultaterne baseret på sortoptions
    // springer skip produkter over og henter kun limit antal
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    // finder det samlede antal produtker der matcher filter
    const totalProducts = await Product.countDocuments(filter);

    // totalpages --> beregner det totalae antal sider
    // eksempelvis hvis der er 30 produkter og limit = 6 = 5
      // respons ville være et json objekt med "products": [produkter for denne side], "totalproducts":30 osv.. current page er den aktuelle side der vises
    const result = {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / parseInt(limit as string)),
      currentPage: parseInt(page as string),
    };

    Response.status(200).json(result);
  } catch (err) {
    Response.status(500).json({ error: "Failed to fetch products", details: err });
  }
});


// ***************************************************************************************************************** DELETE PRODUCTS
// By adding any to both req and res, TypeScript is no longer enforcing strict type checks, which is why the error disappears. This approach bypasses TypeScript's type validation but is not recommended for production code because it sacrifices the type safety TypeScript offers.
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    console.log('Received ID:', id); 

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      console.log('Invalid Product ID:', id); 
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    const result = await Product.findByIdAndDelete(id);
    console.log('Deletion result:', result); 

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: `Product with ID ${id} deleted successfully.`,
    });
  } catch (err) {
    console.error('Error during product deletion:', err);
    res.status(500).json({ error: 'Failed to delete the product', details: err });
  }
});




// ***************************************************************************************************************** ADD PRODUCTS
// POST /api/products - Add one or multiple products
router.post('/', async (req, res) => {
  try {
    const products = req.body; // Expecting an array of products or a single product

    // Check if the input is an array
    if (Array.isArray(products)) {
      // Insert multiple products
      const savedProducts = await Product.insertMany(products);
      res.status(201).json(savedProducts);
    } else {
      // Insert a single product
      const newProduct = new Product(products);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product(s)', details: err });
  }
});




// ***************************************************************************************************************** UPDATE PRODUCTS
// PUT /api/products/:id - Update a product by its ID
router.put('/:id', async (Request, Response) => {
  try {
    const { id } = Request.params; // Get product ID from URL parameter
    const updatedData = Request.body; // Get updated product data from request body

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
       Response.status(400).json({ error: 'Invalid Product ID' });
       return;
    }

    // Find the product by its ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated data passes validation
    });

    // If the product was not found
    if (!updatedProduct) {
       Response.status(404).json({ error: 'Product not found' });
       return;
    }

    // Return the updated product in the response
    Response.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    Response.status(500).json({ error: 'Failed to update the product', details: err });
  }
});

// ******************************************************************************************************* GET COLLECTIONS
// New route to fetch all collections independently from the products
router.get('/collections', async (req, res) => {
  try {
    // Get all unique collections from the products
    const collections = await Product.distinct('productCollection');
    
    // Send the collections back as a response
    res.status(200).json({
      collections,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections', details: err });
  }
});


// ******************************************************************************************************* GET PRODUCT BY ID
// GET /products/:id - Fetch single product by ID
router.get('/:id', async (Request, Response) => {
  try {
    const { id } = Request.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
       Response.status(400).json({ error: 'Invalid product ID' });
       return;
    }

    // Fetch product
    const product = await Product.findById(id);
    if (!product) {
       Response.status(404).json({ error: 'Product not found' });
       return;

    }

    Response.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    Response.status(500).json({ error: 'Failed to fetch product', details: err });
  }
});
















// *************************************************************COMMENTS*************************************************************



// ********************************************************************** GET COMMENTS TO EACH PRODUCT
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err });
  }
});



// ********************************************************************** ADD A COMMENT
router.post("/:id/comments", authenticateJWT, [
  // Validate and sanitize the content field
  body("content")
    .isString().withMessage("Content must be a string.")
    .trim() // Removes leading/trailing whitespace
    .escape() // Escapes HTML entities to prevent XSS
    .notEmpty().withMessage("Content cannot be empty.")
    .isLength({ min: 1 }).withMessage('Comment content is required')
    .isLength({ max: 500 }).withMessage("Content must be under 500 characters."),
], async (req: AuthenticatedRequest, res: Response) => {
  console.log("Request user data from JWT:", req.user); // Log user-data fra middleware
  console.log("Request body content:", req.body); // Log dataen, der bliver sendt fra frontend

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }


  try {
    const { content } = req.body;
    const { userId, username } = req.user || {}; // Tjek at req.user findes

    if (!userId || !username) {
      console.error("Missing userId or username in req.user:", req.user); // Log manglende user-data
      res.status(403).json({ error: "Unauthorized: Missing user data" });
      return;
    }

    // Sanitize content to allow specific tags
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: ["b", "i", "strong", "em"] });


    const newComment = new Comment({
      productId: req.params.id,
      userId,
      username,
      content: sanitizedContent,
    });
    console.log("Data to be saved in Comment model:", newComment); // Log dataen, før den gemmes


    const savedComment = await newComment.save();
    console.log("Saved comment:", savedComment); // Log det gemte kommentarobjekt
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error adding comment:", err); // Log fejl ved tilføjelse af kommentar
    res.status(500).json({ error: "Failed to add comment", details: err });
  }
});


// ********************************************************************** DELETE YOUR COMMENT
// Assuming you're using express and your authenticateJWT middleware is properly set
router.delete("/:id/comments/:commentId", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId; // This should be set by your authenticateJWT middleware
    const userRole = req.user?.role; // Assuming you're storing the role in the JWT

    if (!userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    // Find the comment and ensure the logged-in user is the owner
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    // Allow admins to delete any comment
    if (comment.userId.toString() !== userId && userRole !== 'admin') {
      res.status(403).json({ error: "You can only delete your own comments or you need admin access" });
      return;
    }

    // If user is allowed, delete the comment
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});



export default router;
