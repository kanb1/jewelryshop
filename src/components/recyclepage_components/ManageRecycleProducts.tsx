import React, { useState, useEffect } from 'react';
import { Box, VStack, Button, FormControl, FormLabel, Input, Select, Text, SimpleGrid, useToast, Flex} from '@chakra-ui/react';
import { BACKEND_URL } from '../../config';
import RecycleProductCard from '../shared/RecycledProductcard'; 
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../shared/ButtonComponent';


const ManageRecycleProducts: React.FC = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    size: '',
    visibility: 'public',
    type: '',
    images: null as FileList | null,
  });
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const toast = useToast();

  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate("/recycle"); 
  };

  // validate the products
  const validateProduct = () => {
    if (!newProduct.name || newProduct.name.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Product name must be at least 3 characters long.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!newProduct.price || isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be a positive number.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!["Onesize", "6", "7", "8", "9", "10"].includes(newProduct.size)) {
      toast({
        title: "Validation Error",
        description: "Please select a valid size: Onesize or sizes from 6-10.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!["ring", "necklace", "bracelet", "earring"].includes(newProduct.type)) {
      toast({
        title: "Validation Error",
        description: "Please select a valid type of jewelry.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!newProduct.images || newProduct.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (newProduct.images[0].size > 2 * 1024 * 1024) { // 2MB size limit
      toast({
        title: "Validation Error",
        description: "Image size must be less than 2MB.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(newProduct.images[0].type)) {
      toast({
        title: "Validation Error",
        description: "Only JPEG, PNG, and JPG images are allowed.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  // Fetch user's products for listing
  const fetchUserProducts = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserProducts(data);
    } catch (error) {
      console.error('Error fetching user products:', error);
      toast({
        title: 'Error',
        description: 'Unable to fetch your products.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, []); // Fetch products on initial render

  const handleAddProduct = async () => {

    if (!validateProduct()) {
      return; // Stop if validation fails
    } 

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('size', newProduct.size);
    formData.append('visibility', newProduct.visibility);
    formData.append('type', newProduct.type);

    if (newProduct.images) {
      formData.append('image', newProduct.images[0]); // Only one image allowed
    }

    
    // Debugging: Log FormData
  console.log("FormData fields and file:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]); // Logger hvert felt i FormData
  }

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BACKEND_URL}/api/recycle`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status); // Logger HTTP-statuskoden
      console.log("Response data:", await response.json()); // Logger svaret fra serveren

      if (!response.ok) {
        console.error('Failed to add product');
        toast({
          title: 'Error',
          description: 'Failed to add the product.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      alert('Product added successfully!');
      setNewProduct({ name: '', price: '', size: '', visibility: 'public', type: '', images: null });
      fetchUserProducts(); // Refetch products

    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding the product.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVisibilityToggle = async (productId: string, currentVisibility: string) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle/${productId}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (response.ok) {
        setUserProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, visibility: newVisibility } : product
          )
        );
      } else {
        console.error('Failed to toggle visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };


  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (response.ok) {
        setUserProducts((prev) => prev.filter((product) => product._id !== productId));
        toast({
          title: 'Success',
          description: 'Product deleted successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the product.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the product.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Box p={5} maxW="6xl" mx="auto" bg="white" borderRadius="md" boxShadow="lg">
      <VStack spacing={6} mb={6}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">Add a New Recycled Product</Text>

        <Flex p={4} justify="flex-start" align="center">
        <ButtonComponent onClick={handleBack} variant='primaryBlackBtn' text='View all Recycled Products'/>
      </Flex>

        {/* Form Inputs */}
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Enter product name"
            isRequired
          />
        </FormControl>

        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Enter price"
            isRequired
            type="number"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Size</FormLabel>
          <Input
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
            placeholder="Enter size"
            isRequired
          />
        </FormControl>

        <FormControl>
          <FormLabel>Visibility</FormLabel>
          <Select
            value={newProduct.visibility}
            onChange={(e) => setNewProduct({ ...newProduct, visibility: e.target.value })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Type of Jewelry</FormLabel>
          <Select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            placeholder="Select type"
            isRequired
          >
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Upload Image</FormLabel>
          <Input
            type="file"
            name="image"
            multiple={false} // Allow only one image upload
            onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
          />
        </FormControl>

        <Button onClick={handleAddProduct} colorScheme="teal" size="lg" width="full">
          Add Product
        </Button>
      </VStack>

      {/* Display User's Products */}
      <Text fontSize="2xl" mb={4}>Your Products</Text>
      {userProducts.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {userProducts.map((product) => (
  <RecycleProductCard
    key={product._id}
    product={product}
    updateCartCount={() => {}}
    handleVisibilityToggle={handleVisibilityToggle}  // Pass the function as a prop
    handleDeleteProduct={handleDeleteProduct}  // Pass delete function as a prop

  />
))}

        </SimpleGrid>
      ) : (
        <Text>No products available.</Text>
      )}
    </Box>
  );
};

export default ManageRecycleProducts;
