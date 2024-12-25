import React, { useState, useEffect } from "react";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Button } from "@chakra-ui/react";
import AddRecycleProduct from "../components/recyclepage_components/AddRecycleProducts"; // Component to add a product
import YourRecycleProducts from "../components/recyclepage_components/YourRecycleProducts"; // Component for viewing and editing own products
import RecycleProducts from "../components/recyclepage_components/RecycleProducts"; // Component for viewing all recycled products
import { BACKEND_URL } from "../config"; // Make sure to use the correct backend URL

const RecycledProductPage: React.FC = () => {
  // Fetch necessary data (if needed)
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [allRecycledProducts, setAllRecycledProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecycledProducts = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const response = await fetch(`${BACKEND_URL}/api/recycle`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserProducts(data.userProducts); // User's own recycled products
        setAllRecycledProducts(data.recycledProducts); // All recycled products
      }
    };

    fetchRecycledProducts();
  }, []);

  return (
    <Box p={6}>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>Add Recycled Product</Tab>
          <Tab>Your Recycled Products</Tab>
          <Tab>View All Recycled Products</Tab>
        </TabList>

        <TabPanels>
          {/* Tab 1: Add Recycled Product */}
          <TabPanel>
            <AddRecycleProduct />
          </TabPanel>

          {/* Tab 2: Your Recycled Products */}
          <TabPanel>
            <YourRecycleProducts products={userProducts} />
          </TabPanel>

          {/* Tab 3: View All Recycled Products */}
          <TabPanel>
            <RecycleProducts products={allRecycledProducts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default RecycledProductPage;
