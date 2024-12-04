import React from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    type: string;
    productCollection: string;
    images: string[]; // Include images array
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <Image
        src={product.images[0] || "/placeholder.jpg"} // Display the first image or a placeholder
        alt={product.name}
        borderRadius="md"
        mb={4}
        boxSize="200px"
        objectFit="cover"
      />
      <Text fontWeight="bold">{product.name}</Text>
      <Text>
        {product.type} | {product.productCollection}
      </Text>
      <Text>${product.price}</Text>
      <Link to={`/product/${product._id}`}>
        <ButtonComponent text="View product" variant="ctaBtn" />
      </Link>
    </Box>
  );
};

export default ProductCard;
