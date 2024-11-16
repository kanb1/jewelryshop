import { Box, Stack, Link, Text, VStack, Divider } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="white" color="gray.800" mt={10} py={30} px={{ base: 4, md: 10 }}>
      {/* Divider at the top of the footer */}
      <Divider borderColor="gray.300" mb={6} />

      {/* Footer Content */}
      <VStack spacing={6} textAlign="center">
        {/* Title */}
        <Text fontSize="xl" fontWeight="bold" color="accent_color.red">
          JewelryShop
        </Text>

        {/* Navigation Links */}
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <Link href="#" fontSize="sm" _hover={{ color: "accent_color.red" }}>
            Home
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "accent_color.red" }}>
            Collections
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "accent_color.red" }}>
            About Us
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "accent_color.red" }}>
            Contact
          </Link>
        </Stack>

        {/* Additional Information */}
        <Text fontSize="xs" color="gray.500">
          &copy; 2024 JewelryShop. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
