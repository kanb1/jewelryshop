import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
  Text,
  Divider,
  VStack,
} from "@chakra-ui/react";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingInfo, setUpdatingInfo] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Unauthorized");

        const response = await fetch(`${BACKEND_URL}/api/users/me`, {
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

  const handleInfoUpdate = async () => {
    const nameRegex = /^[A-Za-z]+$/;

  if (!user.name || !user.surname) {
    toast({
      title: "Validation Error",
      description: "First name and last name cannot be empty.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (user.name.length < 2 || !nameRegex.test(user.name)) {
    toast({
      title: "Validation Error",
      description: "First name must be at least 2 characters and cannot contain numbers or special characters.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (user.surname.length < 2 || !nameRegex.test(user.surname)) {
    toast({
      title: "Validation Error",
      description: "Last name must be at least 2 characters and cannot contain numbers or special characters.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
  
    try {
      setUpdatingInfo(true);
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`${BACKEND_URL}/api/users/${user._id}`, {
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
      setUpdatingInfo(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setChangingPassword(true);
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`${BACKEND_URL}/api/users/${user._id}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setChangingPassword(false);
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
      <Heading size="lg" mb={4}>
        User Info
      </Heading>

      {/* User Summary */}
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        mb={5}
        bg="gray.50"
        boxShadow="sm"
      >
        <Text fontWeight="bold">Name:</Text>
        <Text>{user?.name} {user?.surname}</Text>
        <Text fontWeight="bold" mt={3}>Email:</Text>
        <Text>{user?.email}</Text>
      </Box>

      <Divider mb={5} />

      {/* Update Profile Form */}
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            value={user?.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={user?.surname || ""}
            onChange={(e) => setUser({ ...user, surname: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={user?.email || ""} isReadOnly />
        </FormControl>
        <ButtonComponent
          text="Update Profile"
          variant="primaryBlackBtn"
          onClick={handleInfoUpdate}
          isLoading={updatingInfo} // Optional: Chakra UI's loading state
          isDisabled={updatingInfo} // Disable the button while updating
        />
      </VStack>

      <Divider my={5} />

      {/* Change Password Form */}
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            isDisabled={changingPassword} // Disable input while changing password
          />
        </FormControl>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <ButtonComponent
          text="Change Password"
          variant="greenBtn"
          onClick={handlePasswordChange}
          hoverStyle={{ bg: "green.600" }}
        />
      </VStack>
    </Box>
  );
};

export default UserInfo;
