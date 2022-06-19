import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';
import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb'
import { v4 as uuid } from 'uuid'
import { CityRaw, CountryRaw } from '../../../types';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST'],
  })
);

export default async function countriesHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await cors(req, res);

  if (req.method === 'POST') {
    const { 
      name,
      languages,
      continentRef,
      countryImgUrl,
      addedBy 
    } = req.body;

    const id = uuid()

    const formattedName = name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

    const slug = name.replace(/\s/g, '-').toLowerCase()

    try {
      const data = await fauna.query(
        q.Let(
          {
            continent: q.Get(q.Match(q.Index("continent_by_id"),continentRef)),
            continentRef: q.Select(["ref"], q.Var("continent")),
            continentCountriesRefs: q.Select(["data", "countriesRefs"], q.Var("continent")),
            updatedContinentCountriesRefs: q.Append(id, q.Var("continentCountriesRefs")),
          },
          {
            country: q.Create(q.Collection('countries'), {
              data: {
                id,
                slug,
                name: formattedName,
                languages,
                continentRef,
                countryImgUrl,
                addedBy
              },
            }),
            continentUpdate: q.Update(q.Var("continentRef"), {
              data: {
                countriesRefs: q.Var("updatedContinentCountriesRefs")
              }
            })
          }
        )
      ) as any

      const newCountry = data.country.data as CountryRaw

      return res.status(201).json({ newCountry })
    } catch(err) {
      return res.status(501).json({ error: `Sorry something Happened! ${err.message}` })
    }
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}
