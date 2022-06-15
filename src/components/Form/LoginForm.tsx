/* eslint-disable react/no-children-prop */
import { VStack, InputGroup, InputLeftElement, Icon, Text, InputRightElement, IconButton, Button, Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import * as yup from 'yup'
import { Input } from '../../components/Form/components'
import { RiLockPasswordLine } from "react-icons/ri";

type LoginFormData = {
  email: string,
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email("E-mail invalido").required("Informe um e-mail"),
  password: yup.string().required("Informe uma senha").min(6, "A senha precisa ter no mínimo 6 caracteres"),
})

export default function LoginForm() {
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm({resolver: yupResolver(schema)});
  const { logIn } = useAuth();
  const [hidePassword, setHidePassword] = useState(true)

  function HandleHidePassword() {
    hidePassword ? setHidePassword(false) : setHidePassword(true)
  }

  const handleLogin: SubmitHandler<LoginFormData> = async (data, event) => {
    const { email, password } = data;

    await logIn(email, password);
  }

  return (
    <Flex as="form" onSubmit={handleSubmit(handleLogin)}>
      <VStack spacing="5" my="10">
        <Input name="email" type="text" label="E-mail" error={errors.email} leftIcon={{icon: <MdOutlineAlternateEmail />}} {...register("email")}/>

        <Input 
          name="password"
          type={hidePassword ? "password" : "text"}
          label="Senha" 
          error={errors.password}
          leftIcon={{icon: <RiLockPasswordLine />}} 
          rightIcon={
            {icon: 
              <IconButton 
                icon={<Icon as={hidePassword ? FaEye : FaEyeSlash}/>}
                aria-label="Tornar senha visível"
                variant="unstyled"
                onClick={HandleHidePassword}
                display="flex"
              />,
              interactive: true
            }
          }
          {...register("password")}
        />

        <Button type="submit" rightIcon={<Icon as={HiOutlineLogin}/>} my="4" colorScheme="yellow" variant="solid" color="white" isLoading={isSubmitting} loadingText='Logando...'>
          <Text>Login</Text>
        </Button>
        
      </VStack>
    </Flex>
  )
}