import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    productCollection: "",
    price: "",
    sizes: "",
  });
  const [editingProduct, setEditingProduct] = useState<any | null>(null); // Track product being edited
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  // Fetch products from backend
  // Lav en funktion til at hente produkter
  const fetchProducts = async () => {
    const token = localStorage.getItem("jwt"); // Assuming JWT is required
    try {
      const response = await fetch("http://localhost:5001/api/products?limit=1000", {
        headers: { Authorization: `Bearer ${token}` }, // Add token if needed
      });
  
      if (!response.ok) {
        console.error("Failed to fetch products");
        return;
      }
  
      const data = await response.json();

      
      console.log("Fetched products:", data); // Debugging
      setProducts(data.products); // Adjust this if your response structure differs
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);


  // Add a new product
  const handleAddProduct = async () => {
    const token = localStorage.getItem("jwt");
    const formattedProduct = {
      ...newProduct,
      sizes: newProduct.sizes.split(",").map((size) => size.trim()), // Format sizes
    };
  
    try {
      const response = await fetch("http://localhost:5001/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedProduct),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add product");
      }
  
      const addedProduct = await response.json();
  
      // Add the new product to the top of the list
      setProducts((prevProducts) => [addedProduct.product, ...prevProducts]);
  
      alert("Product added successfully");
  
      // Reset the form
      setNewProduct({ name: "", type: "", productCollection: "", price: "", sizes: "" });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };
  
  

  // Delete a product
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("jwt");
    try {
      await fetch(`http://localhost:5001/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Update a product
  const handleUpdateProduct = async () => {
    const token = localStorage.getItem("jwt");

    const updatedProduct = {
      ...editingProduct,
      sizes: Array.isArray(editingProduct.sizes)
        ? editingProduct.sizes // Keep as-is if already an array
        : editingProduct.sizes.split(",").map((size: string) => size.trim()), // Format sizes
    };

    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingProduct._id ? data.product : product
        )
      );

      setEditingProduct(null); // Close the edit modal
      onClose();
      alert("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <Box p={5}>
    <Heading size="lg" mb={4}>
      Manage Products
    </Heading>

    {/* Add Product Form */}
    <VStack spacing={4} mb={6}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Fx Diamond Rose Ring"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Type</FormLabel>
        <Input
          value={newProduct.type}
          onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
          placeholder="Rings, Necklaces, Bracelets, Earrings"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Collection</FormLabel>
        <Input
          value={newProduct.productCollection}
          onChange={(e) =>
            setNewProduct({ ...newProduct, productCollection: e.target.value })
          }
          placeholder="Love, Classic, Exclusive, Timeless, Luxury"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Price</FormLabel>
        <Input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Price"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Sizes</FormLabel>
        <Input
          value={newProduct.sizes}
          onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
          placeholder="Sizes (comma-separated)"
        />
      </FormControl>
      <Button colorScheme="green" onClick={handleAddProduct}>
        Add Product
      </Button>
    </VStack>

    {/* Scrollable Table Container */}
    <Box
      maxH="400px" // Set max height to enable scrolling
      overflowY="auto" // Enable vertical scrolling
      border="1px solid #ccc" // Optional: Add a border for aesthetics
      borderRadius="md" // Optional: Round the corners of the container
    >
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product._id}>
              <Td>{product.name}</Td>
              <Td>{product.type}</Td>
              <Td>${product.price}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setEditingProduct(product);
                    onOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>

    {/* Edit Product Modal */}
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {editingProduct && (
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input
                  value={editingProduct.type}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, type: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Collection</FormLabel>
                <Input
                  value={editingProduct.productCollection}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productCollection: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sizes</FormLabel>
                <Input
                  value={
                    Array.isArray(editingProduct.sizes)
                      ? editingProduct.sizes.join(", ")
                      : editingProduct.sizes
                  }
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, sizes: e.target.value })
                  }
                />
              </FormControl>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
  );
};

export default AdminProducts;
