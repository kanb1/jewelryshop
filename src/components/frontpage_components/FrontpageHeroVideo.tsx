import { Box, Button, AspectRatio, Heading } from "@chakra-ui/react";

const FrontpageHeroVideo = () => {
  return (
    <Box
      className="video-hero-section"
      position="relative"
      width="100%"
      height={{base:"30vh", md:"50vh"}}
      overflow="hidden"
      p={0}
      m={0}
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50vh",
        bg: "rgba(0, 0, 0, 0.4)", // Dark overlay effect
        zIndex: 1,
      }}
    >
      <AspectRatio ratio={21 / 9} maxW="100%" height="100%">
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
        zIndex={2} // Set z-index higher than the overlay
        color="white"
        textAlign="center"
      >
        <Box p={{base:"2", lg:"4"}}>
          {/* You call it "size" and not "fontSize" because you want to refer to the "sizes" in the theme.ts  */}
          {/* Remember standard sizes are still available like "xl, 2xl" and so on */}
          <Heading size="main_heading"fontWeight="bold" mb={4}>
            Crafted with Passion, Worn with Pride
          </Heading>
          <Button bg="primary_color.green" size="lg" fontFamily="'Afacad'" color="primary_color.white">
            Explore Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FrontpageHeroVideo;