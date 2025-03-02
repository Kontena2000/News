
import { NewsSettings, PromptLog } from "@/types/settings";
import { savePromptLog, getPromptLogs as fetchPromptLogs, updatePromptLogArticleCount } from "@/services/supabaseService";
import { queryVectorDB } from "@/services/pineconeService";

/**
 * Enhances a base prompt with context from the vector database
 */
export const enhancePrompt = async (
  basePrompt: string,
  settings: NewsSettings
): Promise<string> => {
  try {
    // Get context from vector database
    const context = await getContextFromVectorDB(settings);
    
    // Combine base prompt with context
    const enhancedPrompt = createEnhancedPrompt(basePrompt, context, settings);
    
    // Log the prompt if logging is enabled
    if (settings.enablePromptLogging) {
      await logPrompt(basePrompt, enhancedPrompt, settings);
    }
    
    return enhancedPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // If enhancement fails, return the original prompt
    return basePrompt;
  }
};

/**
 * Retrieves relevant context from the vector database
 */
const getContextFromVectorDB = async (settings: NewsSettings): Promise<string> => {
  if (!settings.vectorDbEnabled) {
    return "";
  }
  
  try {
    // Query the vector database using the company information as context
    const query = `${settings.companyName} ${settings.industry} ${settings.keyProducts?.join(" ")} ${settings.interests?.join(" ")}`;
    
    // Get context from Pinecone
    const context = await queryVectorDB(query, settings);
    
    // If no context from vector DB, use company info as fallback
    if (!context) {
      return createCompanyContextFallback(settings);
    }
    
    return context;
  } catch (error) {
    console.error("Error getting context from vector DB:", error);
    // Fallback to company info if vector DB fails
    return createCompanyContextFallback(settings);
  }
};

/**
 * Creates a fallback context from company information
 */
const createCompanyContextFallback = (settings: NewsSettings): string => {
  return `
    Company Name: ${settings.companyName || "Your Company"}
    Industry: ${settings.industry || "Technology"}
    Key Products: ${settings.keyProducts?.join(", ") || "Various products and services"}
    Competitors: ${settings.competitors?.join(", ") || "Various market competitors"}
    Interests: ${settings.interests?.join(", ") || "Industry trends, market developments"}
  `;
};

/**
 * Creates an enhanced prompt by combining the base prompt with context
 */
const createEnhancedPrompt = (
  basePrompt: string,
  context: string,
  settings: NewsSettings
): string => {
  // Format the enhanced prompt with context
  const enhancedPrompt = `
    ${settings.promptPrefix || ""}
    
    CONTEXT:
    ${context}
    
    BASE PROMPT:
    ${basePrompt}
    
    ${settings.promptSuffix || ""}
    
    Please return the results as a JSON array of news articles with the following structure:
    [
      {
        "title": "Article Title",
        "summary": "Brief summary of the article",
        "content": "Full content of the article",
        "url": "URL to the original article",
        "source": "Source name",
        "sourceUrl": "URL of the source",
        "imageUrl": "URL to an image for the article",
        "publishedAt": "Publication date in ISO format",
        "category": "Article category",
        "tags": ["tag1", "tag2", "tag3"]
      }
    ]
  `;
  
  return enhancedPrompt.trim();
};

/**
 * Gets the default base prompt from settings or falls back to a default
 */
export const getDefaultBasePrompt = (settings: NewsSettings): string => {
  return settings.basePrompt || 
    "Find the latest news articles relevant to our company and industry. Focus on recent developments, market trends, competitor activities, and regulatory changes that might impact our business.";
};

/**
 * Logs a prompt for future reference
 */
const logPrompt = async (
  originalPrompt: string,
  enhancedPrompt: string,
  settings: NewsSettings,
  provider: "perplexity" | "openai" | "anthropic" = "perplexity"
): Promise<string> => {
  try {
    const promptLog: PromptLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      originalPrompt,
      enhancedPrompt,
      provider,
      articleCount: 0,
      status: "success"
    };
    
    // Save to Supabase
    await savePromptLog(promptLog);
    
    return promptLog.id;
  } catch (error) {
    console.error("Error logging prompt:", error);
    return "";
  }
};

/**
 * Updates the article count for a prompt log
 */
export const updatePromptLogCount = async (
  logId: string,
  articleCount: number
): Promise<void> => {
  if (!logId) return;
  
  try {
    await updatePromptLogArticleCount(logId, articleCount);
  } catch (error) {
    console.error("Error updating prompt log article count:", error);
  }
};

/**
 * Retrieves prompt logs from storage
 */
export const getPromptLogs = async (
  limit: number = 50,
  provider?: "perplexity" | "openai" | "anthropic"
): Promise<PromptLog[]> => {
  try {
    // Get logs from Supabase
    return await fetchPromptLogs(limit, provider);
  } catch (error) {
    console.error("Error retrieving prompt logs:", error);
    
    // Fallback to mock data if Supabase fails
    const mockLogs: PromptLog[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        originalPrompt: "Find news about HPC innovations in the last week",
        enhancedPrompt: "Enhanced prompt with context...",
        provider: "perplexity",
        articleCount: 12,
        status: "success"
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        originalPrompt: "Latest developments in Bitcoin mining efficiency",
        enhancedPrompt: "Enhanced prompt with context...",
        provider: "perplexity",
        articleCount: 8,
        status: "success"
      }
    ];
    
    if (provider) {
      return mockLogs.filter(log => log.provider === provider);
    }
    
    return mockLogs;
  }
};
