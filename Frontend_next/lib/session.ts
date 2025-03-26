// lib/session.ts
import { NextApiRequest, NextApiResponse } from 'next';

export const destroySession = async (req: NextApiRequest, res: NextApiResponse) => {
  // Clear the session cookie
  res.setHeader(
    'Set-Cookie',
    'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
  );
};