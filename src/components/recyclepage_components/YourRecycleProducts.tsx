import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const YourRecycleProducts: React.FC<{ products: any[] }> = ({ products }) => {
  const navigate = useNavigate();

  const handleEdit = (productId: string) => {
    navigate(`/edit-recycled-product/${productId}`);
  };

  // Ensure that products is always an array before mapping
  if (!products || products.length === 0) {
    return <Box>No products available.</Box>;
  }


  return (
    <Box>
      {products.length === 0 ? (
        <Text>No products to display.</Text>
      ) : (
        products.map((product) => (
          <Box key={product._id} border="1px" p={4} mb={4}>
            <Text fontWeight="bold">{product.name}</Text>
            <Text>Price: ${product.price}</Text>
            <Text>Size: {product.size}</Text>
            <Text>Visibility: {product.visibility}</Text>
            <Button onClick={() => handleEdit(product._id)}>Edit</Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default YourRecycleProducts;
