import { Box, Grid, Image} from "@chakra-ui/react";

const FrontpageImageSection = () => {

    return (
        <Box as="section" py={20} display={{ base: "none", md: "block" }}>
      {/* Image grid for desktop, stacked layout for mobile */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={4}
       
      >
        {/* Image Boxes */}
        <Box pos="relative" overflow="hidden" borderTopLeftRadius="none" borderBottomLeftRadius="none" borderTopRightRadius="lg" borderBottomRightRadius="lg" boxShadow="lg">
          <Image
            src="/images/frontpage/imagesection_img1.jpg"
            alt="Jewelry Image 1"
            objectFit="cover"
            w="100%"
            h={{ base: "300px", md: "600px" }}
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>
        <Box pos="relative" overflow="hidden" borderRadius="lg" boxShadow="lg">
          <Image
            src="/images/frontpage/imagesection_img2.jpg"
            alt="Jewelry Image 2"
            objectFit="cover"
            w="100%"
            h={{ base: "300px", md: "600px" }}
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>
        <Box pos="relative" overflow="hidden" borderTopLeftRadius="lg" borderBottomLeftRadius="lg" borderTopRightRadius="none" borderBottomRightRadius="none" boxShadow="lg">
          <Image
            src="/images/frontpage/imagesection_img3.jpg"
            alt="Jewelry Image 3"
            objectFit="cover"
            w="100%"
            h={{ base: "300px", md: "600px" }}
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>
      </Grid>
    </Box>


    );

};

export default FrontpageImageSection;