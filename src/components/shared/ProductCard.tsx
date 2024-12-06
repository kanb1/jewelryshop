import React from "react";
import { Box, Text, Image, Stack, Badge } from "@chakra-ui/react";
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
  children?: React.ReactNode; // Allow passing custom content like the Remove button

}

const ProductCard: React.FC<ProductCardProps> = ({ product, children }) => {
  return (
    <Box 
    p={4}
    bg="white"
    borderRadius="lg"
    boxShadow="lg"
    _hover={{ transform: "scale(1.05)", transition: "0.3s ease" }}
    maxW="sm"
    textAlign="center">
      <Image
        src={product.images[0] || "/placeholder.jpg"} // Display the first image or a placeholder
        alt={product.name}
        borderRadius="md"
        mb={4}
        height="250px"
        objectFit="cover"
        mx="auto"
      />
       {/* Product Type and Collection */}
      <Stack direction="row" justify="center" align="center" mt={2} spacing={2}>
        <Badge color="accent_color.red" fontSize="sm">
          {product.type}
        </Badge>
        <Badge colorScheme="accent_color.red" fontSize="sm">
          {product.productCollection}
        </Badge>
      </Stack>
      {/* Product Price */}
      <Text fontSize="xl" fontWeight="bold" my={3}>
        ${product.price.toLocaleString()}
      </Text>

      <Link to={`/product/${product._id}`}>
        <ButtonComponent text="View product" variant="ctaBtn" />
      </Link>
      {/* Render custom children, like the Remove button */}
      <Box mt={4}>{children}</Box>

    </Box>
    
  );
};

export default ProductCard;
