import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { AiFillFire } from "react-icons/ai"

interface CityCardProps {
  cityInfo: {
    name: string,
    country: string,
    cityImgUrl: string,
    coords: {
      lat: string,
      long: string,
    },
    top: boolean
  },
  flagImgUrl: string,
}

export default function CityCard({ cityInfo, flagImgUrl }: CityCardProps) {
  return (
    <Box bg="white" flexDirection="column" borderRadius="4px" w={["80%","100%"]} mx="auto">
      <Flex bgImage={cityInfo.cityImgUrl} bgPosition="center" bgSize="cover" w="100%" h={["200px","256px"]} direction="column" borderTopLeftRadius="4px" borderTopRightRadius="4px">
        { cityInfo.top && <Icon as={AiFillFire} fontSize="4xl" m="5" color="red.500" ml="auto"/>}
      </Flex>

      <Flex flexDirection="row" h="auto" borderX="1px" borderBottom="1px" borderColor="highlight.50" borderBottomLeftRadius="4px" borderBottomRightRadius="4px">
        <Box h="100%" maxW="70%" pt="6" pl="6">
          <Text fontSize="md">{cityInfo.name}</Text>
          <Text fontSize="sm">{cityInfo.country}</Text>
        </Box>
        
        <Flex flex="1" align="center" justify="flex-end" p="6">
          <Image src={flagImgUrl} alt={cityInfo.country} w="40px" h="40px" borderRadius="100%"/>
        </Flex>
      </Flex>
    </Box>
  )
}