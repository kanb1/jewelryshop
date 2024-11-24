import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Heading, VStack, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


interface BillingProps {
  total: number;
  onPaymentSuccess: () => void;
}

const BillingInformation: React.FC<BillingProps> = ({ total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    // Fetch client secret from backend
    const response = await fetch('http://localhost:5001/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 139700, currency: 'usd' }),
    });
    const { clientSecret } = await response.json();

    // Confirm payment
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement!,
        },
    });

    if (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    } else if (paymentIntent?.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        onPaymentSuccess(); // Call your success handler
    }
};


  const navigate = useNavigate();

  const goBackToDelivery = () => navigate("/checkout");

  return (
    <Box>
      {/* Progress timeline */}
      <Box>
        <Text>Cart  Delivery  Billing  Confirmation</Text>
      </Box>

      <Button colorScheme="gray" onClick={goBackToDelivery}>
        Back to Delivery Information
      </Button>

      <VStack spacing={4} align="stretch">
        <CardElement />
        <Button colorScheme="blue" onClick={handlePayment}>
          Pay ${total}
        </Button>
      </VStack>
    </Box>
  );
};

export default BillingInformation;
