import React from "react";
import {Box} from "@chakra-ui/core/dist";

interface WrapperProps {
  variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant}) => {
  return (
    <Box
      maxW={variant === 'regular' ? "800px" : "400px"}
      mt={8}
      mx="auto"
      w="100%"
    >
      {children}
    </Box>
  )
};