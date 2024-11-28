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

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:5001/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:5001/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(products.filter((product) => product._id !== id));
    alert("Product deleted successfully");
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:5001/api/admin/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const addedProduct = await response.json();
    setProducts([...products, addedProduct.product]);
    setNewProduct({ name: "", type: "", productCollection: "", price: "", sizes: "" });
    alert("Product added successfully");
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>
        Manage Products
      </Heading>

      <VStack spacing={4} mb={6}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Input
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            placeholder="Product Type"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Collection</FormLabel>
          <Input
            value={newProduct.productCollection}
            onChange={(e) => setNewProduct({ ...newProduct, productCollection: e.target.value })}
            placeholder="Product Collection"
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
  );
};

export default AdminProducts;
