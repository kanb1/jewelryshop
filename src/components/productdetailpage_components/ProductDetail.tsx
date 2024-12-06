import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Button,
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
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import ButtonComponent from '../shared/ButtonComponent';

interface ProductDetailProps {
  updateCartCount: () => void;
}

const ProductDetail: React.FunctionComponent<ProductDetailProps> = ({ updateCartCount }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToBag = async () => {
    // Debugging the product and payload being sent
    console.log("Product being added:", product);
    console.log("Payload being sent to backend:", {
      productId: product._id, // Ensure this is the ObjectId
      size: selectedSize,
      quantity,
    });
  
    // Retrieve the JWT from localStorage
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to the bag.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return; // Stop execution if no token is found
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the token
        },
        body: JSON.stringify({
          productId: product._id, // Make sure this is the ObjectId
          size: selectedSize,
          quantity,
        }),
      });
  
      if (response.ok) {
        updateCartCount(); // Refresh the cart count
        toast({
          title: "Added to Bag",
          description: `${product.name} has been added to your bag.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
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
        description: "Something went wrong while adding the product to your bag.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
      const response = await fetch("http://localhost:5001/api/favourites", {
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
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
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
    <Box p={10}>
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
          <BreadcrumbLink
            as={Link}
            to={`/products/${product.type}`}
          >
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

      {/* Product Detail Layout */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10}>
        {/* Product Images */}
<Box display="flex" flexDirection="row" gap={4} pt={10}>
  {/* Thumbnails */}
  <Box display="flex" flexDirection="column" gap={2}>
    {product.images?.map((img: any, index: React.Key | null | undefined) => (
      <Image
        key={index}
        src={img || "/placeholder.jpg"}
        alt={`${product.name} thumbnail ${index + 1}`}
        borderRadius="md"
        boxSize="80px"
        objectFit="cover"
        cursor="pointer"
        border="2px solid"
        borderColor="gray.300"
        _hover={{ borderColor: "black" }}
        onClick={() => setSelectedImage(img)} // Set the selected image on click
      />
    ))}
  </Box>

        {/* Main Image */}
        <Box flex="1">
          <Image
            src={selectedImage || product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            borderRadius="md"
            objectFit="cover" // Ensures the image covers the area
            objectPosition="top" // Aligns the image content to the top
            boxSize="500px"
          />
        </Box>
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
            value={selectedSize || ''}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size: string) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))
            ) : (
              <option value="One Size">One Size</option>
            )}
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




          {/* Accordion for Description and Materials & Care */}
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                   Description
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} textAlign="left">
              {product.description ||
        'Crafted with precision and elegance, this piece of jewelry is designed to make a timeless statement. Perfect for both everyday wear and special occasions, its intricate details and fine materials ensure a luxurious experience.'}              
        </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Materials and Care
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} textAlign="left">
              {product.materialsAndCare ||
        'Made from high-quality 18K gold and adorned with ethically sourced gemstones. To maintain its brilliance, avoid direct contact with water, perfumes, and chemicals. Clean gently with a soft cloth to preserve its luster.'}
        </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
