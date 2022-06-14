import { Button, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input as ChakraInput, InputProps as ChakraInputProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import { HelpTooltip } from "../../Tooltips";

interface InputProps extends ChakraInputProps {
  name: string,
  label?: string,
  tooltip?: {
    title: string,
    tip: string,
  },
  error?: FieldError,
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, tooltip, error = null, ...rest }, ref) => {
  error && console.log(error)
  return (
    <FormControl isInvalid={!!error}>
      <Flex direction="row" align="center">
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        {!!tooltip && <HelpTooltip title={tooltip.title} tip={tooltip.tip}/>}
      </Flex>
      <ChakraInput
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

export const Input = forwardRef(InputBase);