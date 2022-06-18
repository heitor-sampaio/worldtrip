import { Box, Flex, Icon, IconButton, Image, Text, useToast } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { CityFormatted, CountryFormatted, Token, User } from "../../types";
import decode from 'jwt-decode'
import { GetServerSideProps } from "next";

interface CityCardProps {
  cityInfo: CityFormatted,
  country: CountryFormatted,
  favourite?: boolean
}

export default function CityCard({ cityInfo: city, country, favourite}: CityCardProps) {
  const { isAuthenticated, user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(favourite);
  const toast = useToast()

  async function ToggleFavourite() {
    try {
      if (!user) {
        toast({
          title: 'Ops! Algo não aconteceu como o esperado!',
          description:
            'Sincronizando usuário. Por favor, tente novamente em alguns instantes.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        return
      }

      if (isFavourite) { 
        setIsFavourite(false)
      } else {
        setIsFavourite(true)    
      }

      const response = await api.put('/favourites/cities', {cityId: city.id})

      if (response.status !== 200) {
        throw new Error()
      }
    } catch {
      setIsFavourite(false)
      toast({
        title: 'Ops! Algo não aconteceu como o esperado!',
        description:
          'Não foi possível salvar a cidade nos seus favoritos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }

  return (
    <Box bg="white" flexDirection="column" borderRadius="4px" w={["80%","100%"]} mx="auto">
      <Flex bgImage={city.cityImgUrl} bgPosition="center" bgSize="cover" w="100%" h={["200px","256px"]} direction="row" borderTopLeftRadius="4px" borderTopRightRadius="4px" p="4">
        { isAuthenticated && (
          <IconButton 
            aria-label="Add city to favourite"
            icon={user && <Icon as={user.favourites.cities.includes(city.id) || isFavourite ? AiFillHeart : AiOutlineHeart} color="red.500"/>}
            fontSize="4xl"
            variant="unstyled"
            onClick={ToggleFavourite}
            bg="whiteAlpha.500"
            isRound
          />
        )}
        
        {/* { cityInfo.top && <Icon as={AiFillFire} fontSize="4xl" color="red.500" ml="auto"/>} */}
      </Flex>

      <Flex flexDirection="row" h="auto" borderX="1px" borderBottom="1px" borderColor="highlight.50" borderBottomLeftRadius="4px" borderBottomRightRadius="4px">
        <Box h="100%" maxW="70%" pt="6" pl="6">
          <Text fontSize="md" fontWeight="600">{city.name}</Text>
          <Text fontSize="sm">{country.name}</Text>
        </Box>
        
        <Flex flex="1" align="center" justify="flex-end" p="6">
          <Image src={country.flagImgUrl} alt={country.name} w="40px" h="40px" borderRadius="100%"/>
        </Flex>
      </Flex>
    </Box>
  )
}