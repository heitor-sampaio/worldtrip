import { Popover, PopoverTrigger, IconButton, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from "@chakra-ui/react"
import { FiHelpCircle } from 'react-icons/fi'

interface TooltipProps {
  title: string,
  tip: string
}

export function HelpTooltip({title, tip}: TooltipProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="Ajuda" icon={<FiHelpCircle/>} variant="unstyled" size="lg" p="0" m="0"/>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader bg="highlight.500" border="highlight.500" color="white">{title}</PopoverHeader>
        <PopoverBody>{tip}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}