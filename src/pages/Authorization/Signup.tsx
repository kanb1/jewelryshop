import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const nameRegex = /^[A-Za-z]+$/;

    if (!username || !email || !password || !confirmPassword || !name || !surname) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!nameRegex.test(name)) {
      setError("First name cannot contain numbers or special characters.");
      return;
    }
  
    if (!nameRegex.test(surname)) {
      setError("Last name cannot contain numbers or special characters.");
      return;
    }

    if (name.length < 2) {
      setError("First name must be at least 2 characters.");
      return;
    }
  
    if (surname.length < 2) {
      setError("Last name must be at least 2 characters.");
      return;
    }
  
    console.log({
      username,
      email,
      name,
      surname,
      password,
    }); // Log data being sent to the backend
  
    setError(""); // Clear error if validation passes
    setLoading(true);
  
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/users`, {
        username,
        email,
        name,
        surname,
        password,
      });
  
      console.log("Backend response:", response.data); // Log the backend response
  
      toast({
        title: "Signup successful",
        description: "Your account has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setLoading(false);
      navigate("/login");
    } catch (err: any) {
      console.error("Error during signup:", err); // Log any errors
      setLoading(false);
      setError(err.response?.data?.error || "Failed to create account."); // Updated error message
    }
  };
  

  return (
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
          Sign Up
        </Text>

        {/* Username Field */}
        <FormControl isInvalid={!!error && !username}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {!username && error && <FormErrorMessage>Username is required.</FormErrorMessage>}
        </FormControl>

        {/* Email Field */}
        <FormControl isInvalid={!!error && !email}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!email && error && <FormErrorMessage>Email is required.</FormErrorMessage>}
        </FormControl>

        {/* Name Field */}
        <FormControl isInvalid={!!error && !name}>
          <Input
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {!name && error && <FormErrorMessage>First name is required.</FormErrorMessage>}
        </FormControl>

        {/* Surname Field */}
        <FormControl isInvalid={!!error && !surname}>
          <Input
            placeholder="Last Name"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          {!surname && error && <FormErrorMessage>Last name is required.</FormErrorMessage>}
        </FormControl>

        {/* Password Field */}
        <FormControl isInvalid={!!error && !password}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!password && error && <FormErrorMessage>Password is required.</FormErrorMessage>}
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl isInvalid={!!error && !confirmPassword}>
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {!confirmPassword && error && (
            <FormErrorMessage>Confirm password is required.</FormErrorMessage>
          )}
        </FormControl>

        {/* General Error Message */}
        {error && <Text color="red.500">{error}</Text>}

        {/* Submit Button */}
        <ButtonComponent
          text="Create account"
          onClick={handleSubmit}
          isLoading={loading} // Pass the loading state
          variant="primaryBlackBtn" // Use your desired variant
          styleOverride={{ width: "100%" }} // Optional custom style for full width
        />

        {/* Redirect to Login */}
        <Button variant="link" as={Link} to="/login">
          Already have an account? Login here!
        </Button>
      </VStack>
    </Box>
  );
};

export default Signup;
