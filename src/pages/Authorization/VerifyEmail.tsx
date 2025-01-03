import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Spinner, Text, Alert, AlertIcon, Button } from "@chakra-ui/react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const [hasCalledAPI, setHasCalledAPI] = useState(false); // Prevent duplicate calls

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Failed to verify email. Please try again.");
      }
    };

    if (!hasCalledAPI) {
      setHasCalledAPI(true); // Ensure this block only runs once
      verifyEmail();
    }
  }, [token, hasCalledAPI]);

  return (
    <Box minH="50vh" maxWidth="400px" mx="auto" mt="100px" p="6" borderWidth="1px" borderRadius="md" boxShadow="lg">
      {status === "loading" && (
        <Box textAlign="center">
          <Spinner size="lg" />
          <Text mt="4">Verifying your email...</Text>
        </Box>
      )}

      {status === "success" && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          {message}
        </Alert>
      )}

      {status === "error" && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {message}
        </Alert>
      )}

      {status !== "loading" && (
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      )}
    </Box>
  );
};

export default VerifyEmail;
