import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, VStack, Divider, FormControl, FormLabel, Heading} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";
import { useToast } from "@chakra-ui/react";


interface BillingProps {
  total: number;
  onPaymentSuccess: (orderNumber: string) => void;
  cartItems: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    size: string;
  }>;
  
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryMethod: "home" | "parcel-shop";
  };
  goToPreviousStep: () => void;
}


const BillingInformation: React.FC<BillingProps> = ({
  total,
  onPaymentSuccess,
  cartItems,
  deliveryInfo,
  goToPreviousStep,
}) => {
  console.log("Cart Items:", cartItems);

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const calculateTotalPrice = () => {
    return cartItems.reduce((sum: number, item: { productId: { price: number; }; quantity: number; }) => sum + item.productId.price * item.quantity, 0);
  };


  const handlePayment = async () => {
    const userToken = localStorage.getItem("jwt");
    if (!userToken) {
      toast({
        title: "Authentication Error",
        description: "User is not logged in. Please log in to proceed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Stripe is not initialized correctly. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          amount: calculateTotalPrice() * 100,
          currency: "usd",
        }),
      });
  
      const { clientSecret } = await response.json();
  
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        toast({
          title: "Payment Error",
          description: "Card details are not provided correctly.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Test User",
          },
        },
      });
  
      if (error) {
        toast({
          title: "Payment Error",
          description: error.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Payment confirmation error:", error.message);
      } else {
        // After a successful payment, save the order in the backend
        const saveOrderResponse = await fetch("http://localhost:5001/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              productId: item.productId._id, // Extract the _id from productId
              quantity: item.quantity,
              size: item.size,
            })),
            totalPrice: calculateTotalPrice(),
            deliveryInfo,
            deliveryMethod: deliveryInfo.deliveryMethod,
            paymentIntentId: paymentIntent.id, // Pass Stripe's Payment Intent ID
          }),
        });


  
        if (!saveOrderResponse.ok) {
          const errorData = await saveOrderResponse.json();
          toast({
            title: "Order Save Error",
            description: errorData.error || "Failed to save order. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error("Failed to save order:", errorData);
          return;
        }
  
        const { order } = await saveOrderResponse.json();
        toast({
          title: "Payment Successful",
          description: `Order #${order.orderNumber} placed successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onPaymentSuccess(order.orderNumber);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment Error",
        description: "Something went wrong during the payment process.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  
  

  return (
    <Box maxW="600px" mx="auto" p={5} boxShadow="lg" borderRadius="md" minH="50vh">
      <Heading size="lg" textAlign="center" mb={5}>
        Billing Information
      </Heading>
      <Divider mb={5} />
      <VStack spacing={5} align="stretch">
        <FormControl>
          <FormLabel>Card Number</FormLabel>
          <Box p={3} border="1px solid" borderColor="gray.300" borderRadius="md" bg="white">
            <CardNumberElement />
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>Expiry Date</FormLabel>
          <Box p={3} border="1px solid" borderColor="gray.300" borderRadius="md" bg="white">
            <CardExpiryElement />
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel>CVC</FormLabel>
          <Box p={3} border="1px solid" borderColor="gray.300" borderRadius="md" bg="white">
            <CardCvcElement />
          </Box>
        </FormControl>
        <Divider />
        <Box mt={5} display="flex" justifyContent="space-between">
          <ButtonComponent
            text="Back to Delivery"
            onClick={goToPreviousStep}
            variant="primaryBlackBtn"
          />
          <ButtonComponent
            text={`Pay $${calculateTotalPrice()}`}
            onClick={handlePayment}
            variant="greenBtn"
            isDisabled={!stripe || !elements}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default BillingInformation;
