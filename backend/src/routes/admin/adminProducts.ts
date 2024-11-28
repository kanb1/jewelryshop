import express from "express";
import Product from "../../models/Products";
import isAdmin from "../authMiddleware";

const router = express.Router();

// POST /api/admin/products - Add a new product
router.post("/", isAdmin, async (Request, Response) => {
  const { name, type, productCollection, price, sizes } = Request.body;

  if (!name || !type || !price || !sizes) {
     Response.status(400).json({ error: "Missing required fields." });
     return;
  }

  try {
    const product = new Product({
      name,
      type,
      productCollection,
      price,
      sizes,
    });

    await product.save();
    Response.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    console.error("Error creating product:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// PUT /api/admin/products/:id - Update a product
router.put("/:id", isAdmin, async (Request, Response) => {
  const { id } = Request.params;
  const updates = Request.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
       Response.status(404).json({ error: "Product not found." });
       return;
    }

    Response.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    console.error("Error updating product:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/admin/products/:id - Delete a product
router.delete("/:id", isAdmin, async (Request, Response) => {
  const { id } = Request.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
       Response.status(404).json({ error: "Product not found." });
       return;
    }

    Response.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

export default router;
