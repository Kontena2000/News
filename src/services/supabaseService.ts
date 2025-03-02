
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

// Create a fallback client if environment variables are not set
let supabase: SupabaseClient | any;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock mode for development.");
    
    // Create a mock client for development with a simpler approach
    // that avoids recursive type definitions
    supabase = {
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
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  
  // Fallback to mock client with same implementation as above
  supabase = {
    from: (table: string) => {
      const baseQuery = {
        select: () => ({ ...baseQuery, then: mockThen }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ ...baseQuery, then: mockThen }),
        delete: () => ({ ...baseQuery, then: mockThen }),
        eq: () => ({ ...baseQuery, then: mockThen }),
        lt: () => ({ ...baseQuery, then: mockThen }),
        or: () => ({ ...baseQuery, then: mockThen }),
        order: () => ({ ...baseQuery, then: mockThen }),
        limit: () => ({ ...baseQuery, then: mockThen }),
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

export { supabase };

/**
 * Saves a prompt log to Supabase
 */
export const savePromptLog = async (promptLog: PromptLog): Promise<void> => {
  try {
    const { error } = await supabase
      .from("prompt_logs")
      .insert([promptLog]);
    
    if (error) {
      throw error;
    }
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
  try {
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
  } catch (error) {
    console.error("Error retrieving prompt logs from Supabase:", error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
};

/**
 * Updates the article count for a prompt log
 */
export const updatePromptLogArticleCount = async (
  logId: string,
  articleCount: number
): Promise<void> => {
  try {
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
  try {
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
  try {
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
  } catch (error) {
    console.error("Error searching prompt logs:", error);
    return [];
  }
};
