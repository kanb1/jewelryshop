import React from "react";
import { Box, Text, Flex, Divider } from "@chakra-ui/react";

interface ProgressTimelineProps {
  currentStep: "delivery" | "billing" | "confirmation";
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ currentStep }) => {
  const steps = ["delivery", "billing", "confirmation"];

  return (
    <Flex justify="space-between" align="center" mt={4}>
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
