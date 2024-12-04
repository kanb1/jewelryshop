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
} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";

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
    React.SetStateAction<"cart" | "delivery" | "billing" | "confirmation">
  >;
}

const DeliveryInformation: React.FC<DeliveryInfoProps> = ({
  deliveryInfo,
  setDeliveryInfo,
  setCurrentStep,
}) => {
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
        `http://localhost:5001/api/delivery/parcel-shops?address=${deliveryInfo.address}&radius=10000`
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
    alert(`Delivery address updated to parcel shop: ${shop.address}`);
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
    <Box>
      <Text>Cart &gt; Delivery &gt; Billing &gt; Confirmation</Text>
      <Heading size="md" mb={4}>
        Delivery Information
      </Heading>
      <VStack spacing={4}>
        {/* Address Input Fields */}
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
          placeholder="Country"
          name="country"
          value={deliveryInfo.country}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, country: e.target.value })
          }
        >
          <option value="Denmark">Denmark</option>
          <option value="Sweden">Sweden</option>
          <option value="Norway">Norway</option>
        </Select>

        {/* Delivery Method Selection */}
        {deliveryInfo.address && deliveryInfo.city && deliveryInfo.postalCode && (
          <>
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
                <ButtonComponent
                  text="Find Parcel Shops"
                  onClick={fetchParcelShops}
                  variant="primaryBlackBtn"
                  styleOverride={{
                    isLoading,
                    marginTop: "1rem",
                    width: "50%",
                  }}
                />

                {parcelShops.length > 0 && (
                  <Stack spacing={4} mt={4}>
                    {parcelShops.map((shop, index) => (
                      <Box key={index} border="1px" borderColor="gray.200" p={4}>
                        <Text>{shop.address}</Text>
                        <Text>
                          {shop.city}, {shop.postcode}
                        </Text>
                        <ButtonComponent
                          text="Deliver here"
                          onClick={() => handleSelectParcelShop(shop)}
                          variant="primaryBlackBtn"
                        />
                      </Box>
                    ))}
                  </Stack>
                )}

                {selectedParcelShop && (
                  <Box mt={4} border="1px" borderColor="green.200" p={4}>
                    <Text>Selected Parcel Shop:</Text>
                    <Text>{selectedParcelShop.name}</Text>
                    <Text>{selectedParcelShop.address}</Text>
                  </Box>
                )}
              </>
            )}

            {/* Home Delivery Logic */}
            {deliveryInfo.deliveryMethod === "home" && (
              <Text mt={4}>
                You have selected home delivery. Please ensure your address is
                correct before proceeding.
              </Text>
            )}
          </>
        )}

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
