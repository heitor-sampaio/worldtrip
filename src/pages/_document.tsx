import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { theme } from '../styles/theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name="description" content="WorldTrip aims to help travellers to discover new places and destinations for their next trips."/>
          <meta name="keywords" content="HTML, CSS, JavaScript, React.js, Next.js, ChakraUI"/>
          <meta name="author" content="Heitor Sampaio"/>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}