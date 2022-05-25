import { Box, Flex, Icon, Image, Link } from "@chakra-ui/react";
import { IoChevronBack } from 'react-icons/io5'

interface HeaderProps {
  enableNavigation?: boolean,
  href?: string,
}

export default function Header({enableNavigation = false, href}: HeaderProps) {
  return (
    <Flex
      as="header"
      w="100%"
      maxW={1440}
      mx="auto"
      py={["4","6"]}
      align="center"
      justify={ enableNavigation ? "space-between" : "center" }
    >
      { enableNavigation && (
        <Link href={href} w={["6","8"]}>
          <Icon as={IoChevronBack} fontSize={["2xl","4xl"]}/>
        </Link>
      )}
      
      <Link href="/">
        <Image src="/logo.png" alt="World Trip logo" w={["60%", "100%"]} mx="auto"/>
      </Link>
      
      { enableNavigation && (
        <Box w={["6","8"]}/>
      )}
    </Flex>
  )
}
