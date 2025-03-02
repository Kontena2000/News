
import { NewsSettings } from "@/types/settings";

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
  // This is a placeholder implementation
  // In a real application, this would query a vector database
  
  if (!settings.vectorDbEnabled) {
    return "";
  }
  
  try {
    // Mock vector DB connection
    // In a real implementation, this would connect to a vector DB like Pinecone, Weaviate, etc.
    
    // Simulate fetching context based on settings
    const mockContext = `
      Company Name: ${settings.companyName || "Your Company"}
      Industry: ${settings.industry || "Technology"}
      Key Products: ${settings.keyProducts?.join(", ") || "Various products and services"}
      Competitors: ${settings.competitors?.join(", ") || "Various market competitors"}
      Interests: ${settings.interests?.join(", ") || "Industry trends, market developments"}
    `;
    
    return mockContext;
  } catch (error) {
    console.error("Error getting context from vector DB:", error);
    return "";
  }
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
