import { Flex, Icon, Text } from "@chakra-ui/react";
import { BiDrink, BiWorld } from 'react-icons/bi';
import { FaUmbrellaBeach } from 'react-icons/fa';
import { GiModernCity, GiColiseum } from 'react-icons/gi';

interface TripTypesProps {
  altText: string;
  tripType: string;
}

export default function TripTypes({ altText, tripType }: TripTypesProps) {
  let icon;

  switch (tripType) {
    case "vida noturna":
      icon = BiDrink;
      break;
    case "praia":
      icon = FaUmbrellaBeach;
      break;
    case "moderna":
      icon = GiModernCity;
      break;
    case "classica":
      icon = GiColiseum;
      break;
    case "e mais...":
      icon = BiWorld;
      break;
  }

  return (
    <Flex direction="column" justify="center" align="center" w="auto" mx="auto">
      <Icon as={icon} fontSize={["xl","7xl"]} color="highlight.500"/>
      
      <Text mt={["1","6"]} fontSize={["md","2xl"]}>{tripType}</Text>
    </Flex>
  )
}
