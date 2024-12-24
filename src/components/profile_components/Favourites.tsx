import React, { useEffect, useState } from "react";
import { Box, Grid, Text, useToast } from "@chakra-ui/react";
import ProductCard from "../shared/ProductCard";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

const Favourites: React.FC = () => {
  // favourites: Stores the list of the user's favorite products fetched from the backend.
  const [favourites, setFavourites] = useState<any[]>([]);
  const toast = useToast();

  // ********************************************* GET FAVORITES
  const fetchFavourites = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/favourites`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If the request is successful, the response is parsed and stored in the favourites state.
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

  // ********************************************* REMOVE FAVORITES
  const handleRemoveFavourite = async (favouriteId: string) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/favourites/${favouriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Updates the favourites state to remove the deleted favorite.
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
