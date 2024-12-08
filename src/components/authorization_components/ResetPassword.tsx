import React, { useState } from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // General form error
  const [newPasswordError, setNewPasswordError] = useState(""); // Field-specific error
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Field-specific error
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token and user ID from query params
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const handleSubmit = async () => {
    // Validation
    if (!newPassword) {
      setNewPasswordError("New password is required.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    setNewPasswordError("");
    setConfirmPasswordError("");

    try {
      // Make API call to reset password
      const response = await fetch(`${BACKEND_URL}/api/forgotpassword/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id: userId, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      // Show success toast
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
          Reset Password
        </Text>

        {/* New Password Field */}
        <FormControl isInvalid={!!newPasswordError}>
          <Input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormErrorMessage>{newPasswordError}</FormErrorMessage>
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl isInvalid={!!confirmPasswordError}>
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
        </FormControl>

        {/* General Form Error */}
        {error && <Text color="red.500">{error}</Text>}

        {/* Submit Button */}
        {/* Submit Button */}
        <ButtonComponent
          text="Reset Password"
          onClick={handleSubmit}
          variant="greenBtn"
        />
      </VStack>
    </Box>
  );
};

export default ResetPassword;
