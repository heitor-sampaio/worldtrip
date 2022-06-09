import { Box, Flex, HStack, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { AiFillFire } from "react-icons/ai";

import CityCard from "../../components/CityCard";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

type Country = {
  name: string,
  languages: string[],
  flagImgUrl: string
}

type City = {
  name: string,
  country: string,
  cityImgUrl: string,
  coords: {
    lat: string,
    long: string
  },
  top: boolean
}

interface ContinentProps {
  continent: {
    slug: string,
    continentName: string,
    continentShortDescription: string,
    continentFullDescription: string,
    imgUrl: string,
    countries: Country[],
    cities: City[],
  }
}

export default function Continent({ continent }: ContinentProps) { 
  const { loggedIn } = useAuth();
  const countriesNumber = continent.countries.length;
  const languages = continent.countries.reduce((langs, country) => {
    const countryLanguages = country.languages;

    countryLanguages.forEach(language => { !langs.includes(language) && langs.push(language) })

    return langs;
  }, [])
  const languagesNumber = languages.length;
  const citiesNumber = continent.cities.length;

  function FindCountryFlag(countryName: string): string {
    const response = continent.countries.find(country => country.name === countryName);

    return response.flagImgUrl;
  }

  return (
    <Flex direction="column" h="100%">
      <title>World Trip | Planejador de viagens</title>
      <Header enableNavigation href="/"/>

      <Flex bgImage={continent.imgUrl} bgPosition="center" bgRepeat="no-repeat" bgSize="cover" w="100%"  direction="row">
        <Flex w="100%" maxW={1440} h={["175px", "450px"]} mx="auto" py={["","60px"]} alignItems={["center","end"]} justifyContent={["center","flex-start"]} color="white">
          <Text fontSize={["xl","6xl"]} fontWeight="bold">{continent.continentName}</Text>
        </Flex>
      </Flex>

      <Flex w={["90%","100%"]} maxW={1440} h="100%" mx="auto" direction="column">
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

        <Box as="section">
          <Flex direction={["column","row"]} pb={["2", "10"]}>
            <Text fontSize={["2xl","4xl"]}>Cidade{citiesNumber > 1 && ("s")} disponíve{citiesNumber > 1 ? ("is") : ("l")}</Text>
            <Flex direction="row" ml={["0","auto"]} align="center">
              <Icon as={AiFillFire} fontSize={["lg","3xl"]} color="red.500"/>
              <Text fontSize={["sm","xl"]}>Destinos mais procurados</Text>
            </Flex>
          </Flex>
          <SimpleGrid spacing={["5","10"]} mb={["5","10"]} minChildWidth="300px" >
            { continent.cities.map(city => (
              <CityCard key={city.name} cityInfo={city} flagImgUrl={FindCountryFlag(city.country)} favourite/>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      <Footer/>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { continent } = params;
  const slug = String(continent);

  const response = await api.get("/", { params: { continent: slug } }).then(response => (response.data))

  return {
    props: { continent: response }
  }
}