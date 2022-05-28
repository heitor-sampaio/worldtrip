import { FormControl, VStack, InputGroup, InputLeftElement, Icon, Text, Input, InputRightElement, IconButton, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { logIn } = useAuth();
  const [hidePassword, setHidePassword] = useState(true)

  function HandleHidePassword() {
    hidePassword ? setHidePassword(false) : setHidePassword(true)
  }

  return (
    <FormControl>
      <VStack spacing="5" my="10">
        <InputGroup>
          <InputLeftElement pointerEvents="none"><Icon as={MdOutlineAlternateEmail}/></InputLeftElement>
          <Input placeholder="E-mail"/>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaUser}/>
          </InputLeftElement>
          <Input placeholder="Senha" type={hidePassword ? "password" : "text"}/>
          <InputRightElement>
            <IconButton icon={<Icon as={hidePassword ? FaEye : FaEyeSlash}/>} aria-label="Tornar senha visível" variant="unstyled" onClick={HandleHidePassword}/>
          </InputRightElement>
        </InputGroup>
        <Button rightIcon={<Icon as={HiOutlineLogin}/>} onClick={logIn} my="4" bg="highlight.500" variant="solid" color="white">
          <Text>Login</Text>
        </Button>
      </VStack>
    </FormControl>
  )
}