import React, { useState } from "react";
import { Box, Button, Input, VStack, Text, FormControl, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";


interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Global form error
  const [usernameError, setUsernameError] = useState(""); // Field-specific error
  const [passwordError, setPasswordError] = useState(""); // Field-specific error
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    // Validate fields before submitting
    if (!username) {
      setUsernameError("Username is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    // Clear field-specific errors if valid
    setUsernameError("");
    setPasswordError("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save the token to localStorage
      localStorage.setItem("jwt", data.token);

      // Show success toast
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (setIsLoggedIn) setIsLoggedIn(true); // Update Navbar state immediately
      navigate("/profile"); // Redirect to profile
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Box maxWidth="400px" mx="auto" mt="100px" p="6" borderWidth="1px" borderRadius="md" boxShadow="lg">
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>

        {/* Username Field */}
        <FormControl isInvalid={!!usernameError}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormErrorMessage>{usernameError}</FormErrorMessage>
        </FormControl>

        {/* Password Field */}
        <FormControl isInvalid={!!passwordError}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{passwordError}</FormErrorMessage>
        </FormControl>

        {/* General Form Error */}
        {error && <Text color="red.500">{error}</Text>}

        {/* Submit Button */}
        <Button colorScheme="blue" width="100%" onClick={handleSubmit}>
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;