import React, { useEffect, useState } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from '@chakra-ui/react';
import Favourites from '../components/profile_components/Favourites';
import MyOrders from '../components/profile_components/MyOrders';
import UserInfo from '../components/profile_components/UserInfo';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  // **************SECURITY
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast(); // Chakra UI Toast for error notifications
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        toast({
          title: 'Access Denied',
          description: 'You must log in to access this page.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login'); // Redirect to login page if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          toast({
            title: 'Session Invalid',
            description: 'Your session has expired. Please log in again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          localStorage.removeItem('jwt'); // Remove invalid token
          navigate('/login'); // Redirect to login page
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to verify user.');
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [navigate, toast]);

  if (isLoading) {
    return <Text>Loading...</Text>; // Show loading state while verifying
  }

return(
  <Box p={5} minH="100vh">
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>My Orders</Tab>
          <Tab>Favourites</Tab>
          <Tab>User Info</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MyOrders />
          </TabPanel>
          <TabPanel>
            <Favourites />
          </TabPanel>
          <TabPanel>
            <UserInfo />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;