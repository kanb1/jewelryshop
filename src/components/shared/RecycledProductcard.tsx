import React from 'react';
import { Box, Image, Text, Badge, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

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
  updateCartCount: () => void;  // Pass updateCartCount function as prop
}

const RecycleProductCard: React.FC<RecycleProductCardProps> = ({ product, updateCartCount }) => {

  const handleAddToCart = () => {
    updateCartCount(); // Just call updateCartCount when the product is added to cart
    // Additional logic can be added if needed, e.g., saving cart items in localStorage or API
  };

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      _hover={{ transform: "scale(1.05)", transition: "0.3s ease" }}
      maxW="sm"
    >
      <Image
        src={product.images?.[0] || "https://via.placeholder.com/150"}
        alt={product.name}
        borderRadius="md"
        mb={4}
        height="250px"
        objectFit="cover"
        mx="auto"
      />
      <Text fontSize="lg" fontWeight="bold" mt={3}>
        {product.name}
      </Text>
      <Text fontSize="md" color="gray.600">
        Size: {product.size}
      </Text>
      <Text fontSize="xl" fontWeight="bold" mt={2}>
        ${product.price}
      </Text>

      <Badge colorScheme={product.visibility === "public" ? "green" : "yellow"} mt={2}>
        {product.visibility}
      </Badge>

      <Button colorScheme="teal" mt={3} onClick={handleAddToCart}>
        Add to Cart
      </Button>

      <Link to={`/product/${product._id}`}>
        <Button colorScheme="teal" mt={3}>
          View Product
        </Button>
      </Link>
    </Box>
  );
};

export default RecycleProductCard;
