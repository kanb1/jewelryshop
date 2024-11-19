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

interface Product {
  _id: string;
  name: string;
  type: string;
  productCollection: string;
  price: number;
}

const Products: React.FC = () => {
  const { category } = useParams<{ category: string }>(); // Current category from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "priceHighToLow");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<string[]>(
    category === "all" || !category ? [] : [category]
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products and collections initially
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products`);
        const data: Product[] = await response.json();
        setProducts(data);

        // Extract unique collections
        const uniqueCollections = Array.from(new Set(data.map((product) => product.productCollection)));
        setAllCollections(uniqueCollections);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Reset filters whenever the category changes
  useEffect(() => {
    if (category === "all" || !category) {
      setSelectedJewelryTypes([]);
      setSelectedCollections([]);
      setSearchParams({}); // Clear all search params
    } else {
      setSelectedJewelryTypes([category]);
      setSelectedCollections([]); // Clear collection filters
      setSearchParams({ type: category }); // Reflect category in URL
    }
  }, [category]);

  // Fetch filtered products based on user selection
  useEffect(() => {
    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedJewelryTypes.length && !selectedJewelryTypes.includes("all jewelries")) {
                selectedJewelryTypes.forEach((type) => params.append("type", type));
            }
            if (selectedCollections.length) {
                selectedCollections.forEach((collection) => params.append("collection", collection));
            }
            if (sortOption) {
                params.append("sort", sortOption === "priceHighToLow" ? "priceHighToLow" : "priceLowToHigh");
            }

            const response = await fetch(`http://localhost:5001/api/products?${params.toString()}`);
            const data = await response.json();

            // Sorting based on price
            const sortedData = data.sort((a: Product, b: Product) => {
                if (sortOption === "priceHighToLow") {
                    return b.price - a.price; // Sort descending (High to Low)
                }
                if (sortOption === "priceLowToHigh") {
                    return a.price - b.price; // Sort ascending (Low to High)
                }
                return 0; // No sorting if no sortOption
            });

            setProducts(sortedData);
        } catch (err) {
            console.error("Error fetching filtered products:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchFilteredProducts();
}, [selectedJewelryTypes, selectedCollections, sortOption]);


  // Handle Jewelry Type Filter Change
  const handleJewelryTypeChange = (type: string) => {
    if (type === "all jewelries") {
      // If "All Jewelries" is selected, reset other selections
      setSelectedJewelryTypes(["all jewelries"]);  // Only keep "all jewelries"
    } else {
      // If another type is selected, handle toggling the selection
      setSelectedJewelryTypes((prev) =>
        prev.includes(type)
          ? prev.filter((t) => t !== type)  // Remove if already selected
          : [...prev.filter((t) => t !== "all jewelries"), type]  // Add type if not already selected
      );
    }
  
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete("type"); // Clear the existing 'type' param
    selectedJewelryTypes.forEach((t) => params.append("type", t)); // Append the updated jewelry types
    setSearchParams(params); // Sync URL
  };
  

  // Handle Collection Change
  const handleCollectionChange = (collection: string, isChecked: boolean) => {
    const updatedCollections = isChecked
      ? [...selectedCollections, collection] 
      : selectedCollections.filter((c) => c !== collection);
  
    setSelectedCollections(updatedCollections);
  };

  // Sync URL with Filter Selection
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedJewelryTypes.length) {
      selectedJewelryTypes.forEach((type) => params.append("type", type));
    }
    if (selectedCollections.length) {
      selectedCollections.forEach((collection) => params.append("collection", collection));
    }
    if (sortOption) {
      params.append("sort", sortOption === "priceHighToLow" ? "priceHighToLow" : "priceLowToHigh");
    }

    setSearchParams(params); // Only update the URL when there are changes
  }, [selectedJewelryTypes, selectedCollections, sortOption]); // Sync URL with filter state

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
              {allCollections.map((collection) => (
                <Checkbox
                  key={collection}
                  value={collection}
                  isChecked={selectedCollections.includes(collection)}
                  onChange={(e) => handleCollectionChange(collection, e.target.checked)}
                >
                  {collection}
                </Checkbox>
              ))}
            </Stack>
          </Box>

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
            {["necklaces", "earrings", "bracelets", "rings"].map((type) => (
              <Checkbox
                key={type}
                value={type}
                isChecked={selectedJewelryTypes.includes(type)}
                onChange={() => handleJewelryTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Checkbox>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Product Grid */}
      <Box as="section">
        <Text mb={4}>Showing {products.length} products</Text>
        {loading ? (
          <Text>Loading products...</Text>
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {products.map((product) => (
              <Box
                key={product._id}
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
                  {product.type} | {product.productCollection}
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
        )}
      </Box>
    </Grid>
  </Box>
);
};

export default Products;
