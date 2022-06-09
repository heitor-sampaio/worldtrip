/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../types/User'

import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body

    try {
      const response: any = await fauna.query(
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            email
          )
        )
      )

      const user: User = response.data
      
      if (user.password === password) {
        const userData = user

        delete userData.password

        return res.status(200).json(userData)
      } else {
        return res.status(401).json({ error: "Wrong email/password"})
      }
    } catch (error) {
      console.log(error)

      return res.status(500).json({ error })
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allow')
  }
}