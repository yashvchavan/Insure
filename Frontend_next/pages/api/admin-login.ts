// pages/api/admin-login.ts
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { AdminLoginRequest, AdminLoginResponse } from '../../types/adminLogin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminLoginResponse>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body as AdminLoginRequest;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Log the MongoDB URI for debugging
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'MongoDB connection string is missing' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      console.log('Connected to MongoDB');

      const db = client.db('InsureEase'); // Use the `InsureEase` database
      const adminsCollection = db.collection('admins'); // Use the `admins` collection

      // Find the admin by email
      const admin = await adminsCollection.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Respond with success (excluding the password)
      // const { password: _, _id, email:any, name } = admin;
      // const adminWithoutPassword = {
      //   id: _id.toString(),
      //   email,
      //   name,
      // };
      console.log('Admin login successful:', admin);
      const adminWithoutPassword = {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
      };
      res.status(200).json({ message: 'Login successful', admin: adminWithoutPassword });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
      console.log('MongoDB connection closed');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}