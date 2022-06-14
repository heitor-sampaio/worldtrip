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

interface ImagesQueryResponse {
  after?: {
    id: string;
  };
  data: {
    data: {
      url: string;
      userId: string
    };
    ts: number;
    ref: {
      id: string;
    };
  }[];
}

export default async function imagesHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await cors(req, res);

  if (req.method === 'POST') {
    const { url, owner } = req.body;

    const id = uuid()

    return fauna
      .query(
        q.Create(q.Collection('images'), {
          data: {
            id,
            url,
            owner,
          },
        })
      )
      .then((response) => {
        return res.status(201).json({ imageData: response });
      })
      .catch(err =>
        res
          .status(501)
          .json({ error: `Sorry something Happened in image add! ${err.message}` })
      );
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}
