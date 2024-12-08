import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Image,
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";


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
        const response = await fetch(`${BACKEND_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched cart items in frontend:", data); // Debug cart items
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
      const response = await fetch(`${BACKEND_URL}/api/cart/${id}`, {
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
      const response = await fetch(`${BACKEND_URL}/api/cart/${id}`, {
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
    <Flex direction="column" minH="100vh" p={4}>
  <Heading mb={6} size={{ base: "lg", sm: "xl" }} mt={6}>
    Your Shopping Cart
  </Heading>
  <Grid
    templateColumns={{ base: "1fr", lg: "3fr 1fr" }}
    gap={6}
    alignItems="flex-start"
    pt={10}
  >
    {/* Cart Items Section */}
    <Box>
      {cartItems.map((item) => (
        <Flex
          key={item._id}
          direction={{ base: "column", sm: "row" }}
          align={{ base: "center", sm: "center" }}
          justify="space-between"
          mb={20}
          gap={4}
          px={{lg:"20"}}
        >
          {/* Product Image */}
          <Image
            src={item.productId.images[0] || "https://via.placeholder.com/100"}
            alt={item.productId.name}
            boxSize={{ base: "150px", sm: "200px" }}
            objectFit="cover"
            borderRadius="md"
          />
          {/* Product Details */}
          <Box flex="1">
            <Text fontWeight="bold" fontSize={{ base: "sm", sm: "md" }}>
              {item.productId.name}
            </Text>
            <Text fontSize={{ base: "xs", sm: "sm", md: "lg", lg: "2xl" }}>Size: {item.size}</Text>
            <Text fontSize={{ base: "xs", sm: "sm", md: "lg", lg: "2xl"}}>
              Price: ${item.productId.price}
            </Text>
          </Box>
          {/* Quantity and Remove */}
          <Flex
            align="center"
            gap={2}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <IconButton
              icon={<MinusIcon />}
              size="sm"
              onClick={() =>
                handleUpdateQuantity(item._id, item.quantity - 1)
              }
              aria-label="Decrease quantity"
            />
            <Input
              value={item.quantity}
              readOnly
              width={{ base: "40px", sm: "50px" }}
              textAlign="center"
            />
            <IconButton
              icon={<AddIcon />}
              size="sm"
              onClick={() =>
                handleUpdateQuantity(item._id, item.quantity + 1)
              }
              aria-label="Increase quantity"
            />
            <ButtonComponent
              text="Remove"
              onClick={() => handleRemoveItem(item._id)}
              variant="redBtn"
              styleOverride={{
                marginLeft: "1rem",
                fontSize: { base: "xs", sm: "sm" },
              }}
            />
          </Flex>
        </Flex>
      ))}

    </Box>

    {/* Summary Section */}
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={6}
      bg="white"
      boxShadow="sm"
      textAlign="center"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        Total: ${calculateTotal()}
      </Text>
      <ButtonComponent
        text="Proceed to Checkout"
        onClick={() => navigate("/checkout")}
        variant="primaryBlackBtn"
        styleOverride={{
          width: "100%",
          fontSize: { base: "sm", sm: "md" },
          padding: { base: "0.5rem", sm: "1rem" },
        }}
      />
    </Box>
  </Grid>
</Flex>
  );
};

export default Cart;
