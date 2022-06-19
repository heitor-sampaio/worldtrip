import { VStack, Flex, InputGroup, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileInput, Input } from '../../components/Form/components'
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { ContinentFormatted, CountryFormatted } from "../../types";

interface AddCityFormProps {
  continent: ContinentFormatted,
  onClose: () => void,
  onAddCountry: (country: CountryFormatted) => void
}

type AddCountryFormData = {
  name: string,
  languages: string,
  image: string,
}

export default function AddCityForm({continent, onClose, onAddCountry}: AddCityFormProps) {
  const { register, handleSubmit, formState: {errors}, setError, trigger, reset} = useForm();
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const [imageParams, setImageParams] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast();

  const formValidations = {
    image: {
      required: true,
      validate: {
        lessThen10MB: file =>
          file[0].size <= 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: file =>
          ['image./jpeg', 'image./jpg', 'image/png', 'image/gif'].includes(file[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    name: {
      required: true,
      minLenght: 2,
    },
    language: {
      required: true,
    },
  };

  const handleAddCountry: SubmitHandler<AddCountryFormData> = async (data, event) => {
    setIsLoading(true)
    try{
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        throw new Error();
      }

      const imageData = await api.post('/images', {url: imageUrl, owner: user.id})

      if (imageData.status !== 201) {
        throw new Error()
      }

      const { name, languages } = data;

      const languagesArray = languages.split(' ')

      const languagesArrayFormatted = languagesArray.map(language => {
        let countryName

        const removeComma = language.includes(',') && language.replace(',','')

        if ( removeComma ) {
          countryName = removeComma.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        }

        countryName = language

        return countryName
      })

      let addedBy = {}

      if ( user.roles.includes('team') ) {
        addedBy = {
          id: undefined,
          name: 'WorldTrip Team'
        }
      } else {
        addedBy = {
          id: user.id,
          name: user.exibitionName
        }
      }

      const newCountry = {
        name,
        languages: languagesArrayFormatted,
        continentRef: continent.id,
        countryImgUrl: imageUrl,
        addedBy
      }
      
      const countryData = await api.post('/countries', newCountry)

      if (countryData.status !== 201) {
        throw new Error()
      }

      await onAddCountry(countryData.data.newCountry)

      toast({
        title: 'País adicionado',
        description: 'O paiś foi adicionada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar o país.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setIsLoading(false)
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      onClose();
    }
  }

  return (
    <Flex as="form" onSubmit={handleSubmit(handleAddCountry)} w="100%" justify="center">
      <VStack spacing="5" my="10">
        <Input type="text" name="name" label="Nome" error={errors.name} {...register("name", formValidations.name)}/>

        <Input type="text" name="languages" label="Língua(s) oficial(is)" error={errors.languages} {...register("languages", formValidations.language)}/>

        <FileInput
          name="image"
          placeholder="Adicione uma imagem da bandeira do pais"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <InputGroup justifyContent="center" pt="5">
          <Button colorScheme="red" onClick={onClose}>Cancelar</Button>
          <Button type="submit" colorScheme="yellow" color="white" ml="5" isLoading={isLoading}>Adicionar</Button>
        </InputGroup>

      </VStack>
    </Flex>
  )
}