import React from "react";
// Secure inputs for credit card details
// useStripe() and useElements() are Stripe hooks to interact with Stripe's payment API
import {
  // they are secured components and they validate input automatically
  // I return stripe element objects that stripe can use to process payments (I'm in developermode on stripe)
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, VStack, Divider, FormControl, FormLabel, Heading} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";
import { useToast } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";

// ******************************* STRIPE
// VALIDATION BUIL IN: 
// Card number validation (e.g., 4111 1111 1111 1111 for Visa).
//Expiry date must be in the future.
//CVC must be 3 or 4 digits.




interface BillingProps {
  total: number; //total price from checkoutpage
  onPaymentSuccess: (orderNumber: string) => void; //callback t o move to the confirmation step
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


// ********************************COMPONENT
// receives the props onpaymentsucces, cartitems and so on
const BillingInformation: React.FC<BillingProps> = ({
  onPaymentSuccess,
  cartItems,
  deliveryInfo,
  goToPreviousStep,
}) => {
  console.log("Cart Items:", cartItems);

  // stripe hooks
  const stripe = useStripe(); //accesses stripe instance
  const elements = useElements(); //provides the stripe elemnts such as card input fields
  const toast = useToast(); //notifications

  // calculate sthe total price dynamically by summing up the price * quanty for each cart item
  const calculateTotalPrice = () => {
    return cartItems.reduce((sum: number, item: { productId: { price: number; }; quantity: number; }) => sum + item.productId.price * item.quantity, 0);
  };

  // ******************************* HANDLE PAYMENT
  const handlePayment = async () => {
    // login first
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
  
    // ensures that stripe and elements are intialized
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
  
    // fetch paymentintent
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          // passes the amount in cents and currency
          amount: calculateTotalPrice() * 100,
          currency: "usd",
        }),
      });
  
      // receives clientsecret to confirm the payment
      const { clientSecret } = await response.json();
  
      // conifrm the payment using stripe's confirmCardPayment() with the client secret and card input
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

       // Like said above
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
        // After a successful payment, save the order in the backend /api/orders
        const saveOrderResponse = await fetch(`${BACKEND_URL}/api/orders`, {
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
  
        // handle success
        const { order } = await saveOrderResponse.json();
        toast({
          title: "Payment Successful",
          description: `Order #${order.orderNumber} placed successfully!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // calls onPaymentSuccess to update the parent component chechkoutpage to the confirm step
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
            {/* Renders Stripe inputs for card number and so on */}
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
