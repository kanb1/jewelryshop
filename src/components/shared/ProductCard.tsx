import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    type: string;
    productCollection: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <Text fontWeight="bold">{product.name}</Text>
      <Text>{product.type} | {product.productCollection}</Text>
      <Text>${product.price}</Text>
      <Link to={`/product/${product._id}`}>
        <Button colorScheme="blue" mt={2}>View Details</Button>
      </Link>
    </Box>
  );
};

export default ProductCard;
