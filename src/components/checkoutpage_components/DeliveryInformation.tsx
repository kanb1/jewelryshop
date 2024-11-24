import React, { useState } from "react";
import { Box, Heading, VStack, Input, Select, Button } from "@chakra-ui/react";

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
}

const DeliveryInformation: React.FC<DeliveryInfoProps> = ({
  deliveryInfo,
  setDeliveryInfo,
}) => {
  const [parcelShops, setParcelShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParcelShops = async () => {
    try {
      setLoading(true); // Start loading state
      const queryParams = new URLSearchParams({
        address: `${deliveryInfo.address || deliveryInfo.city}`,
        radius: "10000", // Set the radius (10 km)
      });

      const response = await fetch(
        `http://localhost:5001/api/delivery/parcel-shops?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch parcel shops");
      }

      const data = await response.json();
      setParcelShops(data); // Update parcel shops
    } catch (error) {
      console.error("Error fetching parcel shops:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Box>
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
        <Button
          colorScheme="blue"
          onClick={fetchParcelShops}
          isLoading={loading}
        >
          Find Parcel Shops
        </Button>
        {parcelShops.length > 0 && (
          <Select placeholder="Select Parcel Shop">
            {parcelShops.map((shop, index) => (
              <option key={index} value={shop.name}>
                {shop.name}, {shop.address}, {shop.city}
              </option>
            ))}
          </Select>
        )}
      </VStack>
    </Box>
  );
};

export default DeliveryInformation;
