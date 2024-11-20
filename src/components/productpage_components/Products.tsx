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
import ProductCard from "../shared/ProductCard";

const Products: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "priceLowToHigh");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<string[]>(
    category === "all" || !category ? [] : [category]
  );
  const [products, setProducts] = useState([]);
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch products based on filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const page = searchParams.get("page") || "1";
        const limit = 6;

        const response = await fetch(
          `http://localhost:5001/api/products?page=${page}&limit=${limit}&${searchParams.toString()}`
        );
        const data = await response.json();

        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setTotalPages(data.totalPages);
        setCurrentPage(parseInt(page));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, sortOption]); // Fetch products whenever searchParams change

 // Reset filters whenever the category changes
useEffect(() => {
  if (category) {
    if (category === "all") {
      setSelectedJewelryTypes([]);
      setSelectedCollections([]);
      setSearchParams({});
    } else {
      // Set the selected category as the jewelry type filter
      setSelectedJewelryTypes([category]);
      setSelectedCollections([]);
      setSearchParams({ type: category }); // Set the type in the URL search params
      setCurrentPage(1); // Reset to page 1
    }
  }
}, [category]);


  // Fetch collections independently
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/collections`);
        const data = await response.json();
        setAllCollections(data.collections || []);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };

    fetchCollections();
  }, []);

  // Handle Collection Change
  const handleCollectionChange = (collection: string, isChecked: boolean) => {
    const updatedCollections = isChecked
      ? [...selectedCollections, collection]
      : selectedCollections.filter((c) => c !== collection);

    setSelectedCollections(updatedCollections);

    const params = new URLSearchParams(searchParams);
    params.delete("collection");
    updatedCollections.forEach((col) => params.append("collection", col));
    params.set("page", "1"); // Reset page to 1
    setSearchParams(params);
  };

 // Handle Jewelry Type Filter Change
const handleJewelryTypeChange = (type: string, isChecked: boolean) => {
  const updatedJewelryTypes = isChecked
    ? [...selectedJewelryTypes, type]
    : selectedJewelryTypes.filter((t) => t !== type);

  setSelectedJewelryTypes(updatedJewelryTypes);

  const params = new URLSearchParams(searchParams);
  params.delete("type"); // Clear existing 'type' params
  updatedJewelryTypes.forEach((t) => params.append("type", t)); // Add updated types
  params.set("page", "1"); // Reset to page 1 when the filter changes
  setSearchParams(params); // Sync URL
};

  // Handle Sort Change
const handleSortChange = (sortOption: string) => {
  setSortOption(sortOption); // Update the state for the selected sort option

  const params = new URLSearchParams(searchParams);
  params.set("sort", sortOption); // Set the sort parameter
  params.set("page", "1"); // Reset to page 1 when sort changes
  setSearchParams(params);
};

  // Handle Page Change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      setSearchParams(params);
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
          <strong>Jewelry Types:</strong> {selectedJewelryTypes.length > 0 ? selectedJewelryTypes.join(", ") : "None"}
        </Text>
        <Text fontSize="sm" color="gray.600">
          <strong>Collections:</strong> {selectedCollections.length > 0 ? selectedCollections.join(", ") : "None"}
        </Text>
      </Box>

      {/* Layout: Sidebar + Product Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 3fr" }} gap={10}>
        {/* Sidebar */}
        <Box as="aside" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
          <Heading as="h2" size="md" mb={4}>
            Filter
          </Heading>
          <Box mb={6}>
  <Heading as="h3" size="sm" mb={2}>
    Sort By
  </Heading>
  <RadioGroup value={sortOption} onChange={handleSortChange}>
    <Stack direction="column">
      <Radio value="priceHighToLow">Price High to Low</Radio>
      <Radio value="priceLowToHigh">Price Low to High</Radio>
    </Stack>
  </RadioGroup>
</Box>

          <Divider my={4} />
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
          <Box>
  <Heading as="h3" size="sm" mb={2}>
    Jewelry Types
  </Heading>
  <Stack direction="column">
    {["necklaces", "earrings", "bracelets", "rings"].map((type) => (
      <Checkbox
        key={type}
        value={type}
        isChecked={selectedJewelryTypes.includes(type)}
        onChange={(e) => handleJewelryTypeChange(type, e.target.checked)}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Checkbox>
    ))}
  </Stack>
</Box>;
        </Box>

        {/* Product Grid */}
        <Box as="section">
        <Text mb={4}>
  {totalProducts > 0 
    ? `${totalProducts} products in total` 
    : "No products found"}
</Text>

          {loading ? (
            <Text>Loading products...</Text>
          ) : (
<Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
  {products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</Grid>

          )}
        </Box>
      </Grid>

           {/* Pagination Controls */}
           <Stack direction="row" spacing={4} mt={6} justify="center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>{`${currentPage} of ${totalPages}`}</Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default Products;
