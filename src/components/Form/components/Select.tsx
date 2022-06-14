import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Select as ChakraSelect, SelectProps as ChakraSelectProps, Tooltip } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface SelectProps extends ChakraSelectProps {
  name: string,
  label?: string,
  tooltip?: string,
  error?: FieldError,
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = ({ name, label, tooltip, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      <Flex direction="row">
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        {!!tooltip && <strong>TIP</strong>}
      </Flex>
      <ChakraSelect
        name={name}
        id={name}
        focusBorderColor="highlight.500"
        variant="outline"
        _hover={{ bgColor: 'gray.50' }}
        ref={ref}
        {...rest}
      />
      { !!error && (<FormErrorMessage>{error.message}</FormErrorMessage>) }
    </FormControl>
  )
}

export const Select = forwardRef(SelectBase);