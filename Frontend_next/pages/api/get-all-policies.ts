import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log('MongoDB URI:', process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('InsureEase');
    const policiesCollection = db.collection('policies');
    const categoriesCollection = db.collection('categories');

    // Fetch all policies
    const allPolicies = await policiesCollection.find({}).toArray();

    // Fetch category information
    const categories = await categoriesCollection.find({}).toArray();

    // Create a map to store the result in the desired format
    const result: Record<string, any> = {};

    // Process each category
    for (const category of categories) {
      const categoryPolicies = allPolicies.filter(policy => policy.category === category.name);

      // Transform policies into the companies format
      const companies = categoryPolicies.map(policy => ({
        id: policy._id.toString(),
        name: policy.name,
        rating: policy.rating || 4.5, // Default rating if not specified
        featuredPolicy: policy.featuredPolicy || `${policy.name} Plan`,
        coverage: policy.coverage || "$500K", // Default coverage if not specified
        startingAt: policy.startingAt || "$100/month", // Default price if not specified
        image: policy.image
      }));

      // Add category to result
      result[category.name.toLowerCase()] = {
        title: category.displayName || `${category.name} Insurance`,
        description: category.description || `Comprehensive coverage for ${category.name} needs`,
        icon: category.icon || "🏢",
        color: category.color || "from-gray-500 to-gray-700",
        companies
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching policies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
}