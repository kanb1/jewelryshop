import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import Stripe from "stripe";

dotenv.config();


const router = express.Router();
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not defined in .env");
    process.exit(1); // Exit the server if the key is missing
  }
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);



router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body; // Expect amount in cents and currency (e.g., USD)

    // Validate input
    if (!amount || !currency) {
      res.status(400).json({ error: "Amount and currency are required" });
      return; // Exit early if validation fails
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 139700 for $1397.00)
      currency, 
    });

    // Send client secret back to frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: (error as Error).message }); 
  }
});

export default router;
