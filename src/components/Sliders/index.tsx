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

type Gallery = {
  imgUrl: string,
  author: string,
  likes: number
}

type City = {
  name: string,
  country: string,
  cityImgUrl: string,
  coords: {
    lat: string,
    long: string
  },
  top: boolean,
  gallery: Gallery[],
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

interface CityGalleryProps {
  city: City
}

export function Slider({ continents }: ContinentProps) {
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

export function CityGallerySlider({ city }: CityGalleryProps) {
  return (
    <Box as="section" w="100%" maxW={1240} mb={["","40px"]}>
      <Swiper modules={[Navigation, Pagination]} navigation pagination>
        { city.gallery.map(image => (
          <SwiperSlide key={image.imgUrl}>  
            <Slide imgUrl={image.imgUrl}/> 
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
