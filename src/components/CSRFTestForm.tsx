import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, useToast } from "@chakra-ui/react";

const CSRFTestForm: React.FC = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [inputData, setInputData] = useState("");
  const toast = useToast();

  // Hent CSRF-token fra backend ved komponentens opstart
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/csrf-token", {
          withCredentials: true, // Cookies bruges her til CSRF-token
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        toast({
          title: "Error",
          description: "Failed to fetch CSRF token.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCsrfToken();
  }, [toast]);

  // Send en POST-anmodning til en beskyttet route
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/protected-route",
        { data: inputData }, // Data fra input
        {
          headers: {
            "X-CSRF-Token": csrfToken || "", 
          },
          withCredentials: true,
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Request failed:", error);
      toast({
        title: "Error",
        description: "Invalid or missing CSRF token.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box   minH="100vh" >
      <Input
        placeholder="Enter some data"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        mb={4}
      />
      <Button colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default CSRFTestForm;
