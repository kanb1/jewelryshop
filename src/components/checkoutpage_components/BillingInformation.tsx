import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, VStack, Button, Text } from "@chakra-ui/react";

interface BillingProps {
  total: number;
  onPaymentSuccess: (orderNumber: string) => void;
  cartItems: any[]; // Include the cart items as a prop
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }; // Include delivery info as a prop
}

const BillingInformation: React.FC<BillingProps> = ({
  total,
  onPaymentSuccess,
  cartItems,
  deliveryInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const calculateTotalPrice = () => {
    // Calculate the total price based on cart items
    return cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("jwt");
  console.log("Token retrieved in BillingInformation:", token); // Debug token retrieval
    console.log("Cart items being sent:", cartItems); // Log cart items before processing
    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id, // Use productId._id as the actual ID
      size: item.size,
      quantity: item.quantity,
    }));
    console.log("Mapped order items:", orderItems); // Validate here

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token in Authorization header

        },
        body: JSON.stringify({
          items: orderItems, // Correctly formatted items
          totalPrice: calculateTotalPrice(), // Calculate total price here
          deliveryInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        return;
      }

      const result = await response.json();
      console.log("Order created successfully:", result);
      onPaymentSuccess(result.order.orderNumber); // Trigger success callback
    } catch (err) {
      console.error("Error during payment processing:", err);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text>Billing Information</Text>
        <CardNumberElement />
        <CardExpiryElement />
        <CardCvcElement />
        <Button colorScheme="blue" onClick={handlePayment}>
          Pay ${calculateTotalPrice()}
        </Button>
      </VStack>
    </Box>
  );
};

export default BillingInformation;
