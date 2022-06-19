import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, IconButton, Flex } from "@chakra-ui/react"
import { FiPlusCircle } from "react-icons/fi"
import { CityFormatted, ContinentFormatted, CountryFormatted } from "../../types"
import AddCountryForm from "../Form/AddCountryForm"

interface CreateCountryProps {
  continent: ContinentFormatted,
  withIcon?: boolean,
  iconSize?: string,
  onAddCountry: (country: CountryFormatted) => void
}

export function AddCountryModal({continent, withIcon, iconSize, onAddCountry}: CreateCountryProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex align="center" justify="center">
      { withIcon ? 
          <IconButton ml="4" aria-label="Adicionar país" display="flex" justifyItems="center" icon={<FiPlusCircle/>} variant="unstyled" fontSize={iconSize} color="highlight.500" onClick={onOpen}/>
        : 
          <Button aria-label="Adicionar país" variant="unstyled" onClick={onOpen} _hover={{color: 'highlight.500'}} w="100%" color="gray.400">País</Button>
      }
      
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay backdropFilter='blur(10px)'/>
        <ModalContent bg='#F5F8FA' w="90%">
          <ModalHeader bg="highlight.500" color="white" borderTopRadius="md">Adicionar um país</ModalHeader>
          <ModalBody>
            <AddCountryForm continent={continent} onClose={onClose} onAddCountry={onAddCountry}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
