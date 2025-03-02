
import { useState, useEffect, useCallback } from "react";
import { Article, NewsFilter, DailySummary } from "@/types/news";
import { NewsSettings } from "@/types/settings";
import { fetchNews, getFilteredNews, generateDailySummary, refreshNews } from "@/services/newsService";
import { mockArticles, mockDailySummary } from "@/data/mock-news";

// Default settings
const defaultSettings: NewsSettings = {
  filterByTrustedSources: true,
  minRelevanceScore: 70,
  sortBy: "relevance",
  maxArticles: 20,
  autoRefresh: false,
  refreshInterval: 60, // 1 hour
};

// Default filter
const defaultFilter: NewsFilter = {
  search: "",
  categories: [],
  sources: [],
  dateRange: {
    from: null,
    to: null,
  },
  minRelevanceScore: 0,
  sortBy: "relevance",
  sortOrder: "desc",
};

export const useNewsData = (initialSettings?: Partial<NewsSettings>) => {
  // Combine default settings with any provided settings
  const [settings, setSettings] = useState<NewsSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  
  // State for articles and daily summary
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [filter, setFilter] = useState<NewsFilter>(defaultFilter);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to load news data
  const loadNewsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we're using mock data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
      
      if (useMockData) {
        // Use mock data
        setArticles(mockArticles);
        setFilteredArticles(mockArticles);
        setDailySummary(mockDailySummary);
      } else {
        // Fetch real data
        const { articles: newArticles, dailySummary: newSummary } = await refreshNews(settings);
        setArticles(newArticles);
        setFilteredArticles(newArticles);
        setDailySummary(newSummary);
      }
    } catch (err) {
      console.error("Error loading news data:", err);
      setError("Failed to load news data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [settings]);
  
  // Function to apply filters
  const applyFilter = useCallback(async (newFilter: Partial<NewsFilter>) => {
    setIsLoading(true);
    
    try {
      // Update the filter state
      const updatedFilter = { ...filter, ...newFilter };
      setFilter(updatedFilter);
      
      // Apply the filter
      const filtered = await getFilteredNews(updatedFilter, settings);
      setFilteredArticles(filtered);
    } catch (err) {
      console.error("Error applying filter:", err);
      setError("Failed to apply filter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filter, settings]);
  
  // Function to update settings
  const updateSettings = useCallback((newSettings: Partial<NewsSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  }, []);
  
  // Function to manually refresh news
  const refreshNewsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { articles: newArticles, dailySummary: newSummary } = await refreshNews(settings);
      setArticles(newArticles);
      
      // Apply current filter to new articles
      const filtered = await getFilteredNews(filter, settings);
      setFilteredArticles(filtered);
      
      setDailySummary(newSummary);
    } catch (err) {
      console.error("Error refreshing news:", err);
      setError("Failed to refresh news. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [settings, filter]);
  
  // Function to bookmark/unbookmark an article
  const toggleBookmark = useCallback((articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked } 
          : article
      )
    );
    
    setFilteredArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked } 
          : article
      )
    );
  }, []);
  
  // Load news data on initial render and when settings change
  useEffect(() => {
    loadNewsData();
    
    // Set up auto-refresh if enabled
    if (settings.autoRefresh && settings.refreshInterval) {
      const intervalId = setInterval(() => {
        refreshNewsData();
      }, settings.refreshInterval * 60 * 1000); // Convert minutes to milliseconds
      
      return () => clearInterval(intervalId);
    }
  }, [loadNewsData, refreshNewsData, settings.autoRefresh, settings.refreshInterval]);
  
  return {
    articles,
    filteredArticles,
    dailySummary,
    isLoading,
    error,
    filter,
    settings,
    applyFilter,
    updateSettings,
    refreshNewsData,
    toggleBookmark,
  };
};
