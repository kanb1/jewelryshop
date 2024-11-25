import React, { useEffect, useState } from "react";
import DeliveryInformation from "../components/checkoutpage_components/DeliveryInformation";
import BillingInformation from "../components/checkoutpage_components/BillingInformation";
import Confirmation from "../components/checkoutpage_components/Confirmation";
import ProgressTimeline from "../components/checkoutpage_components/ProgressTimeline";
import { Box, VStack, Heading } from "@chakra-ui/react";

const CheckoutPage: React.FC = () => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<
    "cart" | "delivery" | "billing" | "confirmation"
  >("delivery");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

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
          headers: { Authorization: `Bearer ${token}` },
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

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

  const handlePaymentSuccess = (orderNumber: string) => {
    setOrderNumber(orderNumber);
    setCurrentStep("confirmation");
  };

  if (loading) return <p>Loading your cart...</p>;
  if (cartItems.length === 0) return <p>Your cart is empty.</p>;

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading>Checkout</Heading>
        <ProgressTimeline currentStep={currentStep} />

        {currentStep === "delivery" && (
          <DeliveryInformation
            deliveryInfo={deliveryInfo}
            setDeliveryInfo={setDeliveryInfo}
            setCurrentStep={setCurrentStep}
          />
        )}

        {currentStep === "billing" && (
          <BillingInformation
            total={calculateTotal()}
            cartItems={cartItems} // Use fetched cart items here
            deliveryInfo={deliveryInfo}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {currentStep === "confirmation" && (
          <Confirmation
            deliveryInfo={deliveryInfo}
            total={calculateTotal()}
            orderNumber={orderNumber}
          />
        )}
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
