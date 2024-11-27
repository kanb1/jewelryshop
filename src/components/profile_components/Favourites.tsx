import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Button,
  Image,
  useToast,
} from '@chakra-ui/react';

const Favourites: React.FC = () => {
  const [favourites, setFavourites] = useState<any[]>([]);
  const toast = useToast();

  const fetchFavourites = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5001/api/favourites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavourites(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching favourites:', errorData);
        toast({
          title: 'Error',
          description: 'Failed to fetch favourites.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching favourites:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching favourites.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveFavourite = async (favouriteId: string) => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5001/api/favourites/${favouriteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavourites(favourites.filter((fav) => fav._id !== favouriteId));
        toast({
          title: 'Removed',
          description: 'Favourite removed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error('Error removing favourite:', errorData);
        toast({
          title: 'Error',
          description: 'Failed to remove favourite.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error removing favourite:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while removing favourite.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <Box>
      {favourites.length === 0 ? (
        <Text>No favourites yet.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {favourites.map((fav) => (
            <Box key={fav._id} borderWidth="1px" borderRadius="md" p={4}>
              <Image
                src="https://via.placeholder.com/150" // Replace with fav.productId.image if available
                alt={fav.productId.name}
                mb={4}
              />
              <Text fontWeight="bold" mb={2}>
                {fav.productId.name}
              </Text>
              <Text>${fav.productId.price}</Text>
              <Button
                mt={4}
                colorScheme="red"
                size="sm"
                onClick={() => handleRemoveFavourite(fav._id)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favourites;
