import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonComponent from "../../components/shared/ButtonComponent";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // General form error
  const [usernameError, setUsernameError] = useState(""); // Field-specific error
  const [passwordError, setPasswordError] = useState(""); // Field-specific error
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Access the redirected message
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      // Show a toast message if redirected with a state message
      toast({
        title: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [message, toast]);

  const handleSubmit = async () => {
    if (!username) {
      setUsernameError("Username is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

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

      // Manually decode JWT to extract the role
      const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
      const userRole = tokenPayload.role;

      // Show success toast
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (setIsLoggedIn) setIsLoggedIn(true);

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Box minH="50vh">
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p="6"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
    >
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>

        {/* Display Redirect Message */}
        {message && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}

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
        <ButtonComponent 
            variant="primaryBlackBtn" text={"Login"} onClick={handleSubmit}  styleOverride={{ width: "100%"}} 

        />

        {/* Forgot Password Link */}
        <Text fontSize="sm" color="blue.500" mt={2}>
          <Link onClick={() => navigate("/forgot-password")}>Forgot Password?</Link>
        </Text>
      </VStack>
    </Box>
    </Box>
  );
};

export default Login;
