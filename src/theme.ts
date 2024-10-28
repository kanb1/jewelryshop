import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Cinzel, serif",  // Default font for headings
    body: "Asar, serif",       // Default font for body text
  },

  
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Cinzel, serif",
      },
      sizes: {
        xl: { fontSize: { base: "32px", sm: "36px", md: "40px", lg: "48px", xl: "56px" } },
        lg: { fontSize: { base: "24px", sm: "28px", md: "32px", lg: "36px", xl: "40px" } },
      },
      variants: {
        subheader: {
          fontFamily: "Afacad, serif",
          fontSize: { base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" },
          fontWeight: "bold",
          color: "gray.700",
        },
      },
    },



    Text: {
      baseStyle: {
        fontFamily: "Asar, serif",
        fontSize: { base: "md", sm: "lg", md: "xl", lg: "2xl", xl: "3xl" },
      },
    },
  },
});

export default theme;
