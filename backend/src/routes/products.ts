import express from 'express';
import { Request, Response, Router} from "express";
import Product from '../models/Products'; // Importer din produktmodel
import mongoose from 'mongoose';
import { isValidObjectId } from "mongoose";
import NodeCache from 'node-cache';




const router = express.Router(); // Opret en ny router

// Opretter en ny cache-instans
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); // stdTTL = cache tid i sekunder, checkperiod = opdateringstid

// GET route for at hente produkterne fra databasen. Denne rute vil understøtte filtrering baseret på forespørgselsparametre.
// GET route for fetching products with pagination
router.get("/", async (Request, Response) => {
  try {
    const { type, collection, minPrice, maxPrice, page = 1, limit = 6, sort } = Request.query;

    const filter: any = {};
    // Bruger regex til case-insensitive match for type (f.eks. "Rings" vs "rings")
    if (type) {
      const types = Array.isArray(type) ? type : [type]; // Gør `type` til en array, hvis det ikke allerede er det
      filter.type = {
        // håndterer case sensitiveness
        $in: types.map((t) => new RegExp(`^${String(t)}$`, "i")), // Explicitly cast `t` to a string
      };
    }
        if (collection) {
      filter.productCollection = { $in: Array.isArray(collection) ? collection : [collection] };
    }
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };

    const sortOptions: any = {};
    if (sort === "priceHighToLow") sortOptions.price = -1;
    else if (sort === "priceLowToHigh") sortOptions.price = 1;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const totalProducts = await Product.countDocuments(filter);

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


// DELETE
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




// PUT
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








export default router;
