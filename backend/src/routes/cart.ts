import express, { Request, Response } from 'express';
import Cart from '../models/Cart';
import authenticateJWT from './authMiddleware';

const router = express.Router();

// Extend the Express Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Adjust the structure of `user` if needed
}

// GET - Fetch all items in the user's cart
router.get('/cart', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId; 

  try {
    const cartItems = await Cart.find({ userId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
});

// POST - Add product to the cart
router.post('/cart', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { productId, size, quantity } = req.body;
  const userId = req.user?.userId; 

  try {
    const existingItem = await Cart.findOne({ userId, productId, size });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      res.status(200).json({ message: 'Cart updated', cartItem: existingItem });
    } else {
      const cartItem = new Cart({ userId, productId, size, quantity });
      await cartItem.save();
      res.status(201).json({ message: 'Product added to cart', cartItem });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

// DELETE - Remove an item from the cart
router.delete('/cart/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const cartId = req.params.id;

  try {
    await Cart.findByIdAndDelete(cartId);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
});



// PUT - update cart item quantity
router.put('/cart/:id', async (Request, Response) => {
    const { id } = Request.params; // ID of the cart item
    const { quantity } = Request.body; // New quantity from the request body
  
    if (!quantity || quantity < 1) {
       Response.status(400).json({ error: 'Quantity must be greater than 0' });
       return;
    }
  
    try {
      const updatedItem = await Cart.findByIdAndUpdate(
        id,
        { quantity },
        { new: true } // Return the updated document
      );
  
      if (!updatedItem) {
         Response.status(404).json({ error: 'Cart item not found' });
         return;
      }
  
      Response.json(updatedItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      Response.status(500).json({ error: 'Internal server error' });
    }
  });

export default router;
