import { Icon, Link as ChakraLink, Text, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import { ActiveLink } from "../../ActiveLink";

interface NavLinkProps extends ChakraLinkProps{
  icon?: ElementType;
  linkText: string;
  href: string,
}

export function NavLink({icon, linkText, href, ...rest}: NavLinkProps) {
  const linkTextMargin = icon ? "4" : "0";

  return(
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" alignItems="center" py="2" {...rest}>
        { icon && (<Icon as={icon} fontSize="20"/>)}
        <Text ml={linkTextMargin} fontWeight="md">{linkText}</Text>
      </ChakraLink>
    </ActiveLink>
  )
}