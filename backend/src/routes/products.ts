import express from 'express';
import { Request, Response, Router} from "express";
import Product from '../models/Products'; // Importer din produktmodel
import mongoose from 'mongoose';
import { isValidObjectId } from "mongoose";




const router = express.Router(); // Opret en ny router

// GET route for at hente produkterne fra databasen. Denne rute vil understøtte filtrering baseret på forespørgselsparametre.
// GET route for fetching products with pagination
router.get('/', async (req, res) => {
  try {
    // Get query parameters (type, collection, price range, page, limit)
    const { type, collection, minPrice, maxPrice, page = 1, limit = 6, sort } = req.query;

    // Build the filter object
    const filter: any = {};
    if (type) filter.type = type;
    if (collection) {
      filter.productCollection = { $in: Array.isArray(collection) ? collection : [collection] };
    }
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
    
     // Determine sort order
     const sortOptions: any = {};
     if (sort === 'priceHighToLow') {
       sortOptions.price = -1; // Descending order
     } else if (sort === 'priceLowToHigh') {
       sortOptions.price = 1; // Ascending order
     }

    // Pagination: Calculate skip and limit
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const products = await Product.find(filter)
    .sort(sortOptions) // Apply sorting
    .skip(skip)
    .limit(parseInt(limit as string));

    

    // Count total products to determine number of pages
    const totalProducts = await Product.countDocuments(filter);

    // Send the products and total count as response
    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / parseInt(limit as string)),
      currentPage: parseInt(page as string),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err });
  }
});


// DELETE
// By adding any to both req and res, TypeScript is no longer enforcing strict type checks, which is why the error disappears. This approach bypasses TypeScript's type validation but is not recommended for production code because it sacrifices the type safety TypeScript offers.
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    console.log('Received ID:', id); // Debug log

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      console.log('Invalid Product ID:', id); // Debug log
      return res.status(400).json({ error: 'Invalid Product ID' });
    }

    const result = await Product.findByIdAndDelete(id);
    console.log('Deletion result:', result); // Debug log

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






export default router;
