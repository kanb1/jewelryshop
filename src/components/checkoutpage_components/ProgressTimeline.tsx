import React from "react";
import { Box, Text, Flex, Divider } from "@chakra-ui/react";

// This component: Visually tracks the user's current step in the checkout process

// The component accepts 1 prop
// The value must be one of the following:
interface ProgressTimelineProps {
  currentStep: "delivery" | "billing" | "confirmation";
}

// It receives the currentStep prop, which decides which step to highlight in the timeline
const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ currentStep }) => {
  // array of three steps in the chckprocess
  // used to render dynamically steps in the timeline
  const steps = ["delivery", "billing", "confirmation"];

  return (
    <Flex justify="space-between" align="center" mt={4}>
      {/* Loops through the steps array and renders each step dynamically */}
      {/* {index + 1} line, displays the step number. Adds a divider between steps but not after the alst step */}
      {steps.map((step, index) => (
        <Box key={step} textAlign="center" flex="1">
          <Text
            fontWeight={currentStep === step ? "bold" : "normal"}
            color={currentStep === step ? "blue.500" : "gray.500"}
          >
            {index + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
          </Text>
          {index < steps.length - 1 && <Divider orientation="horizontal" />}
        </Box>
      ))}
    </Flex>
  );
};

export default ProgressTimeline;
