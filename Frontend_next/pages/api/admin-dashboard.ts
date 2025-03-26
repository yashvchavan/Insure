// pages/api/admin-dashboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateAdmin } from '@/middleware/adminAuth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: 'This is a protected admin route' });
};

export default authenticateAdmin(handler);