/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
import decode from 'jwt-decode'
import { v4 as uuid } from 'uuid'

import { fauna } from "../../../services/fauna";
import { defaultPermissions } from '../../../config/permissions';
import { Token } from '../../../types';
import { generateJWT } from '../../../lib/generateJWT';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {email, password, fullName, exibitionName} = req.body;
    const id = uuid()
    const roles = ['user']
    const permissions = defaultPermissions
    const favourites = {
      cities: [],
      attatractions: [],
      travelPlans: []
    }
    const likes = 0    

    try {
      const createdUser = await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          ),
          q.Create(
            q.Collection('users'),
            {data : {
              id,
              email,
              password,
              fullName,
              exibitionName,
              roles,
              permissions,
              favourites,
              likes
            }}
          ),
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )
        )
      ).then((res) => res)

      return res.status(200).json({createdUser})
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  if (req.method === 'GET') {
    try {
      const { authorization } = req.headers

      if (!authorization) {
        return res
          .status(401)
          .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
      }

      const [, token] = authorization?.split(' ');

      if (!token) {
        return res 
          .status(401)
          .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
      }

      const decoded = decode(token as string) as Token;

      const email = decoded.sub

      const response: any = await fauna.query(
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            q.Casefold(email)
          )
        )
      )

      const user = response.data

      delete user.password

      const newToken = generateJWT(user.email, {user})

      return res.status(200).json({user, newToken})
    } catch {
      return res.status(404).json({error: 'User not found'})
    }
  }

  return res.status(405).end('Method not allow')
}