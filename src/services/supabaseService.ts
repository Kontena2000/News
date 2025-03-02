
import { createClient } from "@supabase/supabase-js";
import { PromptLog } from "@/types/settings";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a fallback client if environment variables are not set
let supabase;

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock mode for development.");
    // Create a mock client for development
    supabase = {
      from: () => ({
        insert: async () => ({ data: null, error: null }),
        select: async () => ({ data: [], error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
        eq: () => ({ data: [], error: null }),
        lt: () => ({ data: [], error: null }),
        or: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null, limit: () => ({ data: [], error: null }) }),
        limit: () => ({ data: [], error: null }),
      }),
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Fallback to mock client
  supabase = {
    from: () => ({
      insert: async () => ({ data: null, error: null }),
      select: async () => ({ data: [], error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      lt: () => ({ data: [], error: null }),
      or: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null, limit: () => ({ data: [], error: null }) }),
      limit: () => ({ data: [], error: null }),
    }),
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
    let query = supabase
      .from("prompt_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);
    
    if (provider) {
      query = query.eq("provider", provider);
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
    const { error } = await supabase
      .from("prompt_logs")
      .update({ articleCount })
      .eq("id", logId);
    
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
    
    const { error } = await supabase
      .from("prompt_logs")
      .delete()
      .lt("timestamp", cutoffDate.toISOString());
    
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
    const { data, error } = await supabase
      .from("prompt_logs")
      .select("*")
      .or(`originalPrompt.ilike.%${searchTerm}%,enhancedPrompt.ilike.%${searchTerm}%`)
      .order("timestamp", { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data as PromptLog[];
  } catch (error) {
    console.error("Error searching prompt logs:", error);
    return [];
  }
};
