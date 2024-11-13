import { Box, Heading, Link, Image, Grid, Text } from "@chakra-ui/react";

const FrontpageLinkSection = () => {
  return (
    <Box py={{base:"16", md:"20",lg:"32"}} px={{base:"10"}} textAlign="center">
      {/* Centered Collection Title */}
      <Heading as="h2" size="main_heading" variant="subhead" mb={2} color="primary_color.darkgrey" fontWeight="extrabold">
        Our Latest Collection:
      </Heading>
      <Heading as="h3" size="md" mb={8} color="primary_color.green">
        Rome
      </Heading>

      {/* Responsive Grid for Images and Links */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} // Adjust layout on larger screens
        gap={6}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        {/* Necklace */}
        <Box textAlign="center">
          <Box w="100%" h="200px" overflow="hidden" borderRadius="md" boxShadow="xl">
            <Image src="/images/linksection_img1.jpg" alt="Necklace" w="100%" h="100%" objectFit="cover" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
          </Box>
          <Link href="#" fontSize="lg" fontWeight="bold" color="primary_color.darkgrey" mt={2} display="block" _hover={{ color: "#000", textDecoration: "underline" }}>
            Necklace
          </Link>
        </Box>

        {/* Earrings */}
        <Box textAlign="center">
          <Box w="100%" h="200px" overflow="hidden" borderRadius="md" boxShadow="xl">
            <Image src="/images/linksection_img2.jpg" alt="Earrings" w="100%" h="100%" objectFit="cover" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
          </Box>
          <Link href="#" fontSize="lg" fontWeight="bold" color="primary_color.darkgrey" mt={2} display="block" _hover={{ color: "#000", textDecoration: "underline" }}>
            Earrings
          </Link>
        </Box>

        {/* Bangles */}
        <Box textAlign="center">
          <Box w="100%" h="200px" overflow="hidden" borderRadius="md" boxShadow="xl">
            <Image src="/images/linksection_img3.jpg" alt="Bangles" w="100%" h="100%" objectFit="cover" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
          </Box>
          <Link href="#" fontSize="lg" fontWeight="bold" color="primary_color.darkgrey" mt={2} display="block" _hover={{ color: "#000", textDecoration: "underline" }}>
            Bangles
          </Link>
        </Box>

        {/* Rings */}
        <Box textAlign="center">
          <Box w="100%" h="200px" overflow="hidden" borderRadius="md" boxShadow="xl">
            <Image src="/images/linksection_img4.jpg" alt="Rings" w="100%" h="100%" objectFit="cover" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
          </Box>
          <Link href="#" fontSize="lg" fontWeight="bold" color="primary_color.darkgrey" mt={2} display="block" _hover={{ color: "#000", textDecoration: "underline" }}>
            Rings
          </Link>
        </Box>
      </Grid>
    </Box>
  );
};

export default FrontpageLinkSection;
