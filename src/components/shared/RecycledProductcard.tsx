import React from "react";
import { Box, Image, Text, Button, Flex, VStack } from "@chakra-ui/react";

// Define the expected structure of the decoded token
interface DecodedToken {
  userId: string;
  role: string; // Add role to check if the user is admin
}

interface RecycleProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    size: string;
    visibility: string;
    images: string[];
    userId: string;
  };
  updateCartCount: () => void;
  handleVisibilityToggle: (productId: string, currentVisibility: string) => void;
  handleDeleteProduct: (productId: string) => void; // Handle delete product
}

const RecycleProductCard: React.FC<RecycleProductCardProps> = ({
  product,
  updateCartCount,
  handleVisibilityToggle,
  handleDeleteProduct
}) => {
  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      try {
        // Decode the Base64 payload of the token
        const base64Payload = token.split('.')[1];
        const decodedPayload: DecodedToken = JSON.parse(atob(base64Payload)); // Base64 decode and parse JSON

        return decodedPayload.userId;  // Extract userId from the decoded payload
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
  
    return null;
  };

  const getUserRoleFromToken = (): string | null => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        // Decode the Base64 payload to extract role
        const base64Payload = token.split('.')[1];
        const decodedPayload: DecodedToken = JSON.parse(atob(base64Payload)); // Base64 decode and parse JSON

        return decodedPayload.role;  // Extract role from the decoded payload
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }

    return null;
  };

  const userId = getUserIdFromToken();  // Get the current userId from the token
  const userRole = getUserRoleFromToken(); // Get the user role from the token

  const handleAddToCart = () => {
    updateCartCount();  // Call the updateCartCount function when the product is added to cart
  };

  return (
    <Box
      p={5}
      border="1px solid #e2e8f0"
      borderRadius="md"
      boxShadow="md"
      bg="white"
      _hover={{ transform: "scale(1.05)", transition: "0.3s ease", boxShadow: "lg" }}
      transition="transform 0.3s, box-shadow 0.3s"
    >
      <Image
        src={product.images?.[0] || "https://via.placeholder.com/150"}
        alt={product.name}
        borderRadius="md"
        mb={4}
        height="200px"
        objectFit="cover"
        width="100%"
      />
      <Text fontSize="xl" fontWeight="bold" mb={2} noOfLines={1}>
        {product.name}
      </Text>
      <Text color="gray.600" fontSize="md" mb={2}>
        Size: {product.size}
      </Text>
      <Text color="teal.600" fontSize="lg" fontWeight="bold" mb={3}>
        ${product.price}
      </Text>

      <VStack align="center" spacing={3}>
        {/* Conditionally render the "Add to Cart" button if the product doesn't belong to the current user */}
        {product.userId !== userId && (
          <Button colorScheme="teal" size="sm" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}

        {/* Show the "Ban Product" button for admins, else show the visibility toggle */}
        {userRole === "admin" ? (
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleDeleteProduct(product._id)}  // Admin can delete the product
          >
            Ban Product
          </Button>
        ) : (
          <Button
            colorScheme={product.visibility === "public" ? "red" : "green"}
            size="sm"
            onClick={() => handleVisibilityToggle(product._id, product.visibility)}  // Regular user can toggle visibility
          >
            {product.visibility === "public" ? "Make Private" : "Make Public"}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default RecycleProductCard;
