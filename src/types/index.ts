import { values } from "faunadb";

export type FaunaRef = values.Ref

export type Permissions = {
  continents: {
    view: boolean,
    edit: boolean,
    delete: boolean,
  },
  cities: {
    view: boolean,
    edit: boolean,
    create: boolean,
    delete: boolean,
    favourite: boolean
  },
  attractions: {
    view: boolean,
    edit: boolean,
    create: boolean,
    delete: boolean,
    favourite: boolean
  },
  images: {
    create: boolean,
    delete: boolean,
  },
  travelPlans: {
    create: boolean,
    edit: boolean,
    delete: boolean,
    favourite: boolean
  },
  social: {
    comment: {
      create: boolean,
      edit: boolean,
      delete: boolean,
    },
    react: boolean,
    share: boolean,
  }
}

export type User = {
  id: string,
  email: string,
  password?: string,
  fullName: string,
  exibitionName: string,
  roles: string[],
  permissions: Permissions,
  favourites: Favourites,
  likes: number
}

export type ContinentRaw = {
  ref: FaunaRef,
  ts: string,
  data: {
    id: string,
    slug: string,
    continentName: string,
    continentShortDescription: string,
    continentFullDescription: string,
    imgUrl: string,
    countriesRefs: string[],
    citiesRefs: string[]
  }
}

export type ContinentFormatted = {
  id: string,
  slug: string,
  continentName: string,
  continentShortDescription: string,
  continentFullDescription: string,
  imgUrl: string,
  countriesRefs: string[],
  citiesRefs: string[]
}

export type CityRaw = {
  ts: string,
  ref: FaunaRef,
  data: {
    id: string,
    slug: string,
    name: string,
    continentRef: string,
    countryRef: string,
    cityImgUrl: string,
    addedBy: {
      id?: string,
      name?: string
    }
  }
}

export type CityFormatted = {
  id: string,
  slug: string,
  name: string,
  continentRef: string,
  countryRef: string,
  cityImgUrl: string,
  addedBy: {
    id?: string,
    name?: string
  }
}

export type CountryRaw = {
  ref: FaunaRef,
  ts: string,
  data: {
    name: string,
    languages: string[],
    flagImgUrl: string,
    citiesRefs: string[]
    addedBy: {
      id?: string,
      name?: string
    }
  }
}

export type CountryFormatted = {
  id: string,
  name: string,
  languages: string[],
  flagImgUrl: string,
  citiesRefs: string[],
  addedBy: {
    id?: string,
    name?: string
  }
}

export type Favourites = {
  cities: string[],
  attractions: string[],
  travelPlans: string[],
}

export type Token = {
  user: User,
  sub: string,
}
