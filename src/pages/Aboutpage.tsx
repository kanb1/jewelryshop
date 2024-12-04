import { Box, Heading, Text, VStack, Image } from "@chakra-ui/react";

const About = () => {
  return (
    <Box  py={10} px={{ base: 4, md: 10 }}>
      {/* Hero Section */}
      <VStack spacing={6} textAlign="center" mb={10}>
        <Heading as="h1" size="xl" color="gray.800">
          About Kanza Jewelry
        </Heading>
        <Text fontSize="lg" color="gray.600" maxWidth="800px">
          At Kanza Jewelry, we believe in crafting timeless and elegant pieces that celebrate individuality and style. Each piece is designed with passion, precision, and a deep appreciation for beauty.
        </Text>
        <Image
          src="/images/aboutpage/team.jpg" 
          alt="About Us"
          borderRadius="md"
          maxWidth="600px"
        />
      </VStack>

      {/* Mission Section */}
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        shadow="md"
        mb={10}
        maxWidth="800px" 
        mx="auto" 
      >
        <Heading as="h2" size="md" color="gray.800" mb={4} textAlign="center">
          Our Mission
        </Heading>
        <Text fontSize="md" color="gray.600">
          Our mission is to create exquisite jewelry that inspires confidence and brings joy to our customers. We focus on sustainability, quality craftsmanship, and timeless designs to make every moment special.
        </Text>
      </Box>

      {/* Story Section */}
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        shadow="md"
        maxWidth="800px" 
        mx="auto" 
      >
        <Heading as="h2" size="md" color="gray.800" mb={4} textAlign="center">
          Our Story
        </Heading>
        <Text fontSize="md" color="gray.600">
          Founded in 2023, Kanza Jewelry started as a small passion project and has since grown into a trusted name in the jewelry industry. With a commitment to excellence, we continue to design and deliver pieces that our customers love.
        </Text>
      </Box>
    </Box>
  );
};

export default About;
