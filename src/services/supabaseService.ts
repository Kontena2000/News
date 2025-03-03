
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PromptLog } from "@/types/settings";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

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
let supabaseAdmin: SupabaseClient | any;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock mode for development.");
    connectionStatus = "disconnected";
    
    // Create a mock client for development with a simpler approach
    // that avoids recursive type definitions
    supabase = createMockClient();
    supabaseAdmin = createMockClient();
  } else {
    // Create regular client with anon key
    supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create admin client with service role key if available
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      console.warn("Supabase service key is missing. Admin operations will be limited.");
      supabaseAdmin = supabase; // Fallback to regular client
    }
    
    // Initialize database tables
    initializeDatabase().then(() => {
      // Test connection after initialization
      return testConnection();
    }).then(isConnected => {
      connectionStatus = isConnected ? "connected" : "error";
    }).catch(error => {
      connectionStatus = "error";
      connectionError = error;
      console.error("Failed to connect to Supabase:", error);
      
      // Fall back to mock client
      supabase = createMockClient();
      supabaseAdmin = createMockClient();
    });
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  connectionStatus = "error";
  connectionError = error instanceof Error ? error : new Error(String(error));
  
  // Fallback to mock client
  supabase = createMockClient();
  supabaseAdmin = createMockClient();
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
    },
    rpc: (fn: string, params?: any) => {
      return Promise.resolve({ data: null, error: null });
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

// Initialize database tables
async function initializeDatabase(): Promise<void> {
  if (connectionStatus === "disconnected") {
    console.warn("Supabase is in mock mode. Database initialization skipped.");
    return;
  }
  
  try {
    // Check if the prompt_logs table exists by attempting to query it
    const { error } = await supabase.from("prompt_logs").select("id").limit(1);
    
    // If there's an error, the table might not exist
    if (error && error.code === "42P01") { // PostgreSQL code for undefined_table
      console.log("Creating prompt_logs table...");
      await createPromptLogsTable();
    } else if (error) {
      console.error("Error checking prompt_logs table:", error);
    } else {
      // Table exists, check if we need to update its structure
      await updatePromptLogsTableIfNeeded();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Create the prompt_logs table
async function createPromptLogsTable(): Promise<void> {
  try {
    // Using Supabase's RPC to execute raw SQL (requires appropriate permissions)
    const { error } = await supabaseAdmin.rpc("create_prompt_logs_table", {
      sql: `
        CREATE TABLE IF NOT EXISTS prompt_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          original_prompt TEXT NOT NULL,
          enhanced_prompt TEXT NOT NULL,
          provider TEXT NOT NULL CHECK (provider IN ('perplexity', 'openai', 'anthropic')),
          article_count INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL CHECK (status IN ('success', 'error')),
          error_message TEXT
        );
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_timestamp ON prompt_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_prompt_logs_provider ON prompt_logs(provider);
      `
    });
    
    if (error) {
      // If RPC fails, the function might not exist or user doesn't have permissions
      console.error("Error creating prompt_logs table via RPC:", error);
      console.log("Please create the table manually using the SQL in the error message.");
      throw error;
    }
  } catch (error) {
    console.error("Failed to create prompt_logs table:", error);
    throw error;
  }
}

// Update the prompt_logs table if needed
async function updatePromptLogsTableIfNeeded(): Promise<void> {
  try {
    // Check if all required columns exist
    const { data, error } = await supabaseAdmin.rpc("check_table_columns", {
      table_name: "prompt_logs",
      required_columns: [
        "id", "timestamp", "original_prompt", "enhanced_prompt", 
        "provider", "article_count", "status", "error_message"
      ]
    });
    
    if (error) {
      // If RPC fails, the function might not exist
      console.error("Error checking prompt_logs columns:", error);
      console.log("Please ensure all required columns exist in the prompt_logs table.");
      return;
    }
    
    // If missing columns are found, add them
    if (data && data.missing_columns && data.missing_columns.length > 0) {
      console.log(`Adding missing columns to prompt_logs: ${data.missing_columns.join(", ")}`);
      
      // Add each missing column
      for (const column of data.missing_columns) {
        let dataType = "TEXT";
        let constraints = "";
        
        // Define data types and constraints based on column name
        switch (column) {
          case "article_count":
            dataType = "INTEGER";
            constraints = "NOT NULL DEFAULT 0";
            break;
          case "timestamp":
            dataType = "TIMESTAMPTZ";
            constraints = "NOT NULL DEFAULT NOW()";
            break;
          case "status":
            dataType = "TEXT";
            constraints = "NOT NULL CHECK (status IN ('success', 'error'))";
            break;
          case "provider":
            dataType = "TEXT";
            constraints = "NOT NULL CHECK (provider IN ('perplexity', 'openai', 'anthropic'))";
            break;
          default:
            dataType = "TEXT";
        }
        
        // Add the column
        const { error } = await supabaseAdmin.rpc("add_column_to_table", {
          table_name: "prompt_logs",
          column_name: column,
          column_definition: `${dataType} ${constraints}`
        });
        
        if (error) {
          console.error(`Error adding column ${column} to prompt_logs:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error updating prompt_logs table:", error);
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

export { supabase, supabaseAdmin };

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
 * Creates a new table in Supabase
 */
export const createTable = async (
  tableName: string,
  tableDefinition: string
): Promise<boolean> => {
  if (connectionStatus === "disconnected") {
    console.warn(`Supabase is in mock mode. Table ${tableName} not actually created.`);
    return false;
  }
  
  try {
    const { error } = await supabaseAdmin.rpc("execute_sql", {
      sql: `CREATE TABLE IF NOT EXISTS ${tableName} (${tableDefinition});`
    });
    
    if (error) {
      console.error(`Error creating table ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
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
