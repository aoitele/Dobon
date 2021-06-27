// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.query.status === "400") {
    res.statusCode = 400;
    res.end();
    return;
  }

  if (req.query.status === "302") {
    res.redirect(302, "/redirect302");
    res.end();
    return;
  }
    
  res.status(200).json({ name: 'John Doe' })
}
