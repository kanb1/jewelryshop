import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Heading,
  Text,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

// Hådnterer logikken for at hente og vise produktdata


interface ProductDetailProps {
  updateCartCount: () => void;
}

const ProductDetail: React.FunctionComponent<ProductDetailProps> = ({
  updateCartCount,
}) => {
  // hentes fra URL'en dette bruges til at hente det korrekt eprodukt fra backend
  const { id } = useParams<{ id: string }>();
  // gemmer produktdata hentet fra backend
  const [product, setProduct] = useState<any | null>(null);
  // Indikerer om data stadig hentes
  const [loading, setLoading] = useState<boolean>(true);
  // holder styr på den valgte størrelse (hvis produktet har størrelser)
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, lg: false }); // Detect screen size


  //********************************** */ HENTER PRODUCTDATA
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // henter produktdata baseret på ID fra URL'en
        const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
        const data = await response.json();
        // sætter produktdata i state
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  // ******************************* ADD TO BAG

  const handleAddToBag = async () => {
    // henter token fra localstorage, for at tjekke login
    const token = localStorage.getItem("jwt");
    // hvis der ikke er et JWT token, vises en advarsel om login
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to the bag.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // POST til /api/cart
    // sender en POST forespørgsel til backend med produktID, valgt størrelse og mængde
    try {
      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          size: selectedSize,
          quantity: 1,
        }),
      });

      // kalder updatecartCount() for at opdatere antallet af varer i kurven
      // vi opdaterer updatecartCount for at vise det samlede antal varer i kurven (fx i navbaren med en badge)
      if (response.ok) {
        updateCartCount();
        toast({
          title: "Added to Bag",
          description: `${product.name} has been added to your bag.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add product to the cart.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  // ************************************ HÅNDTER FAVORITES
  const handleAddToFavourites = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to favourites.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          productId: product._id, // Send the product ID to favourites
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to Favourites",
          description: `${product.name} has been added to your favourites.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add product to favourites.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding to favourites:", error);
      toast({
        title: "Error",
        description: "Something went wrong while adding the product to your favourites.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading || !product) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p={10} minH="100vh">
      {/* Breadcrumb */}
      <Breadcrumb fontSize="md" spacing="8px" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            <Text fontWeight="bold" color="gray.700">
              Home
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/products/${product.type}`}>
            <Text fontWeight="bold" color="gray.700">
              {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text fontWeight="bold" color="gray.700">
            {product.name}
          </Text>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Layout */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={10}
        alignItems="start"
      >
        {/* Image Section */}
        <Box>
          {isMobile ? (
            // Mobile: Stacked layout with thumbnails below
            <Box>
              {/* main image */}
              <Image
                src={selectedImage || product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                borderRadius="md"
                objectFit="cover"
                width="100%" // Full-width for mobile
                maxHeight="300px" // Limit height for mobile
              />
              <Box display="flex"
                  gap={2}
                  mt={4}
                  overflowX="auto" // Enable horizontal scrolling
                  css={{
                    '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for cleaner look
                  }}>
                {product.images?.map((img: string, index: number) => (
                  <Image
                  key={index}
                  src={img || "/placeholder.jpg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  borderRadius="md"
                  boxSize="60px" // Smaller size for thumbnails on mobile
                  objectFit="cover"
                  cursor="pointer"
                  border="2px solid"
                  borderColor="gray.300"
                  _hover={{ borderColor: "black" }}
                  onClick={() => setSelectedImage(img)} // Changes main image on click
                  />
                ))}
              </Box>
            </Box>
          ) : (
            // Desktop: Original layout
            <Box display="flex" flexDirection="row" gap={4}>
              {/* Thumbnails */}
              <Box display="flex" flexDirection="column" gap={2}>
                {product.images?.map((img: string, index: number) => (
                  <Image
                  key={index}
                  src={img || "/placeholder.jpg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  borderRadius="md"
                  boxSize="80px" // Ensures uniform thumbnail size
                  objectFit="cover" // Ensures consistent cropping
                  cursor="pointer"
                  border="2px solid"
                  borderColor="gray.300"
                  _hover={{ borderColor: "black" }}
                  onClick={() => setSelectedImage(img)} // Changes main image on click
                  />
                ))}
              </Box>
              {/* Main Image */}
              <Image
                 src={selectedImage || product.images[0] || "/placeholder.jpg"}
                 alt={product.name}
                 borderRadius="md"
                 objectFit="cover" // Ensures image fills its container
                 objectPosition="top" // Aligns content within the image
                 boxSize="500px" // Fixed size for uniformity
              />
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <Box>
          <Heading as="h1" size="lg" mb={4}>
            {product.name}
          </Heading>
          <Text fontSize="xl" fontWeight="bold" color="gray.600" mb={4}>
            ${product.price}
          </Text>

          <Select
            placeholder="Select size"
            mb={4}
            value={selectedSize || ""}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes?.map((size: string) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>

          <VStack spacing={4} align="stretch" mt={4} mb={4}>
            <ButtonComponent
              text="Add to Bag"
              onClick={handleAddToBag}
              variant="primaryBlackBtn"
            />
            <ButtonComponent
              text="Add to Favourites"
              onClick={handleAddToFavourites}
              variant="ctaBtn"
            />
          </VStack>

          {/* Accordion */}
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Description
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {product.description
                  ? product.description
                  : "This product is crafted with precision and care to ensure the highest quality. Perfect for any occasion."}
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Materials and Care
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {product.materialsAndCare
                  ? product.materialsAndCare
                  : "Made from premium materials. Please clean with a soft cloth and avoid exposure to water or harsh chemicals to maintain its shine."}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

        </Box>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
