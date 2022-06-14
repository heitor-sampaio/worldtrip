export const defaultPermissions = {
  continents: {
    view: true,
    edit: false,
    delete: false,
  },
  cities: {
    view: true,
    edit: false,
    create: false,
    delete: false,
    favourite: true
  },
  attractions: {
    view: true,
    edit: false,
    create: false,
    delete: false,
    favourite: true
  },
  images: {
    create: false,
    delete: false,
  },
  travelPlans: {
    create: true,
    edit: true,
    delete: true,
  },
  social: {
    comment: {
      create: true,
      edit: true,
      delete: true,
    },
    react: true,
    share: true,
  }
}

