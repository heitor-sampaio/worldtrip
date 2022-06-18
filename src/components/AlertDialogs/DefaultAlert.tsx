import { useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import React, { ReactNode, useState } from "react"

interface DefaultAlertProps {
  buttonTitle: string,
  title: string,
  descriptionComponent: ReactNode, // In order to correct format the alert main text, the best way is to provide a full component with the correct text format you desire.
  actionOnContinue: () => Promise<any>; // Function to execute when continue button is clicked
}

export function DefaultAlert({ buttonTitle, title, descriptionComponent, actionOnContinue }: DefaultAlertProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [isLoading, setIsLoading] = useState(false)

  async function handleContinue() {
    setIsLoading(true)

    await actionOnContinue()

    setIsLoading(false)
    
    onClose()
  }

  return (
    <>
      <Button colorScheme='yellow' color="white" onClick={onOpen} w="full">
        {buttonTitle}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent w="90%">
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              { title }
            </AlertDialogHeader>

            <AlertDialogBody>
              { descriptionComponent }
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme='red'>
                Cancelar
              </Button>
              <Button colorScheme='yellow' color="white" onClick={handleContinue} ml={3} isLoading={isLoading}>
                Continuar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}