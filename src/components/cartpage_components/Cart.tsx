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
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched cart items:", data);
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (id: string) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item._id !== id));
        setCartCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item._id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  if (loading) return <Text>Loading cart...</Text>;

  if (cartItems.length === 0) return <Text>Your cart is empty.</Text>;

  return (
    <Box p={10}>
      <Heading mb={6}>Your Shopping Cart</Heading>
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
        <Box>
          {cartItems.map((item) => (
            <Flex key={item._id} justify="space-between" mb={4}>
              <Image
                src="https://via.placeholder.com/100"
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
                  icon={<MinusIcon />}
                  size="sm"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} aria-label={""}                />
                <Input
                  value={item.quantity}
                  readOnly
                  width="50px"
                  textAlign="center"
                />
                <IconButton
                  icon={<AddIcon />}
                  size="sm"
                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} aria-label={""}                />
                <Button
                  colorScheme="red"
                  ml={4}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </Button>
              </Flex>
            </Flex>
          ))}
        </Box>
        <Box>
          <Text>Total: ${calculateTotal()}</Text>
          <Button onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default Cart;
