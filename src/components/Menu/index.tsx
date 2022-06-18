import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, Flex, Divider, DrawerBody, Switch, Text, useColorMode, Link, Button, DrawerFooter, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Image, Box, useToast } from "@chakra-ui/react";
import { HiOutlineLogout } from 'react-icons/hi'

import LoginForm from "../Form/LoginForm";
import { NavLink } from "./NavLink";
import Profile from "./Profile";

import { useAuth } from "../../contexts/AuthContext";
import { useMenuDrawer } from "../../contexts/MenuDrawerContext";
import { DefaultAlert } from "../AlertDialogs/DefaultAlert";
import { api } from "../../services/api";

export default function Menu() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onClose } = useMenuDrawer();
  const { logOut, user, refreshUser } = useAuth();
  const toast = useToast()

  async function setEditor() {
    try {
      await api.post('/users/roles', { role: 'editor'})

      const permissionsToUpdate = {
        cities: {
          view: true,
          edit: true,
          create: true,
          delete: false,
          favourite: true
        },
        attractions: {
          view: true,
          edit: true,
          create: true,
          delete: true,
          favourite: true
        },
        images: {
          create: true,
          delete: true,
        },
      }

      await api.put('/users/permissions', {permissionsToUpdate})

      refreshUser()

      toast({
        title: 'Bem vindo(a) ao time!',
        description:
          'Parabéns! Agora você é um editor WorldTrip!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } catch {
      toast({
        title: 'Ops! Algo não aconteceu como o esperado!',
        description:
          'Não foi possível adicionar o cargo de editor.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
    
  }

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        { user ? (
          <>
            <DrawerHeader justifyContent="left">
              <Flex>
                <Profile userName={ user.exibitionName } />
                <Flex direction="column" justify="center">
                  <Text fontSize="xs" fontWeight="thin">Bem-vindo(a)</Text>
                  <Text fontSize="md">{ user.exibitionName }</Text>
                </Flex>
              </Flex>  
            </DrawerHeader>

            <Flex w="100%" justify="center">
              <Divider w="60%"/>
            </Flex>

            <DrawerBody display="flex" flexDirection="column">
              <NavLink  href="/" linkText="Configurações da conta" />
              
              <NavLink  href="/" linkText="Meus favoritos" />
              
              <NavLink  href="/" linkText="Meus roteiros" />

              <Flex justify="center" align="center" w="70%" mx="auto" my="auto">
                <Text textAlign="center">Novas funcionalidades estarão disponíveis em breve 😄</Text>
              </Flex>

              <Flex align="center" py="2" mt="auto" direction="column" w="100%">
               { !user.roles.includes('editor') && 
                  <DefaultAlert
                    buttonTitle="Seja um editor(a)"
                    title="Termo de responsabilidade"
                    descriptionComponent={
                      <Box textAlign="justify">
                        <Text>Ao se tornar editor(a) você poderá adicionar informações à nossa plataforma.</Text>
                        <Text>Todas as informações que vcoê adicionar serão de sua responsabilidade social e jurídica e você deve ser dono ou ter direitos sobre as informações e/ou imagens utilizadas.</Text>
                      </Box>
                    }
                    actionOnContinue={setEditor}
                  />}
                {/* <Flex w="full">
                  <Text>Modo escuro</Text>
                  <Switch id="colorMode" colorScheme="green" ml="auto" isChecked={colorMode == "dark" ? true : false} onChange={toggleColorMode}/>
                </Flex> */}
              </Flex>
            </DrawerBody>

            <DrawerFooter justifyContent="center">
              <Button variant="link" onClick={logOut} _hover={{ color: 'hightlight.500'}}>
                <Text>Logout</Text><Icon as={HiOutlineLogout} ml="2"/>
              </Button>
            </DrawerFooter>
          </>
        ) : ( 
          <DrawerBody>
            <Flex direction="column" align="center" justify="center" w="100%" h="100%">
              <Image src="/logo.png" alt="World Trip logo" w="75%" my="50px" mx="auto"/>

              <Text textAlign="center" >Faça login ou crie sua conta para acessar as funcionalidades.</Text>   

              <LoginForm/>

              <Link fontSize="sm" href="/users/create">Crie sua conta</Link>  
            </Flex>
          </DrawerBody>
        )}     
      </DrawerContent>
    </Drawer>
  )
}
