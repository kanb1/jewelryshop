import React, { useState, useEffect } from "react";
import {
  Box,
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
import { useAuthContext } from "../../context/AuthContext";
import ButtonComponent from "../../components/shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsLoggedIn, setUserRole } = useAuthContext();

  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      toast({
        title: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [message, toast]);

  // Validates the input fields
  const validateInput = (): boolean => {
    let isValid = true;

    if (!username) {
      setUsernameError("Username is required.");
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameError("Username can only contain letters and numbers.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Invalid username or password."); // General error
      }

      localStorage.setItem("jwt", data.token);

      const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
      const userRole = tokenPayload.role;

      setIsLoggedIn(true);
      setUserRole(userRole);

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(userRole === "admin" ? "/admin" : "/profile");
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

          {message && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {message}
            </Alert>
          )}

          <FormControl isInvalid={!!usernameError}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormErrorMessage>{usernameError}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!passwordError}>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          </FormControl>

          {error && <Text color="red.500">{error}</Text>}

          <ButtonComponent
            variant="primaryBlackBtn"
            text={"Login"}
            onClick={handleSubmit}
            styleOverride={{ width: "100%" }}
          />

          <Text fontSize="sm" color="blue.500" mt={2}>
            <Link onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
