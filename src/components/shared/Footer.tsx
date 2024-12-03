import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Stack,
  Text,
  VStack,
  Divider,
  Image,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box bg="white" color="gray.800" mt={10} py={30} px={{ base: 4, md: 10 }}>
      {/* Divider at the top of the footer */}
      <Divider borderColor="gray.300" mb={6} />

      {/* Footer Content */}
      <VStack spacing={6} textAlign="center">
        {/* Navigation Links */}
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
        </Stack>

        {/* Social Media Links */}
        <HStack spacing={4} justify="center">
          <IconButton
            as="a"
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            icon={<FaFacebook />}
            variant="ghost"
            colorScheme="blue"
            fontSize="1.5rem" // Adjust icon size here
          />
          <IconButton
            as="a"
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            icon={<FaTwitter />}
            variant="ghost"
            colorScheme="twitter"
            fontSize="1.5rem" // Adjust icon size here
          />
          <IconButton
            as="a"
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            icon={<FaInstagram />}
            variant="ghost"
            colorScheme="pink"
            fontSize="1.5rem" // Adjust icon size here
          />
        </HStack>

        {/* Additional Information */}
        <Text fontSize="xs" color="gray.500">
          &copy; 2024 JewelryShop. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
