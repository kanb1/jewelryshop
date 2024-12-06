import React, { useEffect, useState } from "react";
import { Box, Grid, Text, useToast } from "@chakra-ui/react";
import ProductCard from "../shared/ProductCard";
import ButtonComponent from "../shared/ButtonComponent";

const Favourites: React.FC = () => {
  const [favourites, setFavourites] = useState<any[]>([]);
  const toast = useToast();

  const fetchFavourites = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5001/api/favourites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavourites(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching favourites:", errorData);
        toast({
          title: "Error",
          description: "Failed to fetch favourites.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching favourites.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveFavourite = async (favouriteId: string) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/favourites/${favouriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFavourites(favourites.filter((fav) => fav._id !== favouriteId));
        toast({
          title: "Removed",
          description: "Favourite removed successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Error removing favourite:", errorData);
        toast({
          title: "Error",
          description: "Failed to remove favourite.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
      toast({
        title: "Error",
        description: "Something went wrong while removing favourite.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <Box minH="50vh">
      {favourites.length === 0 ? (
        <Text>No favourites yet.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {favourites.map((fav) => (
            <ProductCard
              key={fav._id}
              product={{
                _id: fav.productId._id,
                name: fav.productId.name,
                price: fav.productId.price,
                type: fav.productId.type,
                productCollection: fav.productId.productCollection,
                images: fav.productId.images,
              }}
            >
              <Box mt={4}>
                <ButtonComponent
                  text="Remove from favorites"
                  variant="redBtn"
                  onClick={() => handleRemoveFavourite(fav._id)}
                />
              </Box>
            </ProductCard>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favourites;
