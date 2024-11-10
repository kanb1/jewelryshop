import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Cinzel, serif",  // Default font for headings
    body: "Asar, serif",       // Default font for body text
  },

  colors:{
    primary_color:{
      black: "#020402",
      white: "#FFFFFF",
      green: "#796D3E",
      darkgrey: "#5a5a5a",
    },
    secondary_color:{
      grey:"#D9D9D9",
    },
    accent_color:{
      red:"#7B0828",
      offwhite:"#F1E7D6",
    },

  },

  
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Cinzel, serif",
      },
      sizes: {
        main_heading:{
          fontSize: { base: "20px", sm: "20px", md: "30px", lg: "45px"},
        },
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
