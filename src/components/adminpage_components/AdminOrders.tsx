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
  VStack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../shared/ButtonComponent";


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
  const navigate = useNavigate(); 

  // Responsive media query
  const [isMobile] = useMediaQuery("(max-width: 768px)");

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
    <Box p={4} textAlign="left">
      <ButtonComponent
        text="Back to dashboard"
        onClick={() => navigate("/admin")}
        variant="primaryBlackBtn"
      />
    </Box>
    <Heading size="lg" mb={4}>
      Manage Orders
    </Heading>

    {isMobile ? (
      // Responsive Layout for Mobile
      <VStack spacing={4} align="stretch">
        {orders.map((order) => (
          <Box
            key={order._id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          >
            <Text>
              <strong>Order ID:</strong> {order._id}
            </Text>
            <Text>
              <strong>Status:</strong> {order.status}
            </Text>
            <Text>
              <strong>Return Status:</strong> {order.returnStatus || "N/A"}
            </Text>
            <Text>
              <strong>Total Price:</strong> ${order.totalPrice}
            </Text>
            <Text>
              <strong>Address:</strong> {`${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.country}`}
            </Text>
            {(order.status === "Return" || order.status === "Return Initiated") && (
              <Box mt={3}>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() =>
                    handleUpdateReturnStatus(order._id, "Received")
                  }
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
                  onClick={() =>
                    handleUpdateReturnStatus(order._id, "Refunded")
                  }
                  isDisabled={order.returnStatus === "Refunded"}
                  ml={2}
                >
                  Mark as Refunded
                </Button>
              </Box>
            )}
          </Box>
        ))}
      </VStack>
    ) : (
      // Desktop Table View
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
          {orders.map((order) => (
            <Tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.status}</Td>
              <Td>{order.returnStatus || ""}</Td>
              <Td>
                {(order.status === "Return" ||
                  order.status === "Return Initiated") && (
                  <>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() =>
                        handleUpdateReturnStatus(order._id, "Received")
                      }
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
                      onClick={() =>
                        handleUpdateReturnStatus(order._id, "Refunded")
                      }
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
    )}
  </Box>
);
};

export default AdminOrders;
