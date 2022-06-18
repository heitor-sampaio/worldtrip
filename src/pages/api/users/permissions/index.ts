/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';

import { fauna } from "../../../../services/fauna";
import { User } from '../../../../types';
import * as jose from 'jose'

export default async (request: NextApiRequest, res: NextApiResponse) => {
  const token = request.cookies['@worldtrip.token']

  const secret = process.env.JWT_SECRET

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  )

  const user = payload.user as User

  if (request.method === 'PUT') {
    const { permissionsToUpdate } = request.body;

    const updatedUserPermissions = user.permissions
    
    Object.assign(updatedUserPermissions, permissionsToUpdate)

    try {
      await fauna.query(
        q.Let(
          {
            user: q.Get(q.Match(q.Index("user_by_id"), user.id)),
            userRef: q.Select(['ref'], q.Var('user')),
            userPermissions: q.Select(["data", "permissions"], q.Var("user"))
          },
          {
            updatedUserPermissions: q.Update(q.Var('userRef'), {
              data: {
                permissions: updatedUserPermissions
              }
            })
          }
        )
      )

      return res.status(200).json({ message: 'Success' })
    } catch(err) {
      return res.status(501).json({ error: `Sorry something Happened! ${err.message}` })
    }
  }

  return res.status(405).end('Method not allow')
}