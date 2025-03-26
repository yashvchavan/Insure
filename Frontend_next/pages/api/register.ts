// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { RegisterRequest, RegisterResponse } from '../../types/register';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method === 'POST') {
    const { username, name, email, password, phone } = req.body as RegisterRequest;

    // Validate input
    if (!username || !name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Connect to MongoDB
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
      await client.connect();
      const db = client.db('InsureEase'); // Use the default database from the connection string
      const usersCollection = db.collection('users');

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const newUser = {
        username,
        name,
        email,
        password: hashedPassword,
        phone,
        createdAt: new Date(),
      };

      // Insert the new user into the database
      const result = await usersCollection.insertOne(newUser);

      // Respond with success (excluding the password)
      const { password: _, ...userWithoutPassword } = newUser;
      const userWithId = { id: result.insertedId.toString(), ...userWithoutPassword };
      res.status(201).json({ message: 'User registered successfully', user: userWithId });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}