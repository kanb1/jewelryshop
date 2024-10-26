import { Box, Button, Text } from "@chakra-ui/react";

const FrontpageHeroVideo = () => {
  return (
    <Box position="relative" width="100%" height="50vh" overflow="hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(0, 0, 0, 0.4)" /* Dark overlay for readability */
        color="white"
        textAlign="center"
      >
        <Box>
          <Text fontSize="4xl" fontWeight="bold" mb={4}>
            Discover Unique Jewelry
          </Text>
          <Button colorScheme="teal" size="lg">
            Explore Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FrontpageHeroVideo;