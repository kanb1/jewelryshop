import React from 'react';
import { Box, Heading, Grid, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Collections: React.FC = () => {
  const collections = ["Love", "Flower", "Greece", "Gold"]; // Example collections

  return (
    <Box p={10}>
      <Heading as="h1" size="lg" mb={6}>
        Explore Our Collections
      </Heading>
      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
        {collections.map((collection) => (
          <Box
            as={Link}
            to={`/products/${collection.toLowerCase()}`} // Navigate to the Products page for each collection
            key={collection}
            p={6}
            bg="gray.100"
            borderRadius="md"
            textAlign="center"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            boxShadow="md"
          >
            <Text fontWeight="bold">{collection}</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Collections;
