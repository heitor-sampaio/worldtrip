import { Box, Flex, Text, Icon, IconButton, Image, Link, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { IoChevronBack } from 'react-icons/io5'
import { RiMenuLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { useMenuDrawer } from "../../contexts/MenuDrawerContext";
import Menu from "../Menu";

interface HeaderProps {
  enableNavigation?: boolean,
  href?: string,
}

export default function Header({enableNavigation = false, href}: HeaderProps) {
  const { onOpen } = useMenuDrawer();
  const { loggedIn } = useAuth()

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  })

  return (
    <Flex
      as="header"
      w="100%"
      maxW={1440}
      mx="auto"
      py={["4","6"]}
      align="center"
      justify="space-between"
    >
      <Menu logged={loggedIn}/>

      <Flex w="20%" justify="center" align="center">
        <IconButton
          display="flex"
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine}/>}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          alignItems="center"
        />
      </Flex>
      
      <Link href="/">
        <Image src="/logo.png" alt="World Trip logo" w={["60%", "100%"]} mx="auto"/>
      </Link>

      <Flex w="20%" justify="center" align="center">
        { enableNavigation && (
          <Link href="/" fontSize={["sm", "md"]}>VOLTAR</Link>
          )}
      </Flex>    
    </Flex>
  )
}
