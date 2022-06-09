/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
import { useAuth } from '../../../contexts/AuthContext';

import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {email, password, fullName, exibitionName, roles} = req.body;

    try {
      await fauna.query(
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
              email,
              password,
              fullName,
              exibitionName,
              roles
            }}
          ),
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )
        )
      )

      return res.status(200).json({createdUser: { email, password, fullName }})
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allow')
  }
}