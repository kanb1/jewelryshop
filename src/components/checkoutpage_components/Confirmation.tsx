import React, { useEffect } from "react";
import { Box, Heading, Text, Divider, Icon, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../shared/ButtonComponent";
import { CheckCircleIcon } from "@chakra-ui/icons";

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

  useEffect(() => {
    console.log("Confirmation Props:", { deliveryInfo, total, orderNumber });
  }, [deliveryInfo, total, orderNumber]);
  

  return (
    <Box
    maxW="600px"
    mx="auto"
    mt={10}
    p={8}
    bg="white"
    boxShadow="lg"
    borderRadius="lg"
    textAlign="center"
  >
    {/* Success Icon */}
    <Icon as={CheckCircleIcon} w={12} h={12} color="green.400" mb={4} />

    {/* Heading */}
    <Heading size="lg" mb={6} color="gray.700">
      Payment Successful!
    </Heading>

    {/* Order Details */}
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="medium" color="gray.600">
        Thank you for your purchase! Your order{" "}
        <Text as="span" fontWeight="bold" color="black">
          #{orderNumber || "N/A"}
        </Text>{" "}
        has been placed successfully.
      </Text>

      <Divider />

      <Text fontSize="md" color="gray.500">
        <Text as="span" fontWeight="bold" color="gray.600">
          Delivery Address:
        </Text>{" "}
        {deliveryInfo.address}, {deliveryInfo.city}, {deliveryInfo.postalCode},{" "}
        {deliveryInfo.country}
      </Text>

      <Text fontSize="lg" fontWeight="bold" color="black">
        Total Paid: ${total}
      </Text>

      <Divider />

      <Text fontSize="md" color="gray.600">
        A confirmation has been sent to your email.
      </Text>
    </VStack>

    {/* Go to Home Button */}
    <ButtonComponent
      text="Go to Home"
      onClick={goToHomePage}
      variant="primaryBlackBtn"
      styleOverride={{
        width: "100%",
        marginTop: "1.5rem",
        borderRadius: "8px",
      }}
    />
  </Box>
);
};

export default Confirmation;
