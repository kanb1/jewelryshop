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
import { BACKEND_URL } from "../../config";

// Defining the shape of an order object
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
  // state to store all fetched orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  // Responsive media query
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // ************************************ FETCH ALL ORDERS
  // fetches when the components loads 
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      // calls the backend for fetching all the orders for the admin
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // updates the orders state with the fetched data
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

  //********************************* */ Handle updating the return status
  // orderID --> unique id of the order to update
  const handleUpdateReturnStatus = async (orderId: string, newStatus: "Pending" | "Received" | "Refunded") => {
    try {
      const token = localStorage.getItem("jwt");
      // orderId is the id of the order to update
      
      const response = await fetch(
        `${BACKEND_URL}/api/admin/orders/${orderId}/return-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // body contains the new returnStatus (ex: admin clicks "Received")
          body: JSON.stringify({ returnStatus: newStatus }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to update return status: ${response.statusText}`);
      }
  
      alert(`Return status updated to ${newStatus}`);
  
      //maps over all orders, finds the order witht he matching orderId and updates its returnStatus to the new value
      const updatedOrders: Order[] = orders.map((order) =>
        order._id === orderId ? { ...order, returnStatus: newStatus } : order
      );
      // setOrders updates the orders state
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
