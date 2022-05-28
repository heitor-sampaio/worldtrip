import { AppProps } from 'next/app'
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'

import '@fontsource/poppins/200.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'

import { theme } from '../styles/theme'
import { MenuDrawerProvider } from '../contexts/MenuDrawerContext'
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider>
        <AuthProvider>
          <MenuDrawerProvider>
            <Component {...pageProps} />
          </MenuDrawerProvider>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
