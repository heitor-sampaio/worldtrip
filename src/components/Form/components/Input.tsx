/* eslint-disable react/no-children-prop */
import { Flex, FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputGroup, InputLeftElement, InputProps as ChakraInputProps, InputRightElement } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import { FieldError } from "react-hook-form";
import { HelpTooltip } from "../../Tooltips";

interface InputProps extends ChakraInputProps {
  type: string,
  name: string,
  label?: string,
  tooltip?: {
    title: string,
    tip: string,
  },
  error?: FieldError,
  leftIcon?: {
    icon: ReactNode,
    interactive?: boolean
  } 
  rightIcon?: {
    icon: ReactNode,
    interactive?: boolean,
  } 
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ type, name, label, tooltip, error = null, leftIcon, rightIcon, ...rest }, ref) => {
  error && console.log(error)
  return (
    <FormControl isInvalid={!!error}>
      <Flex direction="row" align="center">
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        {!!tooltip && <HelpTooltip title={tooltip.title} tip={tooltip.tip}/>}
      </Flex>
      <InputGroup>
        { leftIcon && <InputLeftElement pointerEvents={leftIcon.interactive ? "auto" : "none"} children={leftIcon.icon}/> }
        <ChakraInput
          name={name}
          id={name}
          type={type}
          focusBorderColor="highlight.500"
          errorBorderColor='red.500'
          variant="outline"
          _hover={{ bgColor: 'gray.50' }}
          ref={ref}
          {...rest}
        />
        { rightIcon && <InputRightElement pointerEvents={rightIcon.interactive ? "auto" : "none"} children={rightIcon.icon}/> }
      </InputGroup>
      { !!error && (<FormErrorMessage>{error.message}</FormErrorMessage>) }
    </FormControl>
  )
}

export const Input = forwardRef(InputBase);