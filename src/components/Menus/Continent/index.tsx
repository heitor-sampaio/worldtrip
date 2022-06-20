import { Button, Placement, PlacementWithLogical, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import { CityFormatted, ContinentFormatted, CountryFormatted } from "../../../types";
import { AddCityModal } from "../../Modals/AddCityModal";
import { AddCountryModal } from "../../Modals/AddCountryModal";

interface MenuProps {
  continent: ContinentFormatted,
  countries: CountryFormatted[],
  iconSize: string,
  popOverPlacement: PlacementWithLogical,
  onAddCity: (city: CityFormatted) => void,
  onAddCountry: (country: CountryFormatted) => void,
}

export function ContinentMenu({ continent, countries, iconSize, popOverPlacement, onAddCity, onAddCountry }: MenuProps) {
  const { user } = useAuth()
  const { isOpen, onToggle, onClose } = useDisclosure()
  
  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} closeOnBlur={false} placement={popOverPlacement}>
      <PopoverTrigger>
        <Button variant="unstyled" mx="4" color="highlight.500" fontSize={iconSize} display="flex" justifyContent="center" onClick={onToggle}>
          <FiPlusCircle />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto" shadow="xl" border="1px" borderColor="highlight.50" _focus={{border: '1px', borderColor: 'highlight.50'}}>
        <PopoverArrow color="highlight.500" bg="highlight.500"/>
        <PopoverHeader bg="highlight.500" color="white" px="8" fontWeight="bold" borderTopRadius="md">Adicionar</PopoverHeader>
        <PopoverBody>
          { user?.permissions.cities.create && <AddCityModal continent={continent} countries={countries} withIcon={false} onAddCity={onAddCity}/>}
          { user?.permissions.countries.create && <AddCountryModal continent={continent} withIcon={false} onAddCountry={onAddCountry}/>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}