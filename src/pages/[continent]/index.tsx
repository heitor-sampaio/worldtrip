import { Box, Flex, HStack, Icon, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { AiFillFire } from "react-icons/ai";

import Header from "../../components/Header";
import CityCard from "../../components/CityCard";
import Footer from "../../components/Footer";

import { api } from "../../services/api";

import { CountryFormatted, CityFormatted, ContinentFormatted, User, Token } from '../../types'
import { useAuth } from "../../contexts/AuthContext";
import { AddCityModal } from "../../components/Modals/AddCityModal";
import { ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import decode from 'jwt-decode'

interface ContinentProps {
  continentData: ContinentFormatted,
  countriesData?: CountryFormatted[],
  citiesData?: CityFormatted[]
}

export default function Continent({ continentData: continent, countriesData: countries, citiesData: citiesData }: ContinentProps) { 
  const { user } = useAuth()
  const [cities, setCities] = useState(citiesData)
  
  const countriesNumber = countries?.length;

  const languages = countries.reduce((langs, country) => {
    const countryLanguages = country.languages;

    countryLanguages.forEach(language => { !langs.includes(language) && langs.push(language) })

    return langs;
  }, [])

  const languagesNumber = languages.length;

  const citiesNumber = cities.length;

  function FindCountryByCity(city: CityFormatted): CountryFormatted {
    const country = countries.find(country => country.id === city.countryRef)

    return country
  }

  async function syncCities(newCity: CityFormatted) {
    setCities([...cities, newCity])
  }

  return (
    <Flex direction="column" h="100%" minH="100vh">
      <title>World Trip | Planejador de viagens</title>
      <Header enableNavigation href="/"/>

      <Flex bgImage={continent.imgUrl} bgPosition="center" bgRepeat="no-repeat" bgSize="cover" w="100%"  direction="column" px="5">
        <Flex w="100%" maxW={1440} h={["175px", "450px"]} mx="auto" py={["","60px"]} alignItems={["center","end"]} justifyContent={["center","flex-start"]} color="white">
          <Text fontSize={["3xl","6xl"]} fontWeight="bold" wordBreak={"break-word"}>{continent.continentName}</Text>
        </Flex>
      </Flex>

      <Flex w={["90%","100%"]} maxW={1440} h="100%" mx="auto" direction="column" px={["0","5"]}>
        <Stack as="section" direction={["column","row"]} spacing={["5","0"]} py={["5","80px"]} align="center">
          <Text fontSize={["sm","2xl"]} w="100%" maxW={["100%","50%"]} textAlign="justify">{continent.continentFullDescription}</Text>
          
          <HStack justifyContent="center" spacing={["10","20"]} h="100%" w="100%" maxW={["100%","50%"]}>
            <Box flexDirection="column" textAlign="center" alignItems="center" justifyContent="center" fontWeight="semibold">
              <Text fontSize={["4xl","8xl"]} lineHeight="none" color="highlight.500">{countriesNumber}</Text>
              <Text fontSize={["md","2xl"]}>país{countriesNumber > 1 && ("es")}</Text>
            </Box>
            <Box flexDirection="column" textAlign="center" alignItems="center" justifyContent="center" fontWeight="semibold">
              <Text fontSize={["4xl","8xl"]} lineHeight="none" color="highlight.500">{languagesNumber}</Text>
              <Text fontSize={["md","2xl"]}>língua{languagesNumber > 1 && ("s")}</Text>
            </Box>
            <Box flexDirection="column" textAlign="center" alignItems="center" justifyContent="center" fontWeight="semibold">
              <Text fontSize={["4xl","8xl"]} lineHeight="none" color="highlight.500">{citiesNumber}</Text>
              <Text fontSize={["md","2xl"]}>cidade{citiesNumber > 1 && ("s")}</Text>
            </Box>
          </HStack>
        </Stack>

        { citiesNumber > 0 ?
          <Box as="section">
            <Flex direction={["column","row"]} pb={["2", "10"]}>
              <Flex direction="row">
                <Text fontSize={["2xl","4xl"]}>Cidade{citiesNumber > 1 && ("s")} disponíve{citiesNumber > 1 ? ("is") : ("l")}</Text>
                
                { user?.permissions.cities.create && <AddCityModal continent={continent} countries={countries} onAddCity={syncCities}/> }
              </Flex>
              
              <Flex direction="row" ml={["0","auto"]} align="center">
                <Icon as={AiFillFire} fontSize={["lg","3xl"]} color="red.500"/>
                <Text fontSize={["sm","xl"]}>Destinos mais procurados</Text>
              </Flex>
            </Flex>
            <SimpleGrid spacing={["5","10"]} mb={["5","10"]} minChildWidth="300px" >
              { cities.map((city: CityFormatted) => {
                const cityCountry = FindCountryByCity(city)
                return (
                  <CityCard key={city.name} cityInfo={city} country={cityCountry}/>
                )}) }
            </SimpleGrid>
          </Box>
          :
          <VStack spacing="5" direction="column" justify="center" align="center" color="gray.300" textAlign="center" mt="10">
            <Text>Sentimos muito!</Text>
            <Text>Infelizmente este continente não possui nenhum destino cadastrado!</Text>
            { user?.permissions.cities.create && 
              <>
                <Text>Adicione um agora!</Text>
                <AddCityModal continent={continent} countries={countries} onAddCity={syncCities}/>
              </>
            }
            { !user?.roles.includes('editor') || !user?.roles.includes('team') && <Text>Solicite um cargo de editor e comece a adicionar seus destinos favoritos!</Text> }
          </VStack>
        }
      </Flex>

      <Footer/>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { continent } = ctx.params;
  const slug = String(continent);

  const response = await api.get("/continents", { params: { continent: slug } }).then(response => (response.data))

  return {
    props: { continentData: response.continent, countriesData: response.countries, citiesData: response.cities }
  }
}