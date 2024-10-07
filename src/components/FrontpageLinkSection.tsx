import { Box, Flex, Heading, Button, Link, Image } from "@chakra-ui/react";

const FrontpageLinkSection = () => {
  return (
    <Flex alignItems="center" justifyContent="space-between" p={20}>
      {/* Left Side with Links */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Collection Name
        </Heading>
        <Flex direction="column" fontSize="xl" fontWeight="bold">
          <Link href="#">Necklace</Link>
          <Link href="#">Earrings</Link>
          <Link href="#">Bangles</Link>
          <Link href="#">Rings</Link>
        </Flex>
        <Button mt={8} colorScheme="blue" size="md">
          Go to Collection
        </Button>
      </Box>

      {/* Right Side with Asymmetric Images */}
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        <Box w="250px" h="200px" bg="gray.300" m={2}>
        <Image src="/images/linksection_img7.jpg" alt="Image 3" />
        </Box>
        <Box w="400px" h="400px" bg="gray.300" m={2}>
        <Image src="/images/linksection_img6.jpg" alt="Image 2" />
        </Box>
        <Box w="200px" h="200px" bg="gray.300" m={2}>
        <Image src="/images/linksection_img5.jpg" alt="Image 1" />
        </Box>
      </Box>
    </Flex>
  );
};

export default FrontpageLinkSection;
