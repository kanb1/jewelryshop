import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Select,
  Button,
  Text,
  Stack,
  RadioGroup,
  Radio,
  Divider,
  Grid,
} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";



interface DeliveryInfoProps {
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryMethod: "home" | "parcel-shop";
  };
  setDeliveryInfo: React.Dispatch<
    React.SetStateAction<{
      address: string;
      city: string;
      postalCode: string;
      country: string;
      deliveryMethod: "home" | "parcel-shop";
    }>
  >;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"delivery" | "billing" | "confirmation">
  >;
}


const DeliveryInformation: React.FC<DeliveryInfoProps> = ({
  deliveryInfo,
  setDeliveryInfo,
  setCurrentStep,

}) => {
  const navigate = useNavigate(); // Add navigation hook
  const [parcelShops, setParcelShops] = useState<any[]>([]);
  const [selectedParcelShop, setSelectedParcelShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const fetchParcelShops = async () => {
    if (!deliveryInfo.address) {
      alert("Please enter an address to find parcel shops!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/delivery/parcel-shops?address=${deliveryInfo.address}&radius=10000`
      );
      const data = await response.json();
      if (data.length === 0) {
        alert("No parcel shops found near this address!");
      } else {
        setParcelShops(data.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching parcel shops:", error);
      alert("Failed to fetch parcel shops. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toast = useToast();

  const handleSelectParcelShop = (shop: any) => {
    setSelectedParcelShop(shop);
    setDeliveryInfo({
      ...deliveryInfo,
      address: shop.address,
      city: shop.city,
      postalCode: shop.postcode,
      country: shop.country,
      deliveryMethod: "parcel-shop", // Update delivery method
    });
    // Show a toast message
  toast({
    title: "Parcel Shop Selected",
    description: `You have selected ${shop.name} for delivery.`,
    status: "success", // success, error, warning, or info
    duration: 5000, // Time in milliseconds
    isClosable: true, // Allow the user to close the toast
    position: "top", // Position of the toast (e.g., top, bottom-right)
  });
  };

  const saveAndPay = () => {
    if (deliveryInfo.deliveryMethod === "home") {
      if (
        !deliveryInfo.address ||
        !deliveryInfo.city ||
        !deliveryInfo.postalCode ||
        !deliveryInfo.country
      ) {
        alert("Please fill in all home delivery information!");
        return;
      }
    } else if (!selectedParcelShop) {
      alert("Please select a parcel shop for delivery!");
      return;
    }

    setCurrentStep("billing"); // Proceed to billing
  };



  return (

    
    
    
    <Box p={5} maxW="800px" mx="auto">
      <Box mb={4}>
      <ButtonComponent
          text="Back to Cart"
          onClick={() => navigate("/cart")} 
          variant="primaryBlackBtn"
        />
</Box>
    <Heading size="lg" textAlign="center" mb={6}>
      Delivery Information
    </Heading>

    <VStack spacing={5} align="stretch">
      {/* Address Input Fields */}
      <Divider />
      <Heading size="md" mb={2}>
        Address Details
      </Heading>
      <Input
        placeholder="Address"
        name="address"
        value={deliveryInfo.address}
        onChange={handleInputChange}
      />
      <Input
        placeholder="City"
        name="city"
        value={deliveryInfo.city}
        onChange={handleInputChange}
      />
      <Input
        placeholder="Postal Code"
        name="postalCode"
        value={deliveryInfo.postalCode}
        onChange={handleInputChange}
      />
      <Select
        placeholder="Select Country"
        name="country"
        value={deliveryInfo.country}
        onChange={(e) =>
          setDeliveryInfo({ ...deliveryInfo, country: e.target.value })
        }
      >
        <option value="Denmark">Denmark</option>
      </Select>

      <Divider />

      {/* Delivery Method Selection */}
      <Heading size="md" mb={2}>
        Delivery Method
      </Heading>
      <RadioGroup
        onChange={(value: "home" | "parcel-shop") =>
          setDeliveryInfo({ ...deliveryInfo, deliveryMethod: value })
        }
        value={deliveryInfo.deliveryMethod}
      >
        <Stack direction="row" spacing={5}>
          <Radio value="home">Home Delivery</Radio>
          <Radio value="parcel-shop">Parcel Shop Delivery</Radio>
        </Stack>
      </RadioGroup>

      {/* Parcel Shop Logic */}
      {deliveryInfo.deliveryMethod === "parcel-shop" && (
        <>
          <Button
            onClick={fetchParcelShops}
            isLoading={isLoading}
            mt={4}
            colorScheme="blue"
            width="50%"
            alignSelf="center"
          >
            Find Parcel Shops
          </Button>
          {parcelShops.length > 0 && (
           <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} mt={6}>
           {parcelShops.map((shop, index) => (
             <Box
               key={index}
               border="1px"
               borderColor="gray.300"
               p={5}
               borderRadius="lg"
               boxShadow="md"
               textAlign="center"
               _hover={{
                 boxShadow: "xl",
                 transform: "scale(1.05)",
                 transition: "all 0.3s",
               }}
             >
               <Text fontWeight="bold" fontSize="lg" mb={2}>
                 {shop.name}
               </Text>

               <Text fontSize="sm" color="gray.500" mb={4}>
                 {shop.city}, {shop.postcode}
               </Text>
               <Button
                 onClick={() => handleSelectParcelShop(shop)}
                 colorScheme="green"
                 variant="solid"
                 size="sm"
               >
                 Deliver Here
               </Button>
             </Box>
           ))}
         </Grid>
          )}
        </>
      )}

      {/* Home Delivery Logic */}
      {deliveryInfo.deliveryMethod === "home" && (
        <Text mt={4} color="gray.600">
          Ensure your address is correct before proceeding.
        </Text>
      )}

      <Divider />
          
          <ButtonComponent
            text="Save and Continue to Billing"
            onClick={saveAndPay}
            variant="greenBtn"
          />

    </VStack>
  </Box>
);
};

export default DeliveryInformation;
