import React from 'react';
import Cart from '../components/cartpage_components/Cart';
import { Box } from '@chakra-ui/react';

const CartPage: React.FC = () => {
  return (
    <Box minH="100vh">
    <Cart />
    </Box>
  );
};

export default CartPage;
