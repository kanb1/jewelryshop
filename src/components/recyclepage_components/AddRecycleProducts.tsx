import React, { useState } from "react";
import { Button, Input, FormControl, FormLabel, VStack, Select, Box } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config"; // Make sure to use the correct backend URL

const AddRecycleProduct: React.FC = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    size: "",
    visibility: "public",
    type: "", // Add type of jewelry (Rings, Bangles, etc.)
    images: null as FileList | null, // Images for product
  });

  const handleAddProduct = async () => {
    const token = localStorage.getItem("jwt");
  
    // Create a FormData object to send the form data including images
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("size", newProduct.size);
    formData.append("visibility", newProduct.visibility);
    formData.append("type", newProduct.type);

    // Append the file(s)
    if (newProduct.images) {
    Array.from(newProduct.images).forEach((file) => {
        formData.append("image", file); // Use "image" as the key
    });
    }
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/recycle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        console.error("Failed to add product");
        return;
      }
  
      alert("Product added successfully!");
      setNewProduct({ name: "", price: "", size: "", visibility: "public", type: "", images: null });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };
  
  

  return (
    <Box p={5}>
      <VStack spacing={4}>
        {/* Product Name */}
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </FormControl>

        {/* Product Price */}
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
        </FormControl>

        {/* Product Size */}
        <FormControl>
          <FormLabel>Size</FormLabel>
          <Input
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
          />
        </FormControl>

        {/* Visibility */}
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

        {/* Type of Jewelry */}
        <FormControl>
          <FormLabel>Type of Jewelry</FormLabel>
          <Select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earring">Earring</option>
          </Select>
        </FormControl>

        {/* Upload Images */}
        <FormControl>
            <FormLabel>Upload Images</FormLabel>
            <Input
                type="file"
                name="image" // Change the field name to "image"
                multiple
                onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
            />
        </FormControl>
  

        

        {/* Submit Button */}
        <Button onClick={handleAddProduct}>Add Product</Button>
      </VStack>
    </Box>
  );
};

export default AddRecycleProduct;
