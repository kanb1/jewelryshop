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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useParams, useSearchParams, Link } from "react-router-dom";

const Products: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "priceHighToLow");
  const [selectedCollections, setSelectedCollections] = useState<string[]>(searchParams.getAll("collection"));
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<string[]>(
    category === "all" || !category ? [] : [category]
  );

  const dummyProducts = [
    { id: 1, name: "Gold Necklace", type: "necklaces", collection: "Love", price: 200 },
    { id: 2, name: "Silver Ring", type: "rings", collection: "Flower", price: 150 },
    { id: 3, name: "Diamond Earring", type: "earrings", collection: "Greece", price: 300 },
    { id: 4, name: "Gold Bangle", type: "bangles", collection: "Gold", price: 250 },
    { id: 5, name: "Ruby Ring", type: "rings", collection: "Love", price: 400 },
    { id: 6, name: "Pearl Necklace", type: "necklaces", collection: "Flower", price: 180 },
    { id: 7, name: "Sapphire Earrings", type: "earrings", collection: "Greece", price: 350 },
    { id: 8, name: "Platinum Ring", type: "rings", collection: "Gold", price: 500 },
    { id: 9, name: "Emerald Necklace", type: "necklaces", collection: "Greece", price: 220 },
    { id: 10, name: "Silver Bangle", type: "bangles", collection: "Flower", price: 120 },
    { id: 11, name: "Gold Earrings", type: "earrings", collection: "Love", price: 280 },
    { id: 12, name: "Diamond Ring", type: "rings", collection: "Gold", price: 600 },
  ];

  // Filter products based on category, collections, and filters
  const filteredProducts = dummyProducts.filter((product) => {
    const matchesCollection =
      selectedCollections.length > 0 ? selectedCollections.includes(product.collection) : true;

    const matchesJewelryType =
      selectedJewelryTypes.includes("all jewelries") ||
      selectedJewelryTypes.length === 0 ||
      selectedJewelryTypes.includes(product.type);

    return matchesCollection && matchesJewelryType;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceHighToLow") return b.price - a.price;
    if (sortOption === "priceLowToHigh") return a.price - b.price;
    return 0;
  });

  // Update the URL search parameters whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (sortOption) params.set("sort", sortOption);
    if (selectedCollections.length) selectedCollections.forEach((col) => params.append("collection", col));
    if (selectedJewelryTypes.length) selectedJewelryTypes.forEach((type) => params.append("type", type));
    setSearchParams(params);
  }, [sortOption, selectedCollections, selectedJewelryTypes, setSearchParams]);

  // Reset jewelry type filter whenever category changes from the navbar or breadcrumb
  useEffect(() => {
    if (category === "all" || !category) {
      setSelectedJewelryTypes([]); // Reset to all products
      setSelectedCollections([]); // Clear collection filters
      setSearchParams({}); // Clear all search params
    } else {
      setSelectedJewelryTypes([category]); // Reset to only the selected category
      setSelectedCollections([]); // Clear collection filters
      setSearchParams({ type: category }); // Update URL to reflect category change
    }
  }, [category]);

  const handleJewelryTypeChange = (type: string) => {
    if (type === "all jewelries") {
      setSelectedJewelryTypes(["all jewelries"]);
    } else {
      setSelectedJewelryTypes((prev) =>
        prev.includes(type)
          ? prev.filter((t) => t !== type)
          : [...prev.filter((t) => t !== "all jewelries"), type]
      );
    }
  };

  return (
    <Box p={10}>
      {/* Breadcrumb */}
      <Breadcrumb fontSize="md" spacing="8px" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/" fontWeight="medium" color="blue.500">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to="/products/all"
            fontWeight="medium"
            color="blue.500"
            onClick={() => {
              setSelectedCollections([]);
              setSelectedJewelryTypes([]);
              setSearchParams({});
            }}
          >
            All products
          </BreadcrumbLink>
        </BreadcrumbItem>
        {category && category !== "all" && (
          <BreadcrumbItem isCurrentPage>
            <Text fontWeight="bold" color="gray.700">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      {/* Filter Summary */}
      <Box mb={6} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
        <Heading as="h3" size="sm" mb={2} color="gray.600">
          Active Filters
        </Heading>
        <Text fontSize="sm" color="gray.600">
          <strong>Jewelry Types:</strong>{" "}
          {selectedJewelryTypes.length > 0 ? selectedJewelryTypes.join(", ") : "None"}
        </Text>
        <Text fontSize="sm" color="gray.600">
          <strong>Collections:</strong>{" "}
          {selectedCollections.length > 0 ? selectedCollections.join(", ") : "None"}
        </Text>
      </Box>

      {/* Header */}
      <Heading as="h1" size="lg" mb={4}>
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
      </Heading>
      <Text mb={6}>
        Browse our exclusive {category || "products"} collection and find your perfect match!
      </Text>

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
            <RadioGroup value={sortOption} onChange={(value) => setSortOption(value)}>
              <Stack direction="column">
                <Radio value="priceHighToLow">Price High to Low</Radio>
                <Radio value="priceLowToHigh">Price Low to High</Radio>
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
              <Checkbox
                value="all jewelries"
                isChecked={selectedJewelryTypes.includes("all jewelries")}
                onChange={() => handleJewelryTypeChange("all jewelries")}
              >
                All Jewelries
              </Checkbox>
              {["Necklaces", "Earrings", "Bangles", "Rings"].map((type) => (
                <Checkbox
                  key={type}
                  value={type}
                  isChecked={selectedJewelryTypes.includes(type.toLowerCase())}
                  onChange={() => handleJewelryTypeChange(type.toLowerCase())}
                >
                  {type}
                </Checkbox>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Product Grid */}
        <Box as="section">
          <Text mb={4}>Showing {sortedProducts.length} products</Text>
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {sortedProducts.map((product) => (
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
                <Box height="200px" bg="gray.300" mb={4}></Box>
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
