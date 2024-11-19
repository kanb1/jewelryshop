import express from 'express';
import { Request, Response, Router} from "express";
import Product from '../models/Products'; // Importer din produktmodel
import mongoose from 'mongoose';
import { isValidObjectId } from "mongoose";




const router = express.Router(); // Opret en ny router

// GET route for at hente produkterne fra databasen. Denne rute vil understøtte filtrering baseret på forespørgselsparametre.
router.get('/', async (req, res) => {
  try {
    // Læs forespørgselsparametre fra URL'en
    const { type, collection, minPrice, maxPrice } = req.query;

    // Byg et dynamisk filter baseret på de angivne parametre
    const filter: any = {};
    if (type) filter.type = type; // Filtrer efter type (fx "rings")
    if (collection) {
      filter.productCollection = { $in: Array.isArray(collection) ? collection : [collection] };
    }    
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) }; // Minimumpris
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) }; // Maksimumpris

    // Hent produkter fra databasen baseret på filteret
    const products = await Product.find(filter);

    // Send produkterne som JSON-respons
    res.status(200).json(products);
  } catch (err) {
    // Håndter fejl og send en fejlbesked
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










export default router;
