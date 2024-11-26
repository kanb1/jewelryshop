import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface ConfirmationProps {
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  total: number;
  orderNumber: string | null;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  deliveryInfo,
  total,
  orderNumber,
}) => {
  const navigate = useNavigate();

  const goToHomePage = () => navigate("/");

  return (
    <Box p={6} maxW="500px" mx="auto" bg="white" boxShadow="md" borderRadius="md">
      <Heading size="lg" textAlign="center" mb={4}>
        Payment Successful!
      </Heading>
      <Text textAlign="center" mb={4}>
        Thank you for your purchase! Your order #
        <strong>{orderNumber || "N/A"}</strong> has been placed successfully.
      </Text>
      <Text textAlign="center" mb={4}>
        Delivery Address: {deliveryInfo.address}, {deliveryInfo.city},{" "}
        {deliveryInfo.postalCode}, {deliveryInfo.country}
      </Text>
      <Text textAlign="center" mb={4}>
        Total Paid: ${total}
      </Text>
      <Text textAlign="center" mb={4}>
        We have sent a confirmation to your email!
      </Text>
      <Button colorScheme="blue" size="lg" onClick={goToHomePage} w="100%">
        Go to Home
      </Button>
    </Box>
  );
};

export default Confirmation;
