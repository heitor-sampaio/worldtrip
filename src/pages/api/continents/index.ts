/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';

import { fauna } from "../../../services/fauna";
import { CityRaw, ContinentRaw, CountryRaw } from '../../../types';

interface QueryResponse {
  continent: ContinentRaw,
  countries: CountryRaw[],
  cities: CityRaw[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { continent: slug } = req.query

    if (slug) {
      try {
        const data: QueryResponse = await fauna.query(
          q.Let(
            {
              continent: q.Get(q.Match(q.Index('continent_by_slug'), slug)),
              countries: q.Select(['data', 'countriesRefs'], q.Var('continent')),
              cities: q.Select(['data', 'citiesRefs'], q.Var('continent'))
            },
            {
              continent: q.Var('continent'),
              countries: q.Map(q.Var('countries'), q.Lambda('country', q.Get(q.Match(q.Index('country_by_id'), q.Var('country'))))),
              cities: q.Map(q.Var('cities'), q.Lambda('city', q.Get(q.Match(q.Index('city_by_id'), q.Var('city')))))
            }
          ),
        )

        const formatedContinentData = data.continent.data

        const formatedCountriesData = data.countries.map(country => (country.data))

        const formatedCitiesData = data.cities.map(city => (city.data))

        const response = {continent: formatedContinentData, countries: formatedCountriesData, cities: formatedCitiesData}

        return res.status(200).json(response)
      } catch (err) {
        return res.status(500).json({ error: err.message, msg: err[0]})
      }
    } else {
      try {
        const data: any = await fauna.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('continents'))),
            q.Lambda(x => q.Get(x))
          )
        )

        const formatedContinentsData = data.data.map(continent => (continent.data))

        return res.status(200).json(formatedContinentsData)
      } catch (error) {
        return res.status(500).json({ error })
      }
    }
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allow')
  }
}
