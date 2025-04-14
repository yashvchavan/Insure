import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB;

export async function POST(request: Request) {
  const { userId, token, newPin } = await request.json();

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    // Verify token
    const tokenData = await db.collection('pinResetTokens').findOne({
      token,
      userId,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenData) {
      client.close();
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user's PIN
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { vaultPin: newPin } }
    );

    // Mark token as used
    await db.collection('pinResetTokens').updateOne(
      { token },
      { $set: { used: true } }
    );

    client.close();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming PIN reset:', error);
    return NextResponse.json(
      { success: false, error: "Failed to reset PIN" },
      { status: 500 }
    );
  }
}