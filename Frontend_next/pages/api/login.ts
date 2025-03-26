// pages/api/login.ts
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { LoginRequest, LoginResponse } from '@/types/login';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method === 'POST') {
    const { username, password } = req.body as LoginRequest;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
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

      const db = client.db('InsureEase'); // Use the `insureease` database
      const usersCollection = db.collection('users'); // Use the `users` collection

      // Find the user by username
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Respond with success (excluding the password)
      const { password: _, _id, username:any, name, email, phone } = user;
      const userWithoutPassword = {
        id: _id.toString(),
        username,
        name,
        email,
        phone,
      };
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
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