import { redirect } from 'next/navigation';
import { MongoClient } from 'mongodb';
import ResetPinForm from '../../components/ResetPinForm';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB;

export default async function ResetPinPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    redirect('/vault');
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  
  const tokenData = await db.collection('pinResetTokens').findOne({
    token: searchParams.token,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!tokenData) {
    client.close();
    redirect('/vault?error=invalid_token');
  }

  client.close();
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Reset Your Vault PIN</h1>
      <ResetPinForm userId={tokenData.userId} token={searchParams.token} />
    </div>
  );
}