import React, { useEffect, useState } from "react";
import DeliveryInformation from "../components/checkoutpage_components/DeliveryInformation";
import BillingInformation from "../components/checkoutpage_components/BillingInformation";
import Confirmation from "../components/checkoutpage_components/Confirmation";
import ProgressTimeline from "../components/checkoutpage_components/ProgressTimeline";
import { Box, VStack, Heading } from "@chakra-ui/react";
import { BACKEND_URL } from "../config";

// Main container for my checkout flow.. renders the specific components that matches the current step

const CheckoutPage: React.FC = () => {
  // Holds the delivery details, passed to DeliveryInformation to collect/update user input
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    deliveryMethod: "home" as "home" | "parcel-shop",
  });
  // Stores items fetched from the user's cart
  // updated using fetchCartItems()
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Tracks the current step in the checkoutflow
  const [currentStep, setCurrentStep] = useState<
    "delivery" | "billing" | "confirmation"
  >("delivery");
  // takes the generated order number from the backend after successful payment, passed to confirmation
  const [orderNumber, setOrderNumber] = useState<string | null>(null);






  // ******************************** FETCHES USER'S CART ITEMS WHEN PAGE LOADS
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      // Authentication
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
        // Stores in cartItems
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


  // *******************************' CALCULATE TOTAL
  const calculateTotal = () =>
  // loops through cart, multiplying price by quantity each time
    cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );


  // Triggered whena  successful payment occurs
  // Updates orderNumber and mvoes the user to the confirmation step after a successful payment
  const handlePaymentSuccess = (orderNumber: string) => {
    console.log("Payment successful. Moving to confirmation step."); 
    // updates the orderNumber state with the ordernumber returned by the backend
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
{/* Render komponenterne alt efter currentstep */}
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
    cartItems={cartItems}
    deliveryInfo={deliveryInfo}
    onPaymentSuccess={handlePaymentSuccess}
    goToPreviousStep={goToPreviousStep} 
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
