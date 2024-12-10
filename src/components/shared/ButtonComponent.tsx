import { Button } from "@chakra-ui/react";

// Defines the structure of the props that the ButtonComponent will accept 
// TS used to enforce types in our code
interface ButtonComponentProps {
  text: string;
//   Optional prop "?" that accepts a function with no arguments and no return value "void"
// Allows me to handle button click events
  onClick?: () => void;
// Optional property that expects one of the specified strings
// | union type, creates a union of specific string values
  variant?: "primaryGreenBtn" | "primaryBlackBtn" | "ctaBtn" | "greyBtn" | "redBtn" | "greenBtn" | "outlineBtn";
  size?: { base?: string; sm?: string; md?: string; lg?: string }; // Responsive size
//   Optional prop. But it expects a string value which is the font in this case
  fontFamily?: string; 
  //{} means hoverStyle is an object, and the object can have any number of properties
//   the keys are strings eg bg, color, transform
// the values can be of any type eg blue, 5 or {}
// It's called an index signature in TS, when u don't know the exact names of all the keys in advance
// The square brackets mean "for any string key", without the square brackets I have to explicitly define all possible keys ahead of time
  hoverStyle?: { [key: string]: any }; 
  styleOverride?: { [key: string]: any }; // Adding this for custom styles
  isLoading?: boolean; // Add loading state
  isDisabled?: boolean; // Disable the butotn when true

}

// Functional react component
// React.FC a TS utility type that represents a react functional component
// "ButtonComponentProps" --> Specifies that the buttoncomponent must folow the rules defined in the buttoncomponentprops interface
const ButtonComponent: React.FC<ButtonComponentProps> = ({
    // Default values
  text,
  onClick,
  variant = "primaryBlackBtn", 
  size = { base: "md" }, // Default responsive size
  fontFamily = "'Afacad', serif", 
  // Destructure hoverStyle with a default empty object.
//   The destructure means that instead of writing props.text, props.onClick etc we destructure the properties directly in the functions parameter list
// We give hoverSTyle a default value of an empty object, and it ensures that no errors occur if hoverStyle is not provided by the parent component (like the file that uses the button)
  hoverStyle = {}, 
  styleOverride = {}, // Default to an empty object
  isLoading = false, // Default is not loading

}) => {
    // Object definition named variantStyles --> Contains different style configurations for each button variant
    // Each key (ctaBtn and so on) corresponds to a variant value from the interface
  const variantStyles = {
    primaryGreenBtn: {
        // properties in chakra ui styles
      bg: "primary_color.green",
      color: "primary_color.white",
      _hover: { bg: "transparent", border: "2px solid", borderColor: "primary_color.green", color: "primary_color.green" },
    },
    primaryBlackBtn:{
      bg: "primary_color.black",
      color: "primary_color.white",
      _hover: {bg: "transparent", border:"2px solid", borderColor:"primary_color.black", color:"primary_color.black"},
    },
    ctaBtn:{
        bg: "accent_color.red",
        color: "primary_color.white",
        _hover: {bg: "transparent", border:"2px solid", borderColor:"accent_color.red", color:"accent_color.red"}
    },
    greyBtn: {
      bg: "gray.200",
      color: "black",
      _hover: { bg: "gray.300" },
    },
    redBtn: {
      bg: "red.500",
      color: "white",
      _hover: { bg: "red.600" },
    },
    greenBtn:{
        bg: "green.500",
        color: "white",
        _hover: { bg: "green.600" },
    },
    outlineBtn: {
      bg: "transparent",
      color: "primary_color.green",
      border: "2px solid",
      borderColor: "primary_color.green",
      _hover: { bg: "primary_color.green", color: "white" },
    },
  };



//Dynamic style selection, also for hover..
// Hover merge: ...variantStyles[variant]._hover: Adds the default hover styles. But we merge it with ...hoverStyle (whatever the user for example wanna include/override provided by the hoverStyle prop
// If both _hover and hoverStyle have a property with the same key, the one in hoverStyle will override the default. We give priority to hoverStyle (The order of properties.. the ones that comes later in the object overrides the other)
const styles = {
    // // Use styles from the selected variant
    ...variantStyles[variant],
    // But if we want to override or add custom hover styles without modifying the default variantStyles then we merge with "...hoverStyle"
    // it means that the button retains the default styles for primaryGreenBtn for example but the hover behavior is extended to include whatever the user wants fx color: "yellow"
    _hover: { ...variantStyles[variant]._hover, ...hoverStyle }, 
    ...styleOverride, // Merging custom styles here
  };

  

//   This component renders a chakra UI button witht he sepcified styles and props
  return (
    <Button
    // Spread operator.. passes all the props from styles, fx bg, color to the Button component
      {...styles}
    //   Dynamic props, sets the size, text and so on dynamically
      size={size}
      fontFamily={fontFamily} // Optional fontFamily customization
      onClick={onClick}
      isLoading={isLoading} // Pass the loading state to the Chakra Button

    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
