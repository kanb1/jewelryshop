import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, FormControl, FormLabel, Spinner, useToast, Text } from "@chakra-ui/react";

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Unauthorized");

        const response = await fetch("http://localhost:5001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`http://localhost:5001/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile information was updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" p={5}>
        <Spinner size="lg" />
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>User Info</Heading>
      <FormControl mb={4}>
        <FormLabel>First Name</FormLabel>
        <Input
          value={user?.name || ""}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Last Name</FormLabel>
        <Input
          value={user?.surname || ""}
          onChange={(e) => setUser({ ...user, surname: e.target.value })}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input value={user?.email || ""} isReadOnly />
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={handleUpdate}
        isLoading={updating}
      >
        Update Profile
      </Button>
    </Box>
  );
};

export default UserInfo;
