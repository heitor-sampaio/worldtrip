import { Avatar, Flex } from "@chakra-ui/react";

interface ProfileProps {
  userName: string
}

export default function Profile({userName}: ProfileProps) {
  return (
    <Flex align="center" justify="center" h="100%" pr="4">
      <Avatar name={userName}/>
    </Flex>
  )
}