// pages/api/admin-register.ts
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { AdminRegisterRequest, AdminRegisterResponse } from '@/types/adminRegister';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminRegisterResponse>
) {
  if (req.method === 'POST') {
    const { companyName, email, phone, address, password, insuranceTypes, termsAndConditions } = req.body as AdminRegisterRequest;

    // Validate input
    if (!companyName || !email || !phone || !address || !password || !insuranceTypes || !termsAndConditions) {
      return res.status(400).json({ message: 'All fields are required' });
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

      // Check if the admin already exists
      const existingAdmin = await adminsCollection.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new admin object
      const newAdmin = {
        companyName,
        email,
        phone,
        address,
        password: hashedPassword,
        insuranceTypes,
        termsAndConditions,
        createdAt: new Date(),
      };

      // Insert the new admin into the database
      const result = await adminsCollection.insertOne(newAdmin);
      console.log('Admin inserted:', result.insertedId);

      // Respond with success (excluding the password)
      const { password: _, ...adminWithoutPassword } = newAdmin;
      const adminResponse = { id: result.insertedId.toString(), ...adminWithoutPassword };
      res.status(201).json({ message: 'Admin registered successfully', admin: adminResponse });
    } catch (error) {
      console.error('Registration error:', error);
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