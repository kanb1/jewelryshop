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
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

interface ProductDetailProps {
  updateCartCount: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ updateCartCount }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // State to track selected size
  const [quantity, setQuantity] = useState<number>(1); // Default quantity
  const toast = useToast();

  useEffect(() => {
    // Fetch the product details
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
    const token = localStorage.getItem('jwt');
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to the bag.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: 'Select Size',
        description: 'Please select a size before adding to the bag.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, size: selectedSize, quantity }),
      });

      if (response.ok) {
        updateCartCount(); // Refresh the cart count
        toast({
          title: 'Added to Bag',
          description: `${product.name} has been added to your bag.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to add product to bag');
      }
    } catch (error) {
      console.error('Error adding to bag:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while adding the product to your bag.',
        status: 'error',
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
          <BreadcrumbLink as={Link} to="/" fontWeight="medium" color="blue.500">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to={`/products/${product.type}`}
            fontWeight="medium"
            color="blue.500"
          >
            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text fontWeight="bold" color="gray.700">
            {product.name}
          </Text>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Product Detail Layout */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap={10}>
        {/* Product Image */}
        <Box>
          <Image
            src="https://via.placeholder.com/400" // Placeholder image, replace with product.image if available
            alt={product.name}
            boxSize="400px"
            objectFit="contain"
          />
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

          <Button colorScheme="blue" size="lg" mb={2} width="full" onClick={handleAddToBag}>
            Add to Bag
          </Button>
          <Button colorScheme="red" size="lg" mb={2} width="full">
            Add to Favourites
          </Button>

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
              <AccordionPanel pb={4}>
                {product.description || 'No description available'}
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
              <AccordionPanel pb={4}>
                {product.materialsAndCare || 'Material info not available'}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
