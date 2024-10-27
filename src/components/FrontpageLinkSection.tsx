import { Box, Flex, Heading, Link, Image, Grid } from "@chakra-ui/react";

const FrontpageLinkSection = () => {
  return (
    <Flex p={10} alignItems="center" justifyContent="center">
      {/* Left Side with Collection Title and Links */}
      <Box width="30%" textAlign="left" pr={10}>
        <Heading as="h2" size="2xl" mb={6} color="#5a5a5a" fontWeight="extrabold">
          Discover Our Collection
        </Heading>
        <Grid gap={4}>
          <Link href="#" fontSize="2xl" fontWeight="bold" color="#333" _hover={{ color: "#000", textDecoration: "underline" }}>
            Necklace
          </Link>
          <Link href="#" fontSize="2xl" fontWeight="bold" color="#333" _hover={{ color: "#000", textDecoration: "underline" }}>
            Earrings
          </Link>
          <Link href="#" fontSize="2xl" fontWeight="bold" color="#333" _hover={{ color: "#000", textDecoration: "underline" }}>
            Bangles
          </Link>
          <Link href="#" fontSize="2xl" fontWeight="bold" color="#333" _hover={{ color: "#000", textDecoration: "underline" }}>
            Rings
          </Link>
        </Grid>
      </Box>

      {/* Right Side with Images */}
      {/* <Grid templateColumns="repeat(2, 1fr)" gap={6} width="60%" position="relative">
        <Box w="400px" h="400px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img1.jpg" alt="Image 1" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="250px" h="250px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="end">
          <Image src="/images/linksection_img2.jpg" alt="Image 2" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="280px" h="280px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="top" justifySelf="end">
          <Image src="/images/linksection_img3.jpg" alt="Image 3" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="370px" h="370px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img4.jpg" alt="Image 4" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
      </Grid> */}
      {/* <Grid templateColumns="repeat(2, 1fr)" gap={16} width="60%" position="relative">
        <Box w="250px" h="250px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="end" justifySelf="end" >
          <Image src="/images/linksection_img1.jpg" alt="Image 1" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="400px" h="400px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img2.jpg" alt="Image 2" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="370px" h="370px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="top" justifySelf="end">
          <Image src="/images/linksection_img3.jpg" alt="Image 3" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="300px" h="300px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img4.jpg" alt="Image 4" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
      </Grid>
    </Flex> */}
      {/* <Grid templateColumns="repeat(2, 1fr)" gap={10} width="60%" position="relative">
        <Box w="380px" h="350px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="end" justifySelf="end" >
          <Image src="/images/linksection_img1.jpg" alt="Image 1" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="380px" h="350px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img2.jpg" alt="Image 2" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="380px" h="350px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl" alignSelf="top" justifySelf="end">
          <Image src="/images/linksection_img3.jpg" alt="Image 3" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
        <Box w="380px" h="350px" pos="relative" overflow="hidden" borderRadius="md" boxShadow="xl">
          <Image src="/images/linksection_img4.jpg" alt="Image 4" transition="transform 0.3s" _hover={{ transform: "scale(1.05)" }} />
        </Box>
      </Grid> */}
    </Flex>
  );
};

export default FrontpageLinkSection;
