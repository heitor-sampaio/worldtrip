import { Flex, Link, Text } from "@chakra-ui/react"

interface SlideProps {
  imgUrl: string,
  title: string,
  subTitle: string,
  href: string
}

export default function Slide({ imgUrl, subTitle, title, href }: SlideProps) {  
  const imgUrlFormated = `linear-gradient(rgba(28, 20, 1, 0.5),rgba(28, 20, 1, 0.5)) , url('${imgUrl}')`

  return (
    <Link href={href} _hover={{textDecation: 'none'}}>
      <Flex bgImage={imgUrlFormated} bgPosition="center" bgSize="cover" w="100%" h={["225","450"]} direction="column" alignItems="center" justifyContent="center" color="white">
        <Text fontSize={["xl","5xl"]} fontWeight="bold">{title}</Text>
        <Text fontSize={["md","2xl"]}>{subTitle}</Text>
      </Flex>
    </Link>
  )
}