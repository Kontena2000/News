
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PromptLog } from "@/types/settings";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Define types for our mock client's query builders
type MockQueryResult<T> = {
  data: T | null;
  error: any | null;
};

// Connection status tracking
let connectionStatus: "connected" | "disconnected" | "error" | "initializing" = "initializing";
let connectionError: Error | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create a fallback client if environment variables are not set
let supabase: SupabaseClient | any;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock mode for development.");
    connectionStatus = "disconnected";
    
    // Create a mock client for development with a simpler approach
    // that avoids recursive type definitions
    supabase = createMockClient();
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    testConnection().then(isConnected => {
      connectionStatus = isConnected ? "connected" : "error";
    }).catch(error => {
      connectionStatus = "error";
      connectionError = error;
      console.error("Failed to connect to Supabase:", error);
      
      // Fall back to mock client
      supabase = createMockClient();
    });
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  connectionStatus = "error";
  connectionError = error instanceof Error ? error : new Error(String(error));
  
  // Fallback to mock client
  supabase = createMockClient();
}

// Helper function to create a mock client
function createMockClient() {
  return {
    from: (table: string) => {
      // Create a base query object with chainable methods
      const baseQuery = {
        // Data manipulation methods
        select: () => ({ ...baseQuery, then: mockThen }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ ...baseQuery, then: mockThen }),
        delete: () => ({ ...baseQuery, then: mockThen }),
        
        // Filter methods
        eq: () => ({ ...baseQuery, then: mockThen }),
        lt: () => ({ ...baseQuery, then: mockThen }),
        or: () => ({ ...baseQuery, then: mockThen }),
        
        // Pagination/ordering
        order: () => ({ ...baseQuery, then: mockThen }),
        limit: () => ({ ...baseQuery, then: mockThen }),
        
        // Promise-like behavior
        then: mockThen
      };
      
      return baseQuery;
    }
  };
}

// Helper function for mock promise behavior
function mockThen(onfulfilled?: any) {
  return Promise.resolve(
    onfulfilled ? onfulfilled({ data: [], error: null }) : { data: [], error: null }
  );
}

// Test connection to Supabase
async function testConnection(): Promise<boolean> {
  try {
    // Simple query to test connection
    const { error } = await supabase.from("prompt_logs").select("id").limit(1);
    return !error;
  } catch (error) {
    console.error("Error testing Supabase connection:", error);
    return false;
  }
}

// Retry mechanism for failed operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
}

// Get connection status
export const getConnectionStatus = () => ({
  status: connectionStatus,
  error: connectionError
});

export { supabase };

/**
 * Saves a prompt log to Supabase
 */
export const savePromptLog = async (promptLog: PromptLog): Promise<void> => {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. Prompt log not actually saved.");
    return;
  }
  
  try {
    await retryOperation(async () => {
      const { error } = await supabase
        .from("prompt_logs")
        .insert([promptLog]);
      
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    console.error("Error saving prompt log to Supabase:", error);
    // Don't throw in production to prevent UI crashes
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
};

/**
 * Retrieves prompt logs from Supabase
 */
export const getPromptLogs = async (
  limit: number = 50,
  provider?: "perplexity" | "openai" | "anthropic"
): Promise<PromptLog[]> => {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. Returning mock prompt logs.");
    // Return mock data when in mock mode
    return getMockPromptLogs(limit, provider);
  }
  
  try {
    return await retryOperation(async () => {
      let query: any = supabase
        .from("prompt_logs")
        .select("*");
      
      if (provider) {
        if (typeof query.eq === 'function') {
          query = query.eq("provider", provider);
        }
      }
      
      if (typeof query.order === 'function') {
        query = query.order("timestamp", { ascending: false });
      }
      
      if (typeof query.limit === 'function') {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as PromptLog[];
    });
  } catch (error) {
    console.error("Error retrieving prompt logs from Supabase:", error);
    // Return mock data on error to prevent UI crashes
    return getMockPromptLogs(limit, provider);
  }
};

/**
 * Updates the article count for a prompt log
 */
export const updatePromptLogArticleCount = async (
  logId: string,
  articleCount: number
): Promise<void> => {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. Prompt log not actually updated.");
    return;
  }
  
  try {
    await retryOperation(async () => {
      let query: any = supabase
        .from("prompt_logs")
        .update({ articleCount });
      
      if (typeof query.eq === 'function') {
        query = query.eq("id", logId);
      }
      
      const { error } = await query;
      
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    console.error("Error updating prompt log article count:", error);
    // Don't throw in production to prevent UI crashes
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
};

/**
 * Deletes prompt logs older than the specified number of days
 */
export const deleteOldPromptLogs = async (
  retentionDays: number = 30
): Promise<void> => {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. No prompt logs deleted.");
    return;
  }
  
  try {
    await retryOperation(async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      let query: any = supabase
        .from("prompt_logs")
        .delete();
      
      if (typeof query.lt === 'function') {
        query = query.lt("timestamp", cutoffDate.toISOString());
      }
      
      const { error } = await query;
      
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    console.error("Error deleting old prompt logs:", error);
    // Don't throw in production to prevent UI crashes
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
};

/**
 * Searches prompt logs by content
 */
export const searchPromptLogs = async (
  searchTerm: string,
  limit: number = 50
): Promise<PromptLog[]> => {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. Performing client-side search on mock data.");
    // Perform client-side search on mock data
    const mockLogs = getMockPromptLogs(100);
    return mockLogs.filter(log => 
      log.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, limit);
  }
  
  try {
    return await retryOperation(async () => {
      let query: any = supabase
        .from("prompt_logs")
        .select("*");
      
      if (typeof query.or === 'function') {
        query = query.or(`originalPrompt.ilike.%${searchTerm}%,enhancedPrompt.ilike.%${searchTerm}%`);
      }
      
      if (typeof query.order === 'function') {
        query = query.order("timestamp", { ascending: false });
      }
      
      if (typeof query.limit === 'function') {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as PromptLog[];
    });
  } catch (error) {
    console.error("Error searching prompt logs:", error);
    // Perform client-side search on mock data as fallback
    const mockLogs = getMockPromptLogs(100);
    return mockLogs.filter(log => 
      log.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, limit);
  }
};

/**
 * Checks if Supabase connection is healthy
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (connectionStatus === "disconnected") {
    return false;
  }
  
  try {
    return await testConnection();
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return false;
  }
};

/**
 * Get mock prompt logs for development and fallback
 */
function getMockPromptLogs(
  limit: number = 50,
  provider?: "perplexity" | "openai" | "anthropic"
): PromptLog[] {
  const mockLogs: PromptLog[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      originalPrompt: "Find news about HPC innovations in the last week",
      enhancedPrompt: "Enhanced prompt with context about HPC innovations...",
      provider: "perplexity",
      articleCount: 12,
      status: "success"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      originalPrompt: "Latest developments in Bitcoin mining efficiency",
      enhancedPrompt: "Enhanced prompt with context about Bitcoin mining...",
      provider: "perplexity",
      articleCount: 8,
      status: "success"
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      originalPrompt: "AI advancements in natural language processing",
      enhancedPrompt: "Enhanced prompt with context about NLP advancements...",
      provider: "openai",
      articleCount: 15,
      status: "success"
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      originalPrompt: "Quantum computing breakthroughs this month",
      enhancedPrompt: "Enhanced prompt with context about quantum computing...",
      provider: "anthropic",
      articleCount: 6,
      status: "success"
    }
  ];
  
  if (provider) {
    return mockLogs.filter(log => log.provider === provider).slice(0, limit);
  }
  
  return mockLogs.slice(0, limit);
}
