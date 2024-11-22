import React, { useEffect, useState } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="400px" mx="auto" mt="100px" p="6" borderWidth="1px" borderRadius="md" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Profile
      </Text>
      <Text><strong>Username:</strong> {user.username}</Text>
      <Text><strong>Email:</strong> {user.email}</Text>
      <Text><strong>Name:</strong> {user.name}</Text>
      <Text><strong>Surname:</strong> {user.surname}</Text>
    </Box>
  );
};

export default Profile;
