import React from 'react';
import { Box, Heading, VStack} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import RecycleProducts from '../components/recyclepage_components/RecycleProducts';
import ButtonComponent from '../components/shared/ButtonComponent';

const Recyclepage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/user-manage-recycleproducts"); // Navigate to the Recycle products page
  };

  return (
    <Box minH="100vh" p={5}>
      <VStack spacing={6} p={10}>
        <Heading>Explore All Recycled Products</Heading>

        <ButtonComponent onClick={handleNavigation} variant='primaryBlackBtn' text='Add or Manage Your Products'/>

        <RecycleProducts />
      </VStack>
    </Box>
  );
};

export default Recyclepage;
