
import { NewsSettings } from "@/types/settings";

// Initialize Pinecone client
const pineconeApiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY || "";
const pineconeEnvironment = process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT || "";
const pineconeIndex = process.env.NEXT_PUBLIC_PINECONE_INDEX || "";

// Type definitions for Pinecone client
type PineconeClient = any;
type PineconeIndex = any;
type PineconeMatch = {
  id: string;
  score: number;
  metadata?: Record<string, any>;
};
type PineconeQueryResponse = {
  matches?: PineconeMatch[];
};

// Flag to determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a mock Pinecone client for client-side usage
const createMockPineconeClient = () => {
  return {
    index: (indexName: string) => createMockPineconeIndex()
  };
};

// Create a mock Pinecone index for client-side usage
const createMockPineconeIndex = () => {
  return {
    query: async ({ vector, topK, includeMetadata }: any) => {
      return {
        matches: Array(topK || 3).fill(0).map((_, i) => ({
          id: `mock-id-${i}`,
          score: Math.random(),
          metadata: {
            title: `Mock Document ${i}`,
            content: `This is a mock document content for testing purposes.`
          }
        }))
      };
    },
    upsert: async (vectors: any[]) => {
      return { upsertedCount: vectors.length };
    },
    deleteOne: async (id: string) => {
      return { success: true };
    },
    describeIndexStats: async () => {
      return { 
        namespaces: {},
        dimension: 1536,
        indexFullness: 0,
        totalVectorCount: 0
      };
    }
  };
};

// Use a factory pattern to create the appropriate client based on environment
const createPineconeClient = async (): Promise<PineconeClient> => {
  // Always use mock client in browser environment
  if (isBrowser) {
    console.warn("Browser environment detected. Using mock Pinecone client.");
    return createMockPineconeClient();
  }
  
  // Server-side only code
  try {
    // Dynamic import only on server side
    const { Pinecone } = await import('@pinecone-database/pinecone');
    
    return new Pinecone({
      apiKey: pineconeApiKey,
    });
  } catch (error) {
    console.error("Error initializing Pinecone client:", error);
    return createMockPineconeClient();
  }
};

// Singleton pattern for client instance
let pineconeClientPromise: Promise<PineconeClient> | null = null;

/**
 * Initialize the Pinecone client
 */
export const initPinecone = async (): Promise<PineconeClient> => {
  if (!pineconeClientPromise) {
    pineconeClientPromise = createPineconeClient();
  }
  return pineconeClientPromise;
};

/**
 * Get the Pinecone index
 */
export const getPineconeIndex = async (): Promise<PineconeIndex> => {
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
    }) as PineconeQueryResponse;
    
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
