import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Textarea,
  Button,
  VStack,
  HStack,
  Avatar,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { BACKEND_URL } from "../../config";

// **********SECURITY

interface Comment {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
  userId: string; // For ownership check
}

interface CommentsProps {
  productId: string;
}

const Comments: React.FC<CommentsProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<{ _id: string; role: string } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`${BACKEND_URL}/api/products/${productId}/comments`);
      const data = await response.json();
      setComments(data);
    };

    const fetchLoggedInUser = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        setLoggedInUser({ _id: userData.user?._id, role: userData.user?.role }); 

      }
    };

    fetchComments();
    fetchLoggedInUser();
  }, [productId]);

  const handleAddComment = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return alert("Login required");

    const sanitizedComment = newComment.trim(); // Remove extra spaces

    if (!sanitizedComment) {
      alert("Comment cannot be empty.");
      return;
    }

    const response = await fetch(`${BACKEND_URL}/api/products/${productId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: sanitizedComment }),
    });

    if (response.ok) {
      const addedComment = await response.json();
      setComments([addedComment, ...comments]);
      setNewComment("");
    } else {
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("jwt");
    if (!token) return alert("Login required");

    const response = await fetch(`${BACKEND_URL}/api/products/${productId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setComments(comments.filter((comment) => comment._id !== commentId));
    } else {
      alert("Failed to delete comment");
    }
  };

  return (
    <Box p={6} bg="gray.100" borderRadius="md" shadow="md">
    <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
      Comments from Our Customers
    </Text>
    <VStack spacing={4} align="stretch">
      {comments.map((comment) => (
        <Flex
          key={comment._id}
          p={4}
          borderRadius="md"
          shadow="sm"
          bgGradient="linear(to-r, gray.50, gray.100)"
          direction={{ base: "column", md: "row" }} // Stack on small screens, row on medium+
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          {/* Left Section: Avatar and Username */}
          <HStack spacing={4} align="center" flexShrink={0} mb={{ base: 2, md: 0 }}>
            <Avatar name={comment.username} size="lg" />
            <Text fontWeight="bold" fontSize="lg">
              {comment.username}
            </Text>
          </HStack>
  
          {/* Center Section: Comment Content */}
          <Box
            flex="1"
            textAlign={{ base: "left", md: "center" }} 
            mb={{ base: 2, md: 0 }}
          >
            <Text fontSize="md" color="gray.700">
              {comment.content}
            </Text>
          </Box>
  
          {/* Date and Delete Section */}
          <VStack align={{ base: "flex-start", md: "flex-end" }} spacing={1} flexShrink={0}>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              {new Date(comment.createdAt).toLocaleString()}
            </Text>
            {(comment.userId === loggedInUser?._id || loggedInUser?.role === "admin") && (
              <IconButton
                size="sm"
                colorScheme="red"
                icon={<DeleteIcon />}
                aria-label="Delete Comment"
                onClick={() => handleDeleteComment(comment._id)}
              />
            )}
          </VStack>
        </Flex>
      ))}
    </VStack>
    <Textarea
      placeholder="Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      mt={6}
      bg="white"
      borderRadius="md"
    />
    <Button
      onClick={handleAddComment}
      mt={4}
      colorScheme="teal"
      size="lg"
      borderRadius="md"
      shadow="md"
      _hover={{ bgGradient: "linear(to-r, teal.400, teal.600)" }}
    >
      Add Comment
    </Button>
  </Box>
);
};

export default Comments;
