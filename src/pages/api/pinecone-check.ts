
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pinecone } from '@pinecone-database/pinecone';

type ResponseData = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Initialize Pinecone client
    const pineconeApiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY || "";
    const pineconeIndex = process.env.NEXT_PUBLIC_PINECONE_INDEX || "";

    if (!pineconeApiKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pinecone API key not configured' 
      });
    }

    // Create Pinecone client
    const pinecone = new Pinecone({
      apiKey: pineconeApiKey,
    });

    // Get index
    const index = pinecone.index(pineconeIndex);
    
    // Check if index exists by performing a simple operation
    await index.describeIndexStats();
    
    // If we get here, the connection was successful
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully connected to Pinecone' 
    });
  } catch (error) {
    console.error('Error checking Pinecone connection:', error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error connecting to Pinecone' 
    });
  }
}
