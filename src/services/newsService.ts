
import { Article, NewsFilter, DailySummary } from "@/types/news";
import { NewsSettings } from "@/types/settings";
import { fetchNewsWithPrompt } from "./externalApiService";
import { enhancePrompt, getDefaultBasePrompt } from "./promptService";
import { mockArticles, mockDailySummary } from "@/data/mock-news";

// Toggle for development mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

/**
 * Main service function to fetch news based on settings
 */
export const fetchNews = async (settings: NewsSettings): Promise<Article[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for news");
    return mockArticles;
  }
  
  try {
    // Get the base prompt from settings
    const basePrompt = getDefaultBasePrompt(settings);
    
    // Enhance the prompt with context
    const enhancedPrompt = await enhancePrompt(basePrompt, settings);
    
    // Fetch news using the enhanced prompt
    const articles = await fetchNewsWithPrompt(enhancedPrompt, settings);
    
    // Process and filter the articles
    const processedArticles = processArticles(articles, settings);
    
    return processedArticles;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

/**
 * Processes articles by filtering, scoring, and sorting
 */
const processArticles = (articles: Article[], settings: NewsSettings): Article[] => {
  // Filter articles based on settings
  let processedArticles = articles.filter(article => {
    // Filter by trusted sources if enabled
    if (settings.filterByTrustedSources && settings.trustedSources && settings.trustedSources.length > 0) {
      if (!settings.trustedSources.includes(article.source)) {
        return false;
      }
    }
    
    // Filter by minimum relevance score
    if (typeof settings.minRelevanceScore === "number" && 
        article.relevanceScore < settings.minRelevanceScore) {
      return false;
    }
    
    // Filter by categories if specified
    if (settings.categories && settings.categories.length > 0) {
      if (!settings.categories.includes(article.category)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort articles based on settings
  processedArticles = sortArticles(processedArticles, settings.sortBy || "relevance");
  
  // Limit the number of articles if specified
  if (typeof settings.maxArticles === "number" && settings.maxArticles > 0) {
    processedArticles = processedArticles.slice(0, settings.maxArticles);
  }
  
  return processedArticles;
};

/**
 * Sorts articles based on the specified criteria
 */
const sortArticles = (articles: Article[], sortBy: string): Article[] => {
  return [...articles].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.relevanceScore - a.relevanceScore;
      case "date":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "source":
        return a.source.localeCompare(b.source);
      default:
        return b.relevanceScore - a.relevanceScore;
    }
  });
};

/**
 * Fetches news with filtering options
 */
export const getFilteredNews = async (
  filters: NewsFilter,
  settings: NewsSettings
): Promise<Article[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for filtered news");
    
    // Apply filters to mock data
    return filterArticles(mockArticles, filters);
  }
  
  try {
    // Fetch all news first
    const allArticles = await fetchNews(settings);
    
    // Apply additional filters
    const filteredArticles = filterArticles(allArticles, filters);
    
    return filteredArticles;
  } catch (error) {
    console.error("Error getting filtered news:", error);
    throw error;
  }
};

/**
 * Filters articles based on provided criteria
 */
const filterArticles = (articles: Article[], filters: NewsFilter): Article[] => {
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

/**
 * Generates a daily summary of news articles
 */
export const generateDailySummary = async (
  articles: Article[],
  settings: NewsSettings
): Promise<DailySummary> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for daily summary");
    return mockDailySummary;
  }
  
  try {
    // Get today's date in ISO format
    const today = new Date().toISOString().split("T")[0];
    
    // Get top articles based on relevance score
    const topArticles = [...articles]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
    
    // Count articles by category
    const categoryMap = new Map<string, number>();
    articles.forEach(article => {
      const count = categoryMap.get(article.category) || 0;
      categoryMap.set(article.category, count + 1);
    });
    
    // Convert category map to array
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
    
    // Generate summary text
    // In a real application, this might use an LLM to generate a summary
    const summary = `Today's news highlights ${topArticles.length} key articles across ${categories.length} categories. The most relevant topics include ${categories.slice(0, 3).map(c => c.name).join(", ")}.`;
    
    // Create the daily summary
    const dailySummary: DailySummary = {
      id: `summary-${today}`,
      date: today,
      summary,
      articleCount: articles.length,
      topArticles,
      categories
    };
    
    return dailySummary;
  } catch (error) {
    console.error("Error generating daily summary:", error);
    throw error;
  }
};

/**
 * Refreshes news data based on current settings
 */
export const refreshNews = async (settings: NewsSettings): Promise<{
  articles: Article[];
  dailySummary: DailySummary;
}> => {
  try {
    // Fetch fresh news
    const articles = await fetchNews(settings);
    
    // Generate daily summary
    const dailySummary = await generateDailySummary(articles, settings);
    
    return { articles, dailySummary };
  } catch (error) {
    console.error("Error refreshing news:", error);
    throw error;
  }
};
