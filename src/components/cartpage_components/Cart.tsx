import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Button,
  Image,
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useCart } from "../../context/CartContext";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setCartCount } = useCart();
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

        // Update cart count
        const totalItems = data.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );
        setCartCount(totalItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [setCartCount]);

  const handleRemoveItem = async (id: string) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedCartItems = cartItems.filter((item) => item._id !== id);
        setCartItems(updatedCartItems);

        // Update cart count dynamically
        const totalItems = updatedCartItems.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };


  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1

    try {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedCartItems = cartItems.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        // Update cart count dynamically
        const totalItems = updatedCartItems.reduce((total: number, item: any) => total + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  if (loading) {
    return <Text>Loading cart...</Text>;
  }

  if (cartItems.length === 0) {
    return <Text>Your cart is empty.</Text>;
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Box p={10}>
      <Heading as="h1" mb={6}>
        Your Shopping Cart
      </Heading>
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
        {/* Cart Items */}
        <Box>
          {cartItems.map((item) => (
            <Flex key={item._id} align="center" justify="space-between" mb={4}>
              <Image
                src="https://via.placeholder.com/100" // Placeholder image
                alt={item.productId.name}
                boxSize="100px"
                objectFit="contain"
              />
              <Box>
                <Text fontWeight="bold">{item.productId.name}</Text>
                <Text>Size: {item.size}</Text>
                <Text>Price: ${item.productId.price}</Text>
              </Box>
              <Flex align="center">
              <IconButton
                  aria-label="Decrease quantity"
                  icon={<MinusIcon />}
                  size="sm"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                />
                <Input
                  type="number"
                  value={item.quantity}
                  readOnly
                  width="60px"
                  textAlign="center"
                />
                <IconButton
                  aria-label="Increase quantity"
                  icon={<AddIcon />}
                  size="sm"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                />
                <Button
                  colorScheme="red"
                  size="sm"
                  ml={4}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </Button>
              </Flex>
            </Flex>
          ))}
        </Box>

        {/* Cart Summary */}
        <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
          <Heading as="h2" size="md" mb={4}>
            Summary
          </Heading>
          <Text mb={2}>Total: ${calculateTotal()}</Text>
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleProceedToCheckout} // Navigate to checkout
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default Cart;
