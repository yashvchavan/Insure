import { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB!

interface Application {
  applicationId: string
  policyId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status: string
  createdAt: Date
  startDate?: Date
  coverageAmount?: string
  paymentFrequency?: string
  // Add other application fields as needed
}

interface Policy {
  policyId: string
  name: string
  provider: string
  description?: string
  premium?: number
  // Add other policy fields as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid application ID' })
  }

  let client: MongoClient | null = null

  try {
    client = await MongoClient.connect(MONGODB_URI)
    const db = client.db(MONGODB_DB)
    
    // 1. Fetch the application
    const application = await db.collection<Application>('applications').findOne({
      applicationId: id
    })

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      })
    }

    // 2. Fetch the associated policy details
    let policyDetails: Policy | null = null
    if (application.policyId) {
      policyDetails = await db.collection<Policy>('policies').findOne({
        policyId: application.policyId
      })
    }

    // 3. Prepare the response with combined data
    const responseData = {
      // Application data
      ...application,
      // Policy details (if found)
      ...(policyDetails && {
        policyName: policyDetails.name,
        insuranceCompany: policyDetails.provider,
        policyDescription: policyDetails.description,
        basePremium: policyDetails.premium
      }),
      // Convert dates to ISO strings
      createdAt: application.createdAt.toISOString(),
      ...(application.startDate && { 
        startDate: new Date(application.startDate).toISOString() 
      })
    }

    return res.status(200).json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Error fetching application:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    })
  } finally {
    if (client) {
      await client.close()
    }
  }
}