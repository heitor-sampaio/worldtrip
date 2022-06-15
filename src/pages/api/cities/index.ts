import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';
import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb'
import { v4 as uuid } from 'uuid'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST'],
  })
);

export default async function citiesHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await cors(req, res);

  if (req.method === 'POST') {
    const { 
      name,
      continentRef,
      countryRef,
      cityImgUrl,
      addedBy 
    } = req.body;

    const id = uuid()

    const formattedName = name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

    const slug = name.replace(/\s/g, '-').toLowerCase()

    try {
      const data = await fauna.query(
        q.Let(
          {
            continent: q.Get(q.Match(q.Index("continent_by_id"),continentRef)
            ),
            continentRef: q.Select(["ref"], q.Var("continent")),
            continentCitiesRefs: q.Select(["data", "citiesRefs"], q.Var("continent")),
            updatedContinentCitiesRefs: q.Append(id, q.Var("continentCitiesRefs")),

            country: q.Get(q.Match(q.Index("country_by_id"), countryRef)),
            countryRef: q.Select(["ref"], q.Var("country")),
            countryCitiesRefs: q.Select(["data", "citiesRefs"], q.Var("country")),
            updatedCountryCitiesRefs: q.Append(id, q.Var("countryCitiesRefs"))
          },
          {
            city: q.Create(q.Collection('cities'), {
              data: {
                id,
                slug,
                name: formattedName,
                continentRef,
                countryRef,
                cityImgUrl,
                addedBy
              },
            }),
            continentUpdate: q.Update(q.Var("continentRef"), {
              data: {
                citiesRefs: q.Var("updatedContinentCitiesRefs")
              }
            }),
            countryUpdate: q.Update(q.Var("countryRef"), {
              data: {
                citiesRefs: q.Var("updatedCountryCitiesRefs")
              }
            })
          }
        )
      )

      return res.status(201).json({ success: true })
    } catch(err) {
      return res.status(501).json({ error: `Sorry something Happened! ${err.message}` })
    }
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}
