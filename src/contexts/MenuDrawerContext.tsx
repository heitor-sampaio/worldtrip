import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface MenuDrawerProviderProps {
  children?: ReactNode;
}

type MenuDrawerContextData = UseDisclosureReturn

const MenuDrawerContext = createContext({} as MenuDrawerContextData);

export function MenuDrawerProvider({ children }: MenuDrawerProviderProps) {
  const disclousure = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    disclousure.onClose()
  }, [router.asPath])

  return (
    <MenuDrawerContext.Provider value={disclousure}>
      {children}
    </MenuDrawerContext.Provider>
  )
}

export const useMenuDrawer = () => useContext(MenuDrawerContext)