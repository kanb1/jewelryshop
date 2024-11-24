import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, VStack, HStack, Divider, Image, Text } from "@chakra-ui/react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "../checkoutpage_components/PersonalInformation";
import DeliveryInformation from "../checkoutpage_components/DeliveryInformation";
import BillingInformation from "../checkoutpage_components/BillingInformation";

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
    navigate("/order-confirmation");
  };

  const user = { name: "John Doe", email: "johndoe@example.com" }; // Replace with fetched user data

  if (loading) return <Heading>Loading...</Heading>;

  return (
    <Box p={10}>
      <Heading mb={6}>Checkout</Heading>
      <Flex justify="space-between" flexWrap="wrap" gap={10}>
        {/* Personal Information */}
        <PersonalInformation user={user} />

        {/* Delivery Information */}
        <DeliveryInformation
          deliveryInfo={deliveryInfo}
          setDeliveryInfo={setDeliveryInfo}
        />

        {/* Order Summary */}
        <Box flex="1" minW="300px">
          <Heading size="md" mb={4}>
            Order Summary
          </Heading>
          <VStack spacing={4} align="stretch">
            {cartItems.map((item) => (
              <HStack key={item._id} justify="space-between">
                <Image
                  src="https://via.placeholder.com/50"
                  alt={item.productId.name}
                  boxSize="50px"
                />
                <Text>{item.productId.name}</Text>
                <Text>x{item.quantity}</Text>
                <Text>${item.productId.price * item.quantity}</Text>
              </HStack>
            ))}
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold">${calculateTotal()}</Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      {/* Billing Information */}
      <BillingInformation total={calculateTotal()} onPaymentSuccess={handlePaymentSuccess} />
    </Box>
  );
};

export default Checkout;
