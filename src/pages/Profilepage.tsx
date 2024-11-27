import React, { useState } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Favourites from '../components/profile_components/Favourites';
import MyOrders from '../components/profile_components/MyOrders';
import UserInfo from '../components/profile_components/UserInfo';

const ProfilePage: React.FC = () => {
  return (
    <Box p={5}>
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