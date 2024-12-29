import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid} from '@chakra-ui/react';
import { BACKEND_URL } from '../../config';
import RecycleProductCard from '../shared/RecycledProductcard'; // Import your RecycleProductCard component

const RecycleProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  // Fetch all public products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/recycle`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle visibility toggle
  const handleVisibilityToggle = async (productId: string, currentVisibility: string) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';

    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle/${productId}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (response.ok) {
        // After successfully toggling, fetch the updated list of products
        const updatedResponse = await fetch(`${BACKEND_URL}/api/recycle`);
        const updatedProducts = await updatedResponse.json();
        setProducts(updatedProducts); // Update the products state with the newly fetched data
      } else {
        const errorData = await response.json();
        console.error('Failed to update product visibility:', errorData);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  // Handle product deletion (admin only)
  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (response.ok) {
        // After deleting, fetch the updated list of products
        const updatedResponse = await fetch(`${BACKEND_URL}/api/recycle`);
        const updatedProducts = await updatedResponse.json();
        setProducts(updatedProducts); // Update the products state with the newly fetched data
        alert('The product is banned!');
      } else {
        alert('Failed to ban the product');
      }
    } catch (error) {
      console.error('Error banning/deleting the product:', error);
    }
  };

  return (
    <Box p={4}>
<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
        {products.map((product: any) => (
          <RecycleProductCard 
            key={product._id}
            product={product}
            updateCartCount={() => {}}
            handleVisibilityToggle={handleVisibilityToggle}  // Pass visibility toggle function as a prop
            handleDeleteProduct={handleDeleteProduct}  // Pass delete function as a prop
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecycleProducts;
