import { Button, Flex, HStack, SimpleGrid, Text, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link"
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from "next/router";

import { Input } from '../../components/Form/components'
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

type CreatUserFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Informe seu nome"),
  email: yup.string().email("E-mail invalido").required("Informe um e-mail"),
  password: yup.string().required("Informe uma senha").min(6, "A senha precisa ter no mínimo 6 caracteres"),
  passwordConfirmation: yup.string().oneOf([null, yup.ref("password")], "As senhas precisam ser iguais")
})

export default function CreateUser() {
  const { register, handleSubmit, formState: {errors} }= useForm({ resolver: yupResolver(schema)});
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const { logIn } = useAuth()
  const toast = useToast()

  const handleCreateUser: SubmitHandler<CreatUserFormData> = async (data, event) => {
    try {
      setIsLoading(true)

      const { name, email, password, passwordConfirmation } = data;

      if ( password !== passwordConfirmation) {
        return false
      }

      const fullName = name.split(" ")
      
      let exibitionName
      fullName.length > 1 ? exibitionName = `${fullName[0]} ${fullName.pop()}` : exibitionName = fullName[0]  
      
      const response = await api.post("/users", {email, password, fullName: name, exibitionName})

      if (response.status === 200) {
        logIn(email, password)

        router.push("/");
      } else {
        throw new Error();
      }
    } catch {
      setIsLoading(false)

      toast({
        title: 'Ops! Algo não esperado aconteceu!',
        description:
          'Não foi possível criar sua conta. Por favor, tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }

  return (
    <Flex direction="column" h="100vh">
      <title>World Trip | Planejador de viagens</title>
      <Header/>
      
      <Flex as="form" direction="column" align="center" justify="center" flex="1" onSubmit={handleSubmit(handleCreateUser)}>
        <Flex direction="column" bg="white" justify="center" align="center" p="5" borderRadius="5" boxShadow="lg">
          <Text fontSize="xl" mb="10">Crie sua conta 😄</Text>

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="name" type="text" label="Nome" error={errors.name} {...register("name")}/>
              <Input name="email" type="email" label="E-mail" error={errors.email} {...register("email")}/>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="password" type="password" label="Senha" error={errors.password} {...register("password")}/>
              <Input name="password_confirmation" type="password" label="Confirme a senha" error={errors.passwordConfirmation} {...register("passwordConfirmation")}/>
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/" passHref>
                <Button colorScheme="red">Cancelar</Button>
              </Link>
              <Button type="submit" colorScheme="yellow" color="white" isLoading={isLoading}>Salvar</Button>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
        
      <Footer/>
    </Flex>
  )
}
