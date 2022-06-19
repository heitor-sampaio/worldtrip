import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, IconButton, Flex } from "@chakra-ui/react"
import { FiPlusCircle } from "react-icons/fi"
import { CityFormatted, ContinentFormatted, CountryFormatted } from "../../types"
import AddCityForm from "../Form/AddCityForm"

interface CreateCityProps {
  continent: ContinentFormatted,
  countries: CountryFormatted[],
  iconSize: string,
  onAddCity: (city: CityFormatted) => void
}

export function AddCityModal({continent, countries, iconSize, onAddCity}: CreateCityProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex align="center" justify="center" ml="4">
      <IconButton aria-label="Adicionar cidade" display="flex" justifyItems="center" icon={<FiPlusCircle/>} variant="unstyled" fontSize={iconSize} color="highlight.500" onClick={onOpen}/>
      
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay backdropFilter='blur(10px)'/>
        <ModalContent bg='#F5F8FA' w="90%">
          <ModalHeader bg="highlight.500" color="white" borderTopRadius="md">Adicionar uma cidade</ModalHeader>
          <ModalBody>
            <AddCityForm continent={continent} countries={countries} onClose={onClose} onAddCity={onAddCity}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
