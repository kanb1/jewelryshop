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
  Heading,
} from "@chakra-ui/react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    // Validate email
    if (!email) {
      setEmailError("Email is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(""); // Clear any previous errors
    setLoading(true);

    try {
        const response = await fetch("http://localhost:5001/api/forgotpassword/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      // Show success toast
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the reset link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Optionally, clear the email field
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
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
        <Heading size="lg" textAlign="center">
          Forgot Password
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Enter your email to receive a password reset link.
        </Text>

        {/* Email Input Field */}
        <FormControl isInvalid={!!emailError}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <FormErrorMessage>{emailError}</FormErrorMessage>
        </FormControl>

        {/* Submit Button */}
        <Button
          colorScheme="blue"
          width="100%"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Send Reset Link
        </Button>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
