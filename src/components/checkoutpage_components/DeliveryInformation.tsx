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
} from "@chakra-ui/react";

interface DeliveryInfoProps {
  deliveryInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  setDeliveryInfo: (info: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => void;
  setCurrentStep: (step: "cart" | "delivery" | "billing" | "confirmation") => void;
}

const DeliveryInformation: React.FC<DeliveryInfoProps> = ({
  deliveryInfo,
  setDeliveryInfo,
  setCurrentStep,
}) => {
  const [parcelShops, setParcelShops] = useState<any[]>([]);
  const [selectedParcelShop, setSelectedParcelShop] = useState<any>(null);

  const fetchParcelShops = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/delivery/parcel-shops?address=${deliveryInfo.address}&radius=10000`
      );
      const data = await response.json();
      setParcelShops(data.slice(0, 3)); // Limit to 3 parcel shops
    } catch (error) {
      console.error("Error fetching parcel shops:", error);
    }
  };

  const handleSelectParcelShop = (shop: any) => {
    setSelectedParcelShop(shop);
    setDeliveryInfo({
      address: shop.address,
      city: shop.city,
      postalCode: shop.postcode,
      country: shop.country,
    });
  };

  const saveAndPay = () => {
    if (
      deliveryInfo.address &&
      deliveryInfo.city &&
      deliveryInfo.postalCode &&
      deliveryInfo.country
    ) {
      setCurrentStep("billing"); // Move to billing step
    } else {
      alert("Please fill in all delivery information!");
    }
  };

  return (
    <Box>
      <Text>Cart &gt; Delivery &gt; Billing &gt; Confirmation</Text>
      <Heading size="md" mb={4}>
        Delivery Information
      </Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Address"
          value={deliveryInfo.address}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
          }
        />
        <Input
          placeholder="City"
          value={deliveryInfo.city}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
          }
        />
        <Input
          placeholder="Postal Code"
          value={deliveryInfo.postalCode}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })
          }
        />
        <Select
          placeholder="Country"
          value={deliveryInfo.country}
          onChange={(e) =>
            setDeliveryInfo({ ...deliveryInfo, country: e.target.value })
          }
        >
          <option value="Denmark">Denmark</option>
          <option value="Sweden">Sweden</option>
          <option value="Norway">Norway</option>
        </Select>
        <Button colorScheme="blue" onClick={fetchParcelShops}>
          Find Parcel Shops
        </Button>

        {parcelShops.length > 0 && (
          <Stack spacing={4} mt={4}>
            {parcelShops.map((shop, index) => (
              <Box key={index} border="1px" borderColor="gray.200" p={4}>
                <Text>{shop.address}</Text>
                <Text>{shop.city}, {shop.postcode}</Text>
                <Button
                  colorScheme="green"
                  onClick={() => handleSelectParcelShop(shop)}
                >
                  Deliver here
                </Button>
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

        <Button colorScheme="green" onClick={saveAndPay}>
          Save and Continue to Billing
        </Button>
      </VStack>
    </Box>
  );
};

export default DeliveryInformation;
