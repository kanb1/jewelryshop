import React from 'react'; 
import Checkout from '../components/checkoutpage_components/Checkout';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load the publishable key from environment variables
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("Stripe Public Key:", stripePublicKey);


// Initialize Stripe with the public key
const stripePromise = loadStripe(stripePublicKey!);

const Checkoutpage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
    <Checkout/>
    </Elements>

  );
};

export default Checkoutpage;
