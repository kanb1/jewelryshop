import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import Stripe from "stripe";

dotenv.config();


const router = express.Router();
// ************* STRIPE INITIALIZATION
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not defined in .env");
    process.exit(1); // Exit the server if the key is missing, preventing stripe errors
  }
  // initialiserer Stripe med min secret key så jeg kan bruge stripe API-funktioner
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// ******************************' CREATING THE STRIPE PAYMENT
// Hådnterer oprettelse af en PaymentIntent
router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body; // Expect amount in cents and currency (e.g., USD)

    // Validate input (if both amount and currency are provided)
    if (!amount || !currency) {
      res.status(400).json({ error: "Amount and currency are required" });
      return; // Exit early if validation fails
    }

    // Sender en anmodning til Stripe for at oprette en PaymentIntent
    // Stripe opretter en paymentintent og returnerer en client_secret (som bruges som bekrfæteles af betaling uden at eksponere for mange oplysninger)
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 139700 for $1397.00)
      currency, 
    });

    // client_secret returneres til frontend, som frontenden kan bruge til at bekræfte betalingen med (stripe.confirmCardPayment())
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: (error as Error).message }); 
  }
});

export default router;
