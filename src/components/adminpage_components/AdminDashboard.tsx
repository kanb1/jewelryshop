import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, VStack, Heading } from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      textAlign="center"
      p={5}
      minH="100vh" // Full height for vertical centering
      display="flex"
      justifyContent="center" 
    >
      <VStack spacing={6} p={40}>
        {/* Headline */}
        <Heading as="h1" size="lg" mb={4} color="gray.700">
          Welcome to the Admin Dashboard
        </Heading>

        {/* Buttons */}
        <ButtonComponent
          text="Manage Orders"
          variant="primaryBlackBtn" // Replace with your desired variant
          onClick={() => navigate("/admin/orders")}
        />
        <ButtonComponent
          text="Manage Products"
          variant="primaryBlackBtn" // Replace with your desired variant
          onClick={() => navigate("/admin/products")}
        />
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
