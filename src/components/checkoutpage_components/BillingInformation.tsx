import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Heading, VStack, Button } from "@chakra-ui/react";

interface BillingProps {
  total: number;
  onPaymentSuccess: () => void;
}

const BillingInformation: React.FC<BillingProps> = ({ total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error("Payment error:", error);
    } else {
      console.log("Payment successful:", paymentMethod);
      onPaymentSuccess();
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>
        Billing Information
      </Heading>
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
