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

  const handlePayment = async () => {
    console.log("Cart Items being sent:", cartItems); // Debug cart items
  
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Please log in to complete the checkout.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId._id, // Ensure this is the ObjectId
            size: item.size,
            quantity: item.quantity,
          })),
          totalPrice: total, // Total price for the order
          deliveryInfo, // Delivery information from the user
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Order created successfully:", data);
        onPaymentSuccess(data.order.orderNumber);
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert("Order creation failed.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong. Please try again.");
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
          Pay ${total}
        </Button>
      </VStack>
    </Box>
  );
};

export default BillingInformation;
