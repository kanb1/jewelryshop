import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const Products: React.FC = () => {
  const { category } = useParams<{ category: string }>(); // Get category from URL
  const [sortOption, setSortOption] = useState("priceLowToHigh");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<string[]>([]);

  // Expanded dummy product data
  const dummyProducts = [
    { id: 1, name: "Gold Necklace", type: "Necklaces", collection: "Love", price: 200 },
    { id: 2, name: "Silver Ring", type: "Rings", collection: "Flower", price: 150 },
    { id: 3, name: "Diamond Earring", type: "Earrings", collection: "Greece", price: 300 },
    { id: 4, name: "Gold Bangle", type: "Bangles", collection: "Gold", price: 250 },
    { id: 5, name: "Ruby Ring", type: "Rings", collection: "Love", price: 400 },
    { id: 6, name: "Pearl Necklace", type: "Necklaces", collection: "Flower", price: 180 },
    { id: 7, name: "Sapphire Earrings", type: "Earrings", collection: "Greece", price: 350 },
    { id: 8, name: "Platinum Ring", type: "Rings", collection: "Gold", price: 500 },
    { id: 9, name: "Emerald Necklace", type: "Necklaces", collection: "Greece", price: 220 },
    { id: 10, name: "Silver Bangle", type: "Bangles", collection: "Flower", price: 120 },
  ];

  // Sync selectedJewelryTypes with category from URL
  useEffect(() => {
    if (category) {
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      setSelectedJewelryTypes([formattedCategory]); // Sync filter with navbar category
    } else {
      setSelectedJewelryTypes([]); // Reset filter when navigating back to "All"
    }
  }, [category]);

  // Filter products based on selected filters
  const filteredProducts = dummyProducts
    .filter((product) => {
      const matchesType =
        selectedJewelryTypes.length === 0 || selectedJewelryTypes.includes(product.type);
      const matchesCollection =
        selectedCollections.length === 0 || selectedCollections.includes(product.collection);
      return matchesType && matchesCollection;
    })
    .sort((a, b) => {
      if (sortOption === "priceLowToHigh") return a.price - b.price;
      if (sortOption === "priceHighToLow") return b.price - a.price;
      return 0;
    });

  return (
    <Box p={10}>
      {/* Header Section */}
      <Heading as="h1" size="lg" mb={4}>
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
      </Heading>

      {/* Layout: Sidebar + Product Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 3fr" }} gap={10}>
        {/* Sidebar */}
        <Box as="aside" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
          <Heading as="h2" size="md" mb={4}>
            Filter
          </Heading>

          {/* Sort By */}
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={2}>
              Sort By
            </Heading>
            <RadioGroup value={sortOption} onChange={setSortOption}>
              <Stack direction="column">
                <Radio value="priceLowToHigh">Price Low to High</Radio>
                <Radio value="priceHighToLow">Price High to Low</Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Divider my={4} />

          {/* Collections */}
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={2}>
              Collections
            </Heading>
            <Stack direction="column">
              {["Love", "Flower", "Greece", "Gold"].map((collection) => (
                <Checkbox
                  key={collection}
                  value={collection}
                  isChecked={selectedCollections.includes(collection)}
                  onChange={(e) =>
                    setSelectedCollections((prev) =>
                      e.target.checked
                        ? [...prev, collection]
                        : prev.filter((c) => c !== collection)
                    )
                  }
                >
                  {collection}
                </Checkbox>
              ))}
            </Stack>
          </Box>

          <Divider my={4} />

          {/* Jewelry Types */}
          <Box>
            <Heading as="h3" size="sm" mb={2}>
              Jewelry Types
            </Heading>
            <Stack direction="column">
              {["Necklaces", "Earrings", "Bangles", "Rings"].map((type) => (
                <Checkbox
                  key={type}
                  value={type}
                  isChecked={selectedJewelryTypes.includes(type)}
                  onChange={(e) =>
                    setSelectedJewelryTypes((prev) =>
                      e.target.checked
                        ? [...prev, type]
                        : prev.filter((t) => t !== type)
                    )
                  }
                >
                  {type}
                </Checkbox>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Product Grid */}
        <Box as="section">
          <Text mb={4}>{filteredProducts.length} Products Found</Text>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {filteredProducts.map((product) => (
              <Box
                key={product.id}
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Box height="200px" bg="gray.300" mb={4}></Box> {/* Placeholder for product image */}
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  {product.type} | {product.collection}
                </Text>
                <Text color="green.500" mb={4}>
                  ${product.price}
                </Text>
                <Button size="sm" colorScheme="teal">
                  Add to Cart
                </Button>
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default Products;
