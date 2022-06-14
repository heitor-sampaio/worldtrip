import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, IconButton, Flex } from "@chakra-ui/react"
import { FiPlusCircle } from "react-icons/fi"
import { ContinentFormatted, CountryFormatted } from "../../types"
import AddCityForm from "../Form/AddCityForm"

interface CreateCityProps {
  continent: ContinentFormatted,
  countries: CountryFormatted[]
}

export function AddCityModal({continent, countries}: CreateCityProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex align="center" justify="center" ml="4">
      <IconButton aria-label="Adicionar cidade" icon={<FiPlusCircle/>} variant="unstyled" fontSize="2xl" color="gray.400" onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar cidade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddCityForm continent={continent} countries={countries} onClose={onClose}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
