import React, { useState } from "react";
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
  const [cartItems, setCartItems] = useState([
    // Example cart items
    {
      productId: { _id: "1", name: "Ring", price: 500 },
      quantity: 2,
      size: "M",
    },
    {
      productId: { _id: "2", name: "Necklace", price: 300 },
      quantity: 1,
      size: "L",
    },
  ]);
  const [currentStep, setCurrentStep] = useState<
    "cart" | "delivery" | "billing" | "confirmation"
  >("delivery");
  const [orderNumber, setOrderNumber] = useState<string | null>(null); // Track order number

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0);

  const handlePaymentSuccess = (orderNumber: string) => {
    setOrderNumber(orderNumber); // Save the order number
    setCurrentStep("confirmation");
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading>Checkout</Heading>
        {/* Progress Timeline */}
        <ProgressTimeline currentStep={currentStep} />

        {/* Step 1: Delivery Information */}
        {currentStep === "delivery" && (
          <DeliveryInformation
            deliveryInfo={deliveryInfo}
            setDeliveryInfo={setDeliveryInfo}
            setCurrentStep={setCurrentStep}
          />
        )}

        {/* Step 2: Billing Information */}
        {currentStep === "billing" && (
          <BillingInformation
            total={calculateTotal()}
            cartItems={cartItems} // Pass cart items here
            deliveryInfo={deliveryInfo} // Pass delivery information here
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Step 3: Confirmation */}
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
