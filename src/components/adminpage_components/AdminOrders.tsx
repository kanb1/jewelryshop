import React, { useEffect, useState } from "react";
import { Box, Heading, Table, Tbody, Tr, Td, Thead, Th, Button } from "@chakra-ui/react";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:5001/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleApproveReturn = async (orderId: string) => {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:5001/api/admin/orders/${orderId}/return`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    alert("Return approved");
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>Manage Orders</Heading>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order: any) => (
            <Tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.status}</Td>
              <Td>
                {order.status === "Return Initiated" && (
                  <Button colorScheme="green" onClick={() => handleApproveReturn(order._id)}>
                    Approve Return
                  </Button>
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
