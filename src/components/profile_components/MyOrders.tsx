import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Table, Tbody, Tr, Td, Thead, Th } from "@chakra-ui/react";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]); // Start with an empty array
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Unauthorized");

        const response = await fetch("http://localhost:5001/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched orders:", data); // Debug the response
        if (Array.isArray(data)) {
          setOrders(data); // Only set if data is an array
        } else {
          console.error("API response is not an array:", data);
          setOrders([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" p={5}>
        <Spinner size="lg" />
        <Text>Loading orders...</Text>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box p={5} textAlign="center">
        <Text>No orders found.</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>My Orders</Heading>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Returnable</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.orderId}>
              <Td>{order.orderId}</Td>
              <Td>{order.status}</Td>
              <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
              <Td>{order.isReturnable ? "Yes" : "No"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MyOrders;
