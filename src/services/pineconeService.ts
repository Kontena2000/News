
import { Pinecone } from "@pinecone-database/pinecone";
import { NewsSettings } from "@/types/settings";

// Initialize Pinecone client
const pineconeApiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY || "";
const pineconeEnvironment = process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT || "";
const pineconeIndex = process.env.NEXT_PUBLIC_PINECONE_INDEX || "";

if (!pineconeApiKey || !pineconeEnvironment || !pineconeIndex) {
  console.error("Pinecone configuration is missing. Please check your environment variables.");
}

let pineconeClient: Pinecone | null = null;

/**
 * Initialize the Pinecone client
 */
export const initPinecone = async (): Promise<Pinecone> => {
  if (pineconeClient) return pineconeClient;
  
  try {
    pineconeClient = new Pinecone({
      apiKey: pineconeApiKey,
      environment: pineconeEnvironment,
    });
    
    return pineconeClient;
  } catch (error) {
    console.error("Error initializing Pinecone client:", error);
    throw error;
  }
};

/**
 * Get the Pinecone index
 */
export const getPineconeIndex = async () => {
  const pinecone = await initPinecone();
  return pinecone.index(pineconeIndex);
};

/**
 * Query the vector database for relevant context
 */
export const queryVectorDB = async (
  query: string,
  settings: NewsSettings,
  topK: number = 5
): Promise<string> => {
  if (!settings.vectorDbEnabled) {
    return "";
  }
  
  try {
    // Initialize Pinecone
    const index = await getPineconeIndex();
    
    // Convert query to vector using an embedding model
    // In a real implementation, you would use an embedding model like OpenAI's
    // For now, we'll use a mock vector
    const mockVector = Array(1536).fill(0).map(() => Math.random() - 0.5);
    
    // Query Pinecone
    const queryResponse = await index.query({
      vector: mockVector,
      topK,
      includeMetadata: true,
    });
    
    // Extract and format context from results
    let context = "";
    
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      context = queryResponse.matches
        .filter(match => match.metadata)
        .map(match => {
          const metadata = match.metadata as Record<string, any>;
          return `${metadata.title || "Untitled"}: ${metadata.content || ""}`;
        })
        .join("\n\n");
    }
    
    return context;
  } catch (error) {
    console.error("Error querying vector database:", error);
    return "";
  }
};

/**
 * Store a document in the vector database
 */
export const storeInVectorDB = async (
  document: {
    id: string;
    title: string;
    content: string;
    metadata?: Record<string, any>;
  }
): Promise<void> => {
  try {
    // Initialize Pinecone
    const index = await getPineconeIndex();
    
    // Convert document to vector using an embedding model
    // In a real implementation, you would use an embedding model like OpenAI's
    // For now, we'll use a mock vector
    const mockVector = Array(1536).fill(0).map(() => Math.random() - 0.5);
    
    // Store in Pinecone
    await index.upsert([{
      id: document.id,
      values: mockVector,
      metadata: {
        title: document.title,
        content: document.content,
        ...document.metadata
      }
    }]);
  } catch (error) {
    console.error("Error storing document in vector database:", error);
    throw error;
  }
};

/**
 * Delete a document from the vector database
 */
export const deleteFromVectorDB = async (documentId: string): Promise<void> => {
  try {
    // Initialize Pinecone
    const index = await getPineconeIndex();
    
    // Delete from Pinecone
    await index.deleteOne(documentId);
  } catch (error) {
    console.error("Error deleting document from vector database:", error);
    throw error;
  }
};

/**
 * Check if the vector database is configured and accessible
 */
export const checkVectorDBConnection = async (): Promise<boolean> => {
  try {
    // Initialize Pinecone
    await initPinecone();
    const index = await getPineconeIndex();
    
    // Check if index exists by performing a simple operation
    await index.describeIndexStats();
    
    return true;
  } catch (error) {
    console.error("Error checking vector database connection:", error);
    return false;
  }
};
