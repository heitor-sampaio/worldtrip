import { Box, Flex, Icon, IconButton, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useAuth } from "../../contexts/AuthContext";
import { CityFormatted, CountryFormatted } from "../../types";

interface CityCardProps {
  cityInfo: CityFormatted,
  country: CountryFormatted,
  favourite: boolean
}

export default function CityCard({ cityInfo, country, favourite }: CityCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(()=> {
    const cachedData = JSON.parse(localStorage.getItem("@worldtrip"))

    if (cachedData) {
      const favouritesCities = cachedData?.favouritesCities;

      const cityInFavourites = favouritesCities?.find((city: CityFormatted) => city.name === cityInfo.name)

      cityInFavourites && setIsFavourite(true)
    } 
  },[])

  function ToggleFavourite() {
    if (isFavourite) {
      setIsFavourite(false)
    } else {
      setIsFavourite(true)    
    } 
  }

  return (
    <Box bg="white" flexDirection="column" borderRadius="4px" w={["80%","100%"]} mx="auto">
      <Flex bgImage={cityInfo.cityImgUrl} bgPosition="center" bgSize="cover" w="100%" h={["200px","256px"]} direction="row" borderTopLeftRadius="4px" borderTopRightRadius="4px" p="4">
        { isAuthenticated && (
          <IconButton 
            aria-label="Add city to favourite"
            icon={<Icon as={isFavourite ? AiFillHeart : AiOutlineHeart} fontSize="4xl" color="red.500"/>}
            variant="unstyled"
            onClick={ToggleFavourite}
          />
        )}
        
        {/* { cityInfo.top && <Icon as={AiFillFire} fontSize="4xl" color="red.500" ml="auto"/>} */}
      </Flex>

      <Flex flexDirection="row" h="auto" borderX="1px" borderBottom="1px" borderColor="highlight.50" borderBottomLeftRadius="4px" borderBottomRightRadius="4px">
        <Box h="100%" maxW="70%" pt="6" pl="6">
          <Text fontSize="md" fontWeight="600">{cityInfo.name}</Text>
          <Text fontSize="sm">{country.name}</Text>
        </Box>
        
        <Flex flex="1" align="center" justify="flex-end" p="6">
          <Image src={country.flagImgUrl} alt={country.name} w="40px" h="40px" borderRadius="100%"/>
        </Flex>
      </Flex>
    </Box>
  )
}