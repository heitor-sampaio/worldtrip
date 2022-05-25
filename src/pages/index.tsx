import { Divider, Flex, Image, SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { api } from "../services/api";

import Header from "../components/Header";
import TripType from "../components/TripType";
import Slider from "../components/Slider";

export default function Home({ continents }) {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  })

  let banner;

  if (isWideVersion) {
    banner = "/banner/bannerDesktop.png"
  } else {
    banner = "/banner/bannerMobile.png"
  }

  return (
    <Flex direction="column" h="100%">
      <title>World Trip | Planejador de viagens</title>
      <Header/>
      <Flex direction="column">
        <Image src={banner} alt="" w="100%" fit="cover"/>

        <Flex direction="column" align="center">
          <SimpleGrid columns={[2,5]} spacing={["4", "auto"]} w={["80%","100%"]} maxW={["100%", "1240"]} py={["20px","80px"]} mx="auto">
            <TripType altText="Coquetel" tripType="vida noturna" />
            <TripType altText="Praia" tripType="praia" />
            <TripType altText="Moderna" tripType="moderna" />
            <TripType altText="Clássica" tripType="classica" />
            <TripType altText="E mais..." tripType="e mais..." />
          </SimpleGrid>

          <Divider w={["60px","150px"]} opacity="1" borderBottomWidth={["2px","4px"]}/>

          <Flex direction="column" py={["5","52px"]} fontSize={["lg","3xl"]} textAlign="center">
            <Text>Vamos nessa?</Text>
            <Text>Então escolha seu continente</Text>
          </Flex>

          <Slider continents={continents}/>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const continents = await api.get("/").then(response => (response.data));

  return {
    props: { continents },
  }
}
