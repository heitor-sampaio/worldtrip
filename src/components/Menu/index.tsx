import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, Flex, Divider, DrawerBody, Switch, Text, useColorMode, Link, Button, DrawerFooter, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Image } from "@chakra-ui/react";
import { HiOutlineLogout } from 'react-icons/hi'

import LoginForm from "./LoginForm";
import { NavLink } from "./NavLink";
import Profile from "./Profile";

import { useAuth } from "../../contexts/AuthContext";
import { useMenuDrawer } from "../../contexts/MenuDrawerContext";

interface MenuProps {
  logged: boolean
}

export default function Menu({ logged }: MenuProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onClose } = useMenuDrawer();
  const { loggedIn, logIn, logOut } = useAuth();

  const userLogged = loggedIn;
  
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        { userLogged ? (
          <>
            <DrawerHeader justifyContent="left">
              <Flex>
                <Profile />
                <Flex direction="column" justify="center">
                  <Text fontSize="xs" fontWeight="thin">Bem-vindo(a)</Text>
                  <Text fontSize="md">Usuário</Text>
                </Flex>
              </Flex>  
            </DrawerHeader>
            <Flex w="100%" justify="center">
              <Divider w="60%"/>
            </Flex>
            <DrawerBody>
              <Flex justify="center" align="center" w="70%" h="100%" mx="auto">
                <Text textAlign="center">Novas funcionalidades estarão disoníveis em breve 😁</Text>
              </Flex>
              {/* <NavLink  href="/" linkText="Configurações da conta" />
              <NavLink  href="/" linkText="Meus favoritos" />
              <NavLink  href="/" linkText="Meus roteiros" />
              <Flex align="center" py="2">
                <Text>Modo escuro</Text>
                <Switch id="colorMode" colorScheme="green" ml="auto" isChecked={colorMode == "dark" ? true : false} onChange={toggleColorMode}/>
              </Flex> */}
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

              <Popover>
                <PopoverTrigger>
                  <Link fontSize="sm" href="#">Crie sua conta</Link>
                </PopoverTrigger>
                <PopoverContent border="2px" borderColor="gray.500" w="200px" fontSize="sm" bg="highlight.500" color="white">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    <Text textAlign="center">Em breve!</Text>
                  </PopoverHeader>
                  <PopoverBody>
                    <Text textAlign="center">Por hora, apenas clique no botão de login e você terá acesso à todas as funcionalidades!</Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </DrawerBody>
        )}
        
      </DrawerContent>
    </Drawer>
  )
}