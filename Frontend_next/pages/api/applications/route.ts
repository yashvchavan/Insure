// src/app/api/applications/route.ts
import { NextResponse } from 'next/server';
// src/lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';
import { ApplicationData } from '@/types/application';
// Replace with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/InsureEase';
const MONGODB_DB = process.env.MONGODB_DB || 'InsureEase';

// MongoDB connection cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
export async function connectToDatabase() {
    // Check if we have cached connection
    if (cachedClient && cachedDb) {
      return { client: cachedClient, db: cachedDb };
    }
  
    // Create new MongoDB client
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
  
    // Cache the client and database connections
    cachedClient = client;
    cachedDb = db;
  
    return { client, db };
  }


export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Create application object with timestamps
    const application: ApplicationData = {
      ...body,
      status: 'under_review',
      applicationId: `APP-${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    const result = await db.collection('purchases').insertOne(application);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: application.applicationId,
        submittedOn: application.createdAt 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const email = searchParams.get('email');

    if (!applicationId && !email) {
      return NextResponse.json(
        { message: 'Missing search parameters' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Create query based on provided parameters
    const query: any = {};
    if (applicationId) query.applicationId = applicationId;
    if (email) query.email = email;

    const applications = await db.collection('purchases')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}