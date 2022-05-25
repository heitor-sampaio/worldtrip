import { Box } from "@chakra-ui/react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Slide from "./slide";

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

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

type Continent = {
  slug: string,
  continentName: string,
  continentShortDescription: string,
  continentFullDescription: string,
  imgUrl: string,
  countries: Country[],
  cities: City[],
}

interface ContinentProps {
  continents: Continent[]
}

export default function Slider({ continents }: ContinentProps) {
  return (
    <Box as="section" w="100%" maxW={1240} mb={["","40px"]}>
      <Swiper modules={[Navigation, Pagination]} navigation pagination>
        { continents.map(continent => (
          <SwiperSlide key={continent.slug} title={continent.continentName}>  
            <Slide imgUrl={continent.imgUrl} title={continent.continentName} subTitle={continent.continentShortDescription} href={`/${continent.slug}`}/> 
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
