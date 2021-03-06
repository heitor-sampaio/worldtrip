import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '../../../../lib/init-middleware';
import { fauna } from "../../../../services/fauna";
import { query as q } from 'faunadb'
import { User } from '../../../../types';
import { api } from '../../../../services/api';
import * as jose from 'jose'

const cors = initMiddleware(
  Cors({
    methods: ['PUT'],
  })
);

export default async function favourtitesCitiesHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await cors(req, res);

  const token = req.cookies['@worldtrip.token']

  const secret = process.env.JWT_SECRET

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  )

  const user = payload.user as User

  res.removeHeader('user')

  if (req.method === 'PUT') {
    const { cityId } = req.body;
    try {
      await fauna.query(
        q.Let(
          {
            user: q.Get(q.Match(q.Index("user_by_id"), user.id)),
            userRef: q.Select(['ref'], q.Var('user')),
            city: q.ToString(cityId),
            favouritesCities: q.Select(["data", "favourites", "cities"], q.Var("user")),
            updatedFavouritesCities: q.If(
              q.ContainsValue(q.Var('city'), q.Var("favouritesCities")),
              q.Filter(q.Var("favouritesCities"), q.Lambda("i", q.Not(q.Equals(q.Var("i"), q.Var('city'))))),
              q.Append(q.Var("city"), q.Var("favouritesCities")),
        )
          },
          {
            updatedFavourites: q.Update(q.Var('userRef'), {
              data: {
                favourites: {
                  cities: q.Var('updatedFavouritesCities')
                }
              }
            })
          }
        )
      )

      return res.status(200).json({ message: 'Success' })
    } catch(err) {
      return res.status(501).json({ error: `Sorry something Happened! ${err.message} : ${err.errors()[0].description}` })
    }
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}