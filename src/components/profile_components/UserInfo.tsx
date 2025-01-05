import React, { useState, useEffect } from "react";
import {
  Box,
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

  // ************SECURITY



const UserInfo: React.FC = () => {
  // user's info from the backend
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Tracks whether the user’s profile or password is currently being updated.
  const [updatingInfo, setUpdatingInfo] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  //  Stores the current and new passwords entered by the user during the password change process.
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const toast = useToast();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);



// ************************************** GET USER DATA
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






  // ************************************** HANDLE PROFILE PICTURE UPLOAD

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Handle upload process
  const handleUpload = async () => {
    if (!profilePicture) {
      toast({
        title: "No file selected",
        description: "Please select a profile picture to upload.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
  
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Unauthorized");
  
      const response = await fetch(`${BACKEND_URL}/api/users/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token for authentication
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "Profile picture uploaded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        // Update user data to reflect the new profile picture
        setUser({ ...user, profilePicture: data.profilePicture });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  



  // ************************************** HANDLE INFO UPDATE

  const handleInfoUpdate = async () => {
    const nameRegex = /^[A-Za-z]+$/;
  
    // Frontend validering for navn og efternavn
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
  
    if (!nameRegex.test(user.name)) {
      toast({
        title: "Validation Error",
        description: "First name can only contain letters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (!nameRegex.test(user.surname)) {
      toast({
        title: "Validation Error",
        description: "Last name can only contain letters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (user.name.trim().length < 2 || user.surname.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "First and last names must be at least 2 characters long.",
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
  
// ***********************************HANDLE PASSWORD CHANGE
const handlePasswordChange = async () => {
  // Regex for adgangskodestyrke i henhold til OWASP
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  // Validering af nuværende adgangskode
  if (!currentPassword) {
    toast({
      title: "Validation Error",
      description: "Current password is required.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  // Validering af ny adgangskode
  if (!newPassword) {
    toast({
      title: "Validation Error",
      description: "New password is required.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (!passwordRegex.test(newPassword)) {
    toast({
      title: "Validation Error",
      description:
        "New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

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

      // Ryd adgangskodefelter
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
    <Box p={5} mt={20}>   

  {/* Profile and User Details */}
  <Box display="flex" justifyContent="center" alignItems="center" mb={20} flexWrap="wrap">
    {/* Profile Picture Section */}
    <Box textAlign="center" mb={4} flex="1" maxW="200px">
      {user?.profilePicture && (
        <Box
          as="img"
          src={`${BACKEND_URL}/${user.profilePicture}`}
          alt="Profile"
          borderRadius="full"
          boxSize="150px"
          boxShadow="lg"
          border="4px solid"
          borderColor="gray.200"
          mx="auto"
          mb={4}
        />
      )}
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
          id="fileInput"
        />
        <FormLabel
          htmlFor="fileInput"
          cursor="pointer"
          bg="gray.100"
          p={2}
          borderRadius="md"
          _hover={{ bg: "gray.200" }}
          textAlign="center"
          width="auto"
          mx="auto"
          mb={2}
        >
          Choose New Photo
        </FormLabel>
        <ButtonComponent
          text="Change Now"
          variant="primaryBlackBtn"
          onClick={handleUpload}
        />
      </FormControl>
    </Box>

    {/* User Details */}
    <Box
      bg="white"
      borderRadius="2xl"
      p={5}
      boxShadow="sm"
      flex="1"
      maxW="500px"
      ml={{ base: 0, md: 6 }}
      textAlign="left"
    >
      <Text fontWeight="bold" fontSize="lg" mb={2} color="grey">
        Your Name:
      </Text>
      <Text mb={4} fontWeight="thin">
        {user?.name} {user?.surname}
      </Text>
      <Text fontWeight="bold" fontSize="lg" mb={2} color="grey">
        Your Email:
      </Text>
      <Text>{user?.email}</Text>
    </Box>
  </Box>

  <Divider mb={6} />


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
