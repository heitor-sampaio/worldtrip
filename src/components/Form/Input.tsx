import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string,
  label?: string,
  error?: FieldError,
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, error = null, ...rest }, ref) => {
  error && console.log(error)
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="highlight.500"
        variant="outline"
        _hover={{ bgColor: 'gray.50' }}
        // size="lg"
        ref={ref}
        {...rest}
      />
      { !!error && (<FormErrorMessage>{error.message}</FormErrorMessage>) }
    </FormControl>
  )
}

export const Input = forwardRef(InputBase);