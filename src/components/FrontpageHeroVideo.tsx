import { Box, Button, Text, AspectRatio } from "@chakra-ui/react";

const FrontpageHeroVideo = () => {
  return (
    <Box className="video-hero-section" position="relative" width="100%" height="50vh" overflow="hidden" p={0} m={0}>
        <AspectRatio ratio={21 / 9} maxW="100%">
        <video
          src="videos/video_hero_earringpose.mp4"  // Ensure this path is correct
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </AspectRatio>

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
          <Text fontSize={{base: "xl", lg:"4xl"}}fontWeight="bold" mb={4}>
          Crafted with Passion, Worn with Pride</Text>
          <Button colorScheme="teal" size="lg">
            Explore Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FrontpageHeroVideo;