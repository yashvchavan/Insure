// middleware/adminAuth.ts
import { NextApiRequest, NextApiResponse } from 'next';

export const authenticateAdmin = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Check if the admin is authenticated (e.g., by checking cookies or session)
  const isAuthenticated = true; // Replace with your authentication logic

  if (!isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return handler(req, res);
};