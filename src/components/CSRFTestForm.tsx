import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, useToast } from "@chakra-ui/react";

const CSRFTestForm: React.FC = () => {
  // Stores the CSRF token fetched from the backend from the GET /csrf-token route længere nede
  // The client needs to include the csrf token in the request header whenever it tries to send a protected POST req such as /protected-route
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  // Stores the user input data to be sent to the protected route.
  const [inputData, setInputData] = useState("");
  const toast = useToast();

  // Hent CSRF-token fra backend ved komponentens opstart
  useEffect(() => {
    const fetchCsrfToken = async () => {
      // Sends a GET request to the /csrf-token endpoint to fetch the CSRF token
      try {
        const response = await axios.get("http://localhost:5001/api/csrf-token", {
          withCredentials: true, //Ensures cookies (containing the CSRF token) are sent along with the request
        });
        // Stores the fetched CSRF token in the csrfToken state.
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
    // Sends a POST request to the /protected-route endpoint with the following:
    try {
      const response = await axios.post(
        "http://localhost:5001/api/protected-route",
        { data: inputData }, // User input data
        {
          // Sends the CSRF token in the header
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
