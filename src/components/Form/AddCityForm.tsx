import { VStack, Flex, InputGroup, Button, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileInput, Input, Select } from '../../components/Form/components'
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { CityFormatted, ContinentFormatted, CountryFormatted } from "../../types";

interface AddCityFormProps {
  continent: ContinentFormatted,
  countries: CountryFormatted[]
  onClose: () => void,
  onAddCity: (city: CityFormatted) => void
}

type AddCityFormData = {
  name: string,
  country: string,
}

export default function AddCityForm({continent, countries, onClose, onAddCity}: AddCityFormProps) {
  const { register, handleSubmit, formState: {errors, isSubmitting}, setError, trigger, reset} = useForm();
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
    country: {
      required: true,
    },
  };

  const handleAddCity: SubmitHandler<AddCityFormData> = async (data, event) => {
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

      const { name, country } = data;

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

      const newCity = {
        name,
        continentRef: continent.id,
        countryRef: country,
        cityImgUrl: imageUrl,
        addedBy
      }
      
      const cityData = await api.post('/cities', newCity)

      if (cityData.status !== 201) {
        throw new Error()
      }

      await onAddCity(cityData.data.newCity)

      toast({
        title: 'Cidade adicionada',
        description: 'A cidade foi adicionada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a cidade.',
        status: 'error',
        duration: 2000,
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
    <Flex as="form" onSubmit={handleSubmit(handleAddCity)} direction="column" w="100%" justify="center">

      <VStack spacing="5" my="10">

        <Input type="text" name="name" label="Nome" error={errors.name} {...register("name", formValidations.name)}/>

        <Select placeholder="Escolha o país" label="País" error={errors.country} {...register("country", formValidations.country)}>
          { countries.map(country => {
            return (
              <option key={country.id} value={country.id}>{country.name}</option>
            )
          })}
        </Select>

        <FileInput
          name="image"
          placeholder="Adicione uma imagem da cidade"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <Flex direction="column" fontSize={'sm'} mt="4" color="gray.400">
          <Text fontWeight={'bold'}>Dica: Não encontrou o país que procurava?</Text>
          <Text>Você mesmo pode adiciona-lo voltando ao menu anterior e selicionando a opção `País`!</Text>
        </Flex>

        <InputGroup justifyContent="center" pt="5">
          <Button colorScheme="red" onClick={onClose}>Cancelar</Button>
          <Button type="submit" colorScheme="yellow" color="white" ml="5" isLoading={isLoading}>Adicionar</Button>
        </InputGroup>

      </VStack>

    </Flex>
  )
}