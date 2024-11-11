import { Box, Heading, Flex, Text, Image } from "@chakra-ui/react";
const FrontpageEcofriendly = () => {
    return(

        <Box as="section" py={{base:"16", md:"20"}} px={{base:"10"}} bg="gray.50">
      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
        gap={10}
      >
        {/* Left Side: Text */}
        <Box flex="1">
          <Text fontSize="sm" fontWeight="bold" color="primary_color.darkgrey" mb={2}>
            WHAT WE DO
          </Text>
          <Heading  fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" mb={4}>
            WE DEVELOP, WE CREATE
          </Heading>
          <Text fontSize="lg" fontWeight="bold" mb={4} color="primary_color.darkgrey">
            Ecofriendly
          </Text>
          <Text fontSize="md"  mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text fontSize="md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </Text>
        </Box>

        {/* Right Side: Image */}
        <Box flex="1" w="100%" h={{ base: "300px", md: "400px" }} bg="gray.300" borderRadius="md" overflow="hidden">
          <Image
            src="/images/ecofriendly_img1.jpg" // Replace with your image path
            alt="Ecofriendly products"
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </Box>
      </Flex>
    </Box>



    );
};

export default FrontpageEcofriendly;