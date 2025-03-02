
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PromptLog } from "@/types/settings";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/postgrest-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Define types for our mock client's query builders
type MockQueryResult<T> = {
  data: T | null;
  error: any | null;
};

// Simplified mock interfaces to avoid recursive type issues
interface MockFilterBuilder<T> {
  eq: (column: string, value: any) => MockFilterBuilder<T>;
  lt: (column: string, value: any) => MockFilterBuilder<T>;
  or: (conditions: string) => MockFilterBuilder<T>;
  order: (column: string, options?: { ascending: boolean }) => MockFilterBuilder<T>;
  limit: (count: number) => MockFilterBuilder<T>;
  then: (onfulfilled?: ((value: MockQueryResult<T>) => any)) => Promise<any>;
}

interface MockQueryBuilder<T> {
  select: (columns?: string) => MockFilterBuilder<T[]>;
  insert: (data: any) => Promise<MockQueryResult<T>>;
  update: (data: any) => MockFilterBuilder<T>;
  delete: () => MockFilterBuilder<T>;
}

// Define a type for our mock client that matches the structure we use
interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder<any>;
}

// Create a mock filter builder that returns itself for chaining
const createMockFilterBuilder = <T>(): MockFilterBuilder<T> => {
  const result: MockQueryResult<T> = { data: null, error: null };
  
  const builder = {
    eq: () => builder,
    lt: () => builder,
    or: () => builder,
    order: () => builder,
    limit: () => builder,
    then: (onfulfilled?: ((value: MockQueryResult<T>) => any)) => 
      Promise.resolve(onfulfilled ? onfulfilled(result) : result)
  };
  
  return builder;
};

// Create a fallback client if environment variables are not set
let supabase: SupabaseClient | MockSupabaseClient;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock mode for development.");
    // Create a mock client for development
    supabase = {
      from: (table: string): MockQueryBuilder<any> => ({
        select: () => createMockFilterBuilder<any[]>(),
        insert: async () => ({ data: null, error: null }),
        update: () => createMockFilterBuilder<any>(),
        delete: () => createMockFilterBuilder<any>()
      })
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Fallback to mock client
  supabase = {
    from: (table: string): MockQueryBuilder<any> => ({
      select: () => createMockFilterBuilder<any[]>(),
      insert: async () => ({ data: null, error: null }),
      update: () => createMockFilterBuilder<any>(),
      delete: () => createMockFilterBuilder<any>()
    })
  };
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
      if ('eq' in query) {
        query = query.eq("provider", provider);
      }
    }
    
    if ('order' in query) {
      query = query.order("timestamp", { ascending: false });
    }
    
    if ('limit' in query) {
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
    
    if ('eq' in query) {
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
    
    if ('lt' in query) {
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
    
    if ('or' in query) {
      query = query.or(`originalPrompt.ilike.%${searchTerm}%,enhancedPrompt.ilike.%${searchTerm}%`);
    }
    
    if ('order' in query) {
      query = query.order("timestamp", { ascending: false });
    }
    
    if ('limit' in query) {
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
