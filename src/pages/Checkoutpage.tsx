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
  const [currentStep, setCurrentStep] = useState<"cart" | "delivery" | "billing" | "confirmation">(
    "delivery"
  );
  const totalAmount = 1397; // Example total price

  const handlePaymentSuccess = () => {
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
            total={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* Step 3: Confirmation */}
        {currentStep === "confirmation" && (
          <Confirmation deliveryInfo={deliveryInfo} total={totalAmount} />
        )}
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
