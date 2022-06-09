import { FormControl, VStack, InputGroup, InputLeftElement, Icon, Text, InputRightElement, IconButton, Button, Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import * as yup from 'yup'
import { Input } from '../../components/Form/Input'

type LoginFormData = {
  email: string,
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email("E-mail invalido").required("Informe um e-mail"),
  password: yup.string().required("Informe uma senha").min(6, "A senha precisa ter no mínimo 6 caracteres"),
})

export default function LoginForm() {
  const { register, handleSubmit, formState: {errors, isSubmitting} }= useForm({ resolver: yupResolver(schema)});
  const { logIn, loggedIn } = useAuth();
  const [hidePassword, setHidePassword] = useState(true)

  function HandleHidePassword() {
    hidePassword ? setHidePassword(false) : setHidePassword(true)
  }

  const handleLogin: SubmitHandler<LoginFormData> = async (data, event) => {
    const { email, password } = data;

    logIn(email, password);
  }

  return (
    <Flex as="form" onSubmit={handleSubmit(handleLogin)}>
      <VStack spacing="5" my="10">
        <InputGroup>
          <InputLeftElement pointerEvents="none"><Icon as={MdOutlineAlternateEmail}/></InputLeftElement>
          <Input name="email" type="text" label="E-mail" error={errors.email} {...register("email")}/>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaUser}/>
          </InputLeftElement>
          <Input name="password" type={hidePassword ? "password" : "text"} label="Senha" error={errors.password} {...register("password")}/>
          <InputRightElement>
            <IconButton icon={<Icon as={hidePassword ? FaEye : FaEyeSlash}/>} aria-label="Tornar senha visível" variant="unstyled" onClick={HandleHidePassword}/>
          </InputRightElement>
        </InputGroup>
        <Button type="submit" rightIcon={<Icon as={HiOutlineLogin}/>} my="4" bg="highlight.500" variant="solid" color="white" isLoading={isSubmitting}>
          <Text>Login</Text>
        </Button>
      </VStack>
    </Flex>
  )
}