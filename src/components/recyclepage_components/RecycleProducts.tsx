import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import RecycleProductCard from '../shared/RecycledProductcard'; // Import the RecycleProductCard component
import { useCart } from '../../context/CartContext';

const RecycleProducts: React.FC<{ products: any[] }> = ({ products }) => {
  const { updateCartCount } = useCart(); // Access updateCartCount from the CartContext
  
  // Ensure that products is always an array before mapping
  if (!products || products.length === 0) {
    return <Box>No products available.</Box>;
  }


  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
        {products.map((product) => (
          <RecycleProductCard
            key={product._id}
            product={product} // Pass each product to RecycleProductCard
            updateCartCount={updateCartCount} // Pass the updateCartCount function
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecycleProducts;
