import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Button,
  useToast,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });


  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const token = localStorage.getItem("jwt");

      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("API response is not an array:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Handle initiating a return
  const initiateReturn = async (orderId: string) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/return`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Return Initiated",
          description: "We have sent you a return label via email.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Re-fetch orders to update UI
        await fetchOrders();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initiate return.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error initiating return:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
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
      <Heading size="lg" mb={4}>
        My Orders
      </Heading>
      {isMobile ? (
        <Stack spacing={4}>
          {orders.map((order) => (
            <Box
              key={order.orderId}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Text fontWeight="bold">Order ID: {order.orderId}</Text>
              <Text>Status: {order.status}</Text>
              <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
              <Text>
                Returnable:{" "}
                {order.isReturnable
                  ? "Yes"
                  : order.status === "Return Initiated"
                  ? "Returnlabel already sent to email"
                  : "Return date expired"}
              </Text>
              <Text>Return ID: {order.returnId || ""}</Text>
              <Text>Return Status: {order.returnStatus || ""}</Text>
              <Text>
                Return Initiated At:{" "}
                {order.returnInitiatedAt
                  ? new Date(order.returnInitiatedAt).toLocaleDateString()
                  : ""}
              </Text>
              {order.isReturnable && order.status !== "Return Initiated" && (
                <Button
                  mt={2}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => initiateReturn(order.orderId)}
                >
                  Initiate Return
                </Button>
              )}
            </Box>
          ))}
        </Stack>
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Returnable</Th>
              <Th>Return ID</Th>
              <Th>Return Status</Th>
              <Th>Return Initiated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.orderId}>
                <Td>{order.orderId}</Td>
                <Td>{order.status}</Td>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {order.isReturnable
                    ? "Yes"
                    : order.status === "Return Initiated"
                    ? "Returnlabel already sent to email"
                    : "Return date expired"}
                </Td>
                <Td>{order.returnId || ""}</Td>
                <Td>{order.returnStatus || ""}</Td>
                <Td>
                  {order.returnInitiatedAt
                    ? new Date(order.returnInitiatedAt).toLocaleDateString()
                    : ""}
                </Td>
                <Td>
                  {order.isReturnable && order.status !== "Return Initiated" && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => initiateReturn(order.orderId)}
                    >
                      Initiate Return
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};


export default MyOrders;
