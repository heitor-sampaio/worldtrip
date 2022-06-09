import { Flex, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex as="footer" direction={["column","row"]} align="center" justify="center" color="gray.400" fontWeight="200" fontSize={["xs","sm"]} mx="auto" pt={["4","2"]} pb="2"> 
      <Text pr="1">Design por <Link href="https://www.rocketseat.com.br/" color="purple">Rocketseat</Link>.</Text>
      <Text>Desenvolvimento por <Link href="https://www.linkedin.com/in/heitor-sampaio/" color="highlight.500" fontWeight="400">Heitor Sampaio</Link>.</Text>
    </Flex>
  )
}