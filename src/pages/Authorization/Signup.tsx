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
// library for making http requests to the backend
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

// React.FC --> TS type for functional componnents
const Signup: React.FC = () => {
  // usestate --> hook that manages component state 

  // storing the values from the inputfields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // any validation or API-related error messages
  const [error, setError] = useState("");
  // whether or not the submission is in progress or what
  const [loading, setLoading] = useState(false);
  // chakra hook for showing toast notifications
  const toast = useToast();
  const navigate = useNavigate();


  // ************************* VALIDATION AND HANDLESUBMIT (FORM SUBMISSION)
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,64}$/;
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
  
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8-64 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
  
    if (!nameRegex.test(name) || !nameRegex.test(surname)) {
      setError("Name and surname can only contain letters.");
      return;
    }
  
    if (name.length < 2 || surname.length < 2) {
      setError("Name and surname must be at least 2 characters long.");
      return;
    }
  
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/users`, {
        username,
        email,
        name,
        surname,
        password,
      });
  
      toast({
        title: "You are almost there!",
        description: "A verification email has been sent to your email address.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
  
      setLoading(false);
      navigate("/login");
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setLoading(false);
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
        {/* FormControl wrapping inputfields for vlaidation styling */}
        {/* !! Converts a value to a boolean, used to check if a vlaue is truthy or falsy */}
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
          isLoading={loading}
          variant="primaryBlackBtn" 
          styleOverride={{ width: "100%" }} 
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
