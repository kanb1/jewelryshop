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
  Stack,
} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    productCollection: "",
    price: "",
    sizes: "",
    images: null as FileList | null,
  });
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch products from backend
  const fetchProducts = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch(
        "http://localhost:5001/api/products?limit=1000",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch products");
        return;
      }

      const data = await response.json();
      // Sort products by date in descending order (assuming a `createdAt` field exists)
      const sortedProducts = data.products.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const handleAddProduct = async () => {
    const token = localStorage.getItem("jwt");
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("type", newProduct.type);
    formData.append("productCollection", newProduct.productCollection);
    formData.append("price", newProduct.price);
    formData.append("sizes", newProduct.sizes);
    if (newProduct.images) {
      Array.from(newProduct.images).forEach((file) =>
        formData.append("images", file)
      );
    }

    try {
      const response = await fetch("http://localhost:5001/api/admin/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to add product");
        return;
      }

      const addedProduct = await response.json();
      setProducts((prev) => [addedProduct.product, ...prev]);
      alert("Product added successfully!");
      setNewProduct({
        name: "",
        type: "",
        productCollection: "",
        price: "",
        sizes: "",
        images: null,
      });
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
      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Update a product
  const handleUpdateProduct = async () => {
    const token = localStorage.getItem("jwt");
  
    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("type", editingProduct.type);
    formData.append("productCollection", editingProduct.productCollection);
    formData.append("price", editingProduct.price);
    formData.append("sizes", editingProduct.sizes);
  
    if (editingProduct.images && editingProduct.images instanceof FileList) {
      Array.from(editingProduct.images as FileList).forEach((file: File) => {
        formData.append("images", file);
      });
    }
  
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
  
      if (!response.ok) {
        console.error("Failed to update product");
        return;
      }
  
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingProduct._id ? updatedProduct.product : product
        )
      );
      alert("Product updated successfully!");
      setEditingProduct(null);
      onClose();
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
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Input
            value={newProduct.type}
            onChange={(e) =>
              setNewProduct({ ...newProduct, type: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Input
            value={newProduct.productCollection}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                productCollection: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Sizes</FormLabel>
          <Input
            value={newProduct.sizes}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sizes: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Upload Images</FormLabel>
          <Input
            type="file"
            multiple
            onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
          />
        </FormControl>
        <ButtonComponent
          text="Add Product"
          onClick={handleAddProduct}
          variant="greenBtn"
        />
      </VStack>

      <Box
        maxH="400px" // Set the maximum height for the scrollable area
        overflowY="auto" // Enable vertical scrolling
        border="1px solid #ccc" // Optional: Add a border for better UI
        borderRadius="md" // Optional: Round the corners
      >
      {/* Product Table */}
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
                <Stack direction="row" spacing={4}>
                  <ButtonComponent
                    text="Edit"
                    onClick={() => {
                      setEditingProduct(product);
                      onOpen();
                    }}
                    variant="greyBtn"
                  />
                  <ButtonComponent
                    text="Delete"
                    onClick={() => handleDelete(product._id)}
                    variant="redBtn"
                  />
                </Stack>
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
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Input
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        type: e.target.value,
                      })
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
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Sizes</FormLabel>
                  <Input
                    value={editingProduct.sizes}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sizes: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Upload Images</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        images: e.target.files,
                      })
                    }
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={4}>
              <ButtonComponent
                text="Save"
                onClick={handleUpdateProduct}
                variant="greenBtn"
              />
              <ButtonComponent text="Cancel" onClick={onClose} variant="greyBtn" />
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProducts;
