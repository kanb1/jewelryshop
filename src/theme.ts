import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    // Custom Fonts
  fonts: {
    heading: "Cinzel, serif",  
    body: "Asar, serif",      
  },

    // Custom Colors

  colors:{
    primary_color:{
      black: "#020402",
      blackHover: "#46433A",
      white: "#FFFFFF",
      green: "#796D3E",
      greenHover: "#9F9671",
      darkgrey: "#5a5a5a",
    },
    secondary_color:{
      grey:"#D9D9D9",
    },
    accent_color:{
      red:"#7B0828",
      redHover:"#853E52",
      offwhite:"#F1E7D6",
    },

  },

    // Component-Specific Customizations, chakra components
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Cinzel, serif",
      },
      sizes: {
        // Responsive font sizes for main headings
        main_heading:{
          fontSize: { base: "20px", sm: "20px", md: "30px", lg: "45px"},
        },
      },
      variants: {
        subheader: {
          fontFamily: "Afacad, serif",
          fontSize: { base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" },
          fontWeight: "bold",
          // Slightly darker grey for subheaders
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
