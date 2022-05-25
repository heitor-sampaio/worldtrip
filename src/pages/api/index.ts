import { NextApiRequest, NextApiResponse } from "next"
import { getFakeDbData } from "../../services/fakeDb";

type Query = {
  continent?: string,
  city?: string,
}

export default function Continents(req: NextApiRequest, res: NextApiResponse): any {
  const { continent } = req.query as Query;
  const fakeDbData = getFakeDbData();

  let response;

  if (!continent) {
    response = fakeDbData;
  } else {
    response = fakeDbData.find(item => item.slug === continent);
  }

  if (!response) {
    res.status(404).send({ error: "Continent not found"});
  } else {
    res.status(200).json(response);
  }
}