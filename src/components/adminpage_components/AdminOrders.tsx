import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Button,
  Spinner,
} from "@chakra-ui/react";

interface Order {
  _id: string;
  status: "In Progress" | "Completed" | "Return" | "Return Initiated";
  returnStatus?: "Pending" | "Received" | "Refunded" | null;
  returnInitiated?: boolean;
  returnInitiatedAt?: string | null;
  totalPrice: number;
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    size: string;
    quantity: number;
  }[];
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      try {
        const response = await fetch("http://localhost:5001/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle updating the return status
  const handleUpdateReturnStatus = async (orderId: string, newStatus: "Pending" | "Received" | "Refunded") => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:5001/api/admin/orders/${orderId}/return-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ returnStatus: newStatus }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to update return status: ${response.statusText}`);
      }
  
      const updatedOrder = await response.json();
      alert(`Return status updated to ${newStatus}`);
  
      // Refresh orders after updating
      const updatedOrders: Order[] = orders.map((order) =>
        order._id === orderId ? { ...order, returnStatus: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating return status:", error);
      alert((error as Error).message || "Failed to update return status.");
    }
  };
  

  if (isLoading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
        <Heading size="md" mt={4}>
          Loading orders...
        </Heading>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>
        Manage Orders
      </Heading>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Status</Th>
            <Th>Return Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order: Order) => (
            <Tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.status}</Td>
              <Td>{order.returnStatus || ""}</Td>
              <Td>
              {(order.status === "Return" || order.status === "Return Initiated") && (
  <>
    <Button
      colorScheme="blue"
      size="sm"
      onClick={() => handleUpdateReturnStatus(order._id, "Received")}
      isDisabled={
        order.returnStatus === "Received" ||
        order.returnStatus === "Refunded"
      }
    >
      Mark as Received
    </Button>
    <Button
      colorScheme="green"
      size="sm"
      onClick={() => handleUpdateReturnStatus(order._id, "Refunded")}
      isDisabled={order.returnStatus === "Refunded"}
      ml={2}
    >
      Mark as Refunded
    </Button>
  </>
)}

              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminOrders;
