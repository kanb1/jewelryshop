import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, VStack } from "@chakra-ui/react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" p={5}>
      <VStack spacing={4}>
        <Button onClick={() => navigate("/admin/orders")} colorScheme="blue">
          Manage Orders
        </Button>
        <Button onClick={() => navigate("/admin/products")} colorScheme="green">
          Manage Products
        </Button>
        <Button onClick={() => navigate("/admin/users")} colorScheme="teal">
          Manage Users
        </Button>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
