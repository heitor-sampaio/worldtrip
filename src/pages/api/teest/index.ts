/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      return res.status(200).json({post: true})
    } catch (error) {
      console.log(error)

      return res.status(500).json({ error })
    }
  }

  if (req.method === 'GET') {
    try {
        return res.status(200).json({get: true})
    } catch (error) {
      console.log(error)

      return res.status(500).json({ error })
    }
  }

 
  return res.status(405).end('Method not allow')
}