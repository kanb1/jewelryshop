import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

interface ConfirmationProps {
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  total: number;
}

const Confirmation: React.FC<ConfirmationProps> = ({ deliveryInfo, total }) => {
  return (
    <Box>
      <Heading size="lg">Order Confirmed!</Heading>
      <Text>Thank you for your order!</Text>
      <Box mt={4}>
        <Heading size="md">Delivery Information:</Heading>
        <Text>{deliveryInfo.address}</Text>
        <Text>
          {deliveryInfo.city}, {deliveryInfo.postalCode}
        </Text>
        <Text>{deliveryInfo.country}</Text>
      </Box>
      <Box mt={4}>
        <Heading size="md">Total Amount:</Heading>
        <Text>${total}</Text>
      </Box>
    </Box>
  );
};

export default Confirmation;
