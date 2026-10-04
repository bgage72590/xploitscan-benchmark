// create-next-app's Pages Router scaffold. It touches no data, and every
// Pages Router app starts with it.
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { name: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });
}
