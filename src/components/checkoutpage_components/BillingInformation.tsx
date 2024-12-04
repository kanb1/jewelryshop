import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, VStack, Button, Text } from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";

interface BillingProps {
  total: number;
  onPaymentSuccess: (orderNumber: string) => void;
  cartItems: any[]; // Include the cart items as a prop
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryMethod: "home" | "parcel-shop"; // Add this line

  };
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
  
    // Debugging: Log token and initial cart items
    console.log("Token retrieved in BillingInformation:", token); // Check if JWT is retrieved correctly
    console.log("Cart items being sent:", cartItems); // Validate cart items before processing
  
    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id, // Validate product ID mapping
      size: item.size,
      quantity: item.quantity,
    }));
  
    // Debugging: Log orderItems to ensure proper mapping
    console.log("Mapped order items:", orderItems); 
  
    // Debugging: Log delivery information
    console.log("Delivery Info:", deliveryInfo); 
  
    // Debugging: Log calculated total price
    console.log("Total price being sent:", calculateTotalPrice());
  
    try {
      // Debugging: Log API request payload
      const requestBody = {
        items: orderItems,
        totalPrice: calculateTotalPrice(),
        deliveryInfo,
        deliveryMethod: deliveryInfo.deliveryMethod,
      };
      console.log("Request payload to API:", requestBody);
  
      // Make the API call
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Debug: Ensure token is passed
        },
        body: JSON.stringify(requestBody),
      });
  
      // Debugging: Log the raw response
      console.log("Raw response from API:", response);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert(`Order creation failed: ${errorData.error || "Unknown error"}`); // Inform user about the error
        return;
      }
  
      // Parse the successful response
      const result = await response.json();
  
      // Debugging: Log successful result
      console.log("Order created successfully:", result);
  
      // Trigger success callback
      onPaymentSuccess(result.order.orderNumber);
    } catch (err) {
      // Debugging: Log any unexpected errors
      console.error("Error during payment processing:", err);
      alert("Something went wrong during payment. Please try again.");
    }
  };
  

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text>Billing Information</Text>
        <CardNumberElement />
        <CardExpiryElement />
        <CardCvcElement />
        <ButtonComponent
          text={`Pay $${calculateTotalPrice()}`}
          onClick={handlePayment}
          variant="greenBtn"
        />
      </VStack>
    </Box>
  );
};

export default BillingInformation;
