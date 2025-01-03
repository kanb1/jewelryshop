import React from 'react';
import { Box, Heading, VStack, Text} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import RecycleProducts from '../components/recyclepage_components/RecycleProducts';
import ButtonComponent from '../components/shared/ButtonComponent';
import { useAuthContext } from '../context/AuthContext';

const Recyclepage: React.FC = () => {
  const { isLoggedIn } = useAuthContext(); // Access the authentication state
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/user-manage-recycleproducts"); // Navigate to the Recycle products page
  };

  return (
    <Box minH="100vh" p={5}>
      <VStack spacing={6} p={10}>
        <Heading>Explore All Recycled Products</Heading>

        {isLoggedIn ? (
          // Show the button only if the user is logged in
          <ButtonComponent
            onClick={handleNavigation}
            variant="primaryBlackBtn"
            text="Add or Manage Your Products"
          />
        ) : (
          // Show this message if the user is not logged in
          <Text>You must be logged in to add or manage your recycled products.</Text>
        )}

        <RecycleProducts />
      </VStack>
    </Box>
  );
};

export default Recyclepage;
