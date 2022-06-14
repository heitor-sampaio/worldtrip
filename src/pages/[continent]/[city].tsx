import { Box, Flex, HStack, Icon, IconButton, SimpleGrid, Stack, Text, Image } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { AiFillFire, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { CityGallerySlider } from "../../components/Sliders";
import TripTypes from "../../components/TripType";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface CityProps {
  city: {
    name: string,
    country: string,
    cityImgUrl: string,
    coords: {
      lat: string,
      long: string
    },
    top: boolean,
    stars: number,
  }
}

export default function City({city}: CityProps) { 
  const { isAuthenticated } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(()=> {
    const cachedData = JSON.parse(localStorage.getItem("@worldtrip"))

    const favouritesCities = cachedData?.favouritesCities;

    const cityInFavourites = favouritesCities?.find(favCity => favCity.name === city.name)

    cityInFavourites && setIsFavourite(true)
  },[])

  function ToggleFavourite() {
    if (isFavourite) {
      const cachedData = JSON.parse(localStorage.getItem("@worldtrip"))

      const favouritesCities = cachedData.favouritesCities;

      const updatedFavouritesCities = favouritesCities?.filter(city => city.name !== name)

      const updatedCachedData = {...cachedData, favouritesCities: updatedFavouritesCities}

      localStorage.setItem("@worldtrip", JSON.stringify(updatedCachedData))

      setIsFavourite(false)
    } else {
      const cachedData = JSON.parse(localStorage.getItem("@worldtrip"))

      const favouritesCities = cachedData.favouritesCities;

      let updatedFavouritesCities

      favouritesCities ? updatedFavouritesCities = [...favouritesCities, city] : updatedFavouritesCities = [city];

      const updatedCachedData = {...cachedData, favouritesCities: updatedFavouritesCities}

      localStorage.setItem("@worldtrip", JSON.stringify(updatedCachedData))

      setIsFavourite(true)
    } 
  }

  return (
    <Flex direction="column" h="100%">
      <title>World Trip | Planejador de viagens</title>
      <Header enableNavigation href="/"/>

      <Image src={city.cityImgUrl} alt={city.name} w="100%" h={["175px", "450px"]} objectFit="fill" mx="auto"/>

      <Flex direction="column" flex="1" w="100%" maxW={1440} p="5" mx="auto">
        <Flex direction="row" justify="start" align="center" pb="4">
          <Text fontSize="4xl">{city.name}</Text>
          { isAuthenticated && (
            <IconButton 
              aria-label="Add city to favourite"
              icon={<Icon as={isFavourite ? AiFillHeart : AiOutlineHeart} fontSize="2xl" color="red.500"/>}
              variant="unstyled"
              onClick={ToggleFavourite}
              w="6"
              h="6"
            />
          )}
          
          { city.top && (
            <Icon as={AiFillFire} fontSize="2xl" color="red.500" ml="auto"/>
          )}
          
          <Flex direction="row" ml="auto" align="center" justify="center">
            <Text fontSize="md">4/5</Text><Icon as={FaStar} fontSize="2xl" color="highlight.500"/>
          </Flex>
        </Flex>

        <Text fontSize="sm" textAlign="justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris viverra felis nec scelerisque aliquam. Aenean vel molestie tortor. Mauris consequat justo orci, id luctus turpis egestas at. Aliquam sollicitudin mi eu tempus hendrerit. Fusce faucibus dui eget arcu accumsan efficitur. Fusce in ex ac massa pharetra tempus. Suspendisse imperdiet nec neque at euismod. Donec venenatis accumsan dolor, vitae sollicitudin lorem venenatis a. Praesent massa odio, rutrum ac erat vitae, suscipit condimentum ipsum. Nam massa metus, volutpat ac ullamcorper ut, scelerisque id lacus. Aliquam et interdum tortor. Praesent interdum ornare commodo. Quisque vestibulum vitae lorem non interdum.</Text>
        
        <SimpleGrid columns={2} py="4" spacing="10">
          <Flex>
            <Text fontSize="xl">Galeria</Text>
            {/* <CityGallerySlider city={undefined}/> */}
          </Flex>
          <Flex direction="column">
            <Text fontSize="xl">Clima</Text>
            <Text>Londres chove todo dia o dia inteiro, não tem muito o que fazer, só capa de chuva.</Text>
          </Flex>
        </SimpleGrid>
        
        <Flex direction="column" py="4">
          <Flex direction="row" mb="4" align="center">
            <Text fontSize="xl" >O que fazer em {city.name}</Text>
            <Text lineHeight="normal" _hover={{bg: "gray.50"}} px="4" ml="auto" borderRadius="50">Filtrar</Text>
          </Flex>
          <SimpleGrid columns={3}>
            <TripTypes tripType="vida noturna" altText="Vida Noturna"/>
            <TripTypes tripType="moderna" altText="Moderna"/>
            <TripTypes tripType="classica" altText="Classica"/>
          </SimpleGrid>
        </Flex>

        <Flex>
          <Text fontSize="xl">{city.name} na visão dos viajantes</Text>
        </Flex>
      </Flex>

      <Footer/>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { continent } = params;
  const slug = String(continent);

  const response = await api.get("/", { params: { continent: slug, city: "Londres" } }).then(response => (response.data))

  return {
    props: { city: response }
  }
}