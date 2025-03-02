
import { Article } from "@/types/news";
import { NewsSettings } from "@/types/settings";
import { mockArticles } from "@/data/mock-news";

// Toggle for development mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

/**
 * Fetches news articles using an enhanced prompt from external API (e.g., Perplexity)
 */
export const fetchNewsWithPrompt = async (
  enhancedPrompt: string,
  settings: NewsSettings
): Promise<Article[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for news articles");
    return mockArticles;
  }

  try {
    // API endpoint configuration
    const apiUrl = settings.apiEndpoint || "https://api.perplexity.ai/chat/completions";
    
    // Prepare the request payload
    const payload = {
      model: settings.model || "mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides news articles based on the given prompt."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      max_tokens: settings.maxTokens || 1024,
      temperature: settings.temperature || 0.7
    };

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Process and transform the API response into Article objects
    const articles = processApiResponse(data, settings);
    
    return articles;
  } catch (error) {
    console.error("Error fetching news with prompt:", error);
    throw error;
  }
};

/**
 * Processes the raw API response and transforms it into Article objects
 */
const processApiResponse = (apiResponse: any, settings: NewsSettings): Article[] => {
  // This is a simplified implementation
  // In a real application, this would parse the API response format
  // and transform it into Article objects
  
  try {
    // Extract the content from the API response
    const content = apiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in API response");
    }
    
    // Parse the content as JSON if it's in JSON format
    // This assumes the LLM returns properly formatted JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      // If not JSON, try to extract structured data using regex or other methods
      // This is a simplified fallback
      return [];
    }
    
    // Map the parsed content to Article objects
    const articles = Array.isArray(parsedContent) 
      ? parsedContent.map((item: any, index: number) => ({
          id: item.id || `generated-${index}`,
          title: item.title || "Untitled Article",
          summary: item.summary || "",
          content: item.content || "",
          url: item.url || "",
          source: item.source || "Unknown Source",
          sourceUrl: item.sourceUrl || "",
          imageUrl: item.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
          relevanceScore: calculateRelevanceScore(item, settings),
          publishedAt: item.publishedAt || new Date().toISOString(),
          scrapedAt: new Date().toISOString(),
          category: item.category || "Uncategorized",
          tags: item.tags || [],
          suggestion: item.suggestion || "",
          isBookmarked: false
        }))
      : [];
      
    return articles;
  } catch (error) {
    console.error("Error processing API response:", error);
    return [];
  }
};

/**
 * Calculates a relevance score for an article based on settings criteria
 */
const calculateRelevanceScore = (article: any, settings: NewsSettings): number => {
  // This is a simplified scoring algorithm
  // In a real application, this would use more sophisticated methods
  
  let score = 70; // Base score
  
  // Check if article source is in trusted sources
  if (settings.trustedSources?.includes(article.source)) {
    score += 10;
  }
  
  // Check if article contains keywords from settings
  const keywords = settings.keywords || [];
  const contentText = `${article.title} ${article.summary} ${article.content}`.toLowerCase();
  
  const keywordMatches = keywords.filter(keyword => 
    contentText.includes(keyword.toLowerCase())
  ).length;
  
  // Add points based on keyword matches
  score += keywordMatches * 5;
  
  // Cap the score at 100
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Fetches news articles with optional filtering
 */
export const fetchNewsArticles = async (filters?: any): Promise<Article[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for news articles");
    
    // Apply filters to mock data if provided
    if (filters) {
      return filterArticles(mockArticles, filters);
    }
    
    return mockArticles;
  }
  
  // In a real implementation, this would fetch from an API or database
  // and apply the filters server-side
  
  return [];
};

/**
 * Filters articles based on provided criteria
 */
const filterArticles = (articles: Article[], filters: any): Article[] => {
  return articles.filter(article => {
    // Filter by search term
    if (filters.search && !articleMatchesSearch(article, filters.search)) {
      return false;
    }
    
    // Filter by categories
    if (filters.categories?.length > 0 && !filters.categories.includes(article.category)) {
      return false;
    }
    
    // Filter by sources
    if (filters.sources?.length > 0 && !filters.sources.includes(article.source)) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange?.from && new Date(article.publishedAt) < filters.dateRange.from) {
      return false;
    }
    if (filters.dateRange?.to && new Date(article.publishedAt) > filters.dateRange.to) {
      return false;
    }
    
    // Filter by minimum relevance score
    if (typeof filters.minRelevanceScore === "number" && article.relevanceScore < filters.minRelevanceScore) {
      return false;
    }
    
    return true;
  });
};

/**
 * Checks if an article matches a search term
 */
const articleMatchesSearch = (article: Article, searchTerm: string): boolean => {
  const searchLower = searchTerm.toLowerCase();
  return (
    article.title.toLowerCase().includes(searchLower) ||
    article.summary.toLowerCase().includes(searchLower) ||
    article.content.toLowerCase().includes(searchLower) ||
    article.source.toLowerCase().includes(searchLower) ||
    article.category.toLowerCase().includes(searchLower) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};
