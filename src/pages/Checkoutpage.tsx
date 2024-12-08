import React, { useEffect, useState } from "react";
import DeliveryInformation from "../components/checkoutpage_components/DeliveryInformation";
import BillingInformation from "../components/checkoutpage_components/BillingInformation";
import Confirmation from "../components/checkoutpage_components/Confirmation";
import ProgressTimeline from "../components/checkoutpage_components/ProgressTimeline";
import { Box, VStack, Heading } from "@chakra-ui/react";
import { BACKEND_URL } from "../config";

const CheckoutPage: React.FC = () => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    deliveryMethod: "home" as "home" | "parcel-shop",
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<
    "delivery" | "billing" | "confirmation"
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
        const response = await fetch(`${BACKEND_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCartItems(data);
        console.log("Cart Items from API:", data);

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
    console.log("Payment successful. Moving to confirmation step."); // Debug
    setOrderNumber(orderNumber);
    setCurrentStep("confirmation");
  };


  const goToPreviousStep = () => {
    if (currentStep === "billing") setCurrentStep("delivery");
  };
  

  if (loading) return <p>Loading your cart...</p>;
  if (cartItems.length === 0) return <p>Your cart is empty.</p>;

  return (
    <Box >
      <VStack spacing={8} align="stretch">
        <Heading mt={10}>Checkout</Heading>
        <ProgressTimeline currentStep={currentStep} />

        {currentStep === "delivery" && (
  <DeliveryInformation
    deliveryInfo={deliveryInfo}
    setDeliveryInfo={setDeliveryInfo}
    setCurrentStep={setCurrentStep} // Correctly passed
  />
)}

{currentStep === "billing" && (
  <BillingInformation
    total={calculateTotal()}
    cartItems={cartItems}
    deliveryInfo={deliveryInfo}
    onPaymentSuccess={handlePaymentSuccess}
    goToPreviousStep={goToPreviousStep} // Correctly passed
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
