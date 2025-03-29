import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider } = req.query;

  // Check if provider is a valid ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(provider as string);
  
  const client = new MongoClient(process.env.MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db('InsureEase');
    const policiesCollection = db.collection('policies');
    
    // Create query based on whether provider is ObjectId or name
    const query = isObjectId 
      ? { _id: new ObjectId(provider as string), status: 'active' }
      : { provider: provider, status: 'active' };

    const policies = await policiesCollection.find(query).toArray();

    if (policies.length === 0) {
      return res.status(404).json({ 
        error: 'No policies found',
        query: query // For debugging
      });
    }

    // Transform data
    const companyData = {
      id: provider,
      name: policies[0].provider || provider, // Use provider field from document
      category: policies[0].category,
      logo: policies[0].image || "/images/placeholder.png",
      rating: 4.5,
      reviews: 100,
      description: policies[0].description || `${policies[0].provider} insurance services`,
      contact: {
        phone: "+1 (800) 123-4567",
        email: `contact@${String(policies[0].provider).toLowerCase().replace(/\s+/g, '')}.com`,
        website: `www.${String(policies[0].provider).toLowerCase().replace(/\s+/g, '')}.com`
      },
      policies: policies.map(policy => ({
        id: policy._id.toString(),
        name: policy.name,
        description: policy.description,
        coverage: policy.coverageAmount,
        premium: policy.premium,
        term: policy.tenureYears ? `${policy.tenureYears} years` : undefined,
        benefits: policy.features || [],
        popular: policy.isPopular || false
      })),
      testimonials: []
    };

    return res.status(200).json(companyData);
  } catch (error) {
    console.error('Error fetching policies:', error);
    return res.status(500).json({ 
      error: 'Internal server error'
    });
  } finally {
    await client.close();
  }
}