
export interface NewsSettings {
  // API Configuration
  apiKey?: string;
  apiEndpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  
  // Prompt Configuration
  basePrompt?: string;
  promptPrefix?: string;
  promptSuffix?: string;
  
  // Vector Database Configuration
  vectorDbEnabled?: boolean;
  vectorDbUrl?: string;
  vectorDbApiKey?: string;
  
  // Company Context
  companyName?: string;
  industry?: string;
  keyProducts?: string[];
  competitors?: string[];
  interests?: string[];
  
  // Filtering and Sorting
  trustedSources?: string[];
  filterByTrustedSources?: boolean;
  minRelevanceScore?: number;
  categories?: string[];
  keywords?: string[];
  maxArticles?: number;
  sortBy?: "relevance" | "date" | "source";
  
  // Scheduling
  refreshInterval?: number; // in minutes
  autoRefresh?: boolean;
  
  // Summarization
  enableSummarization?: boolean;
  summaryLength?: "short" | "medium" | "long";
  
  // Database Connection
  dbConnectionString?: string;
  dbEnabled?: boolean;
  dbType?: "postgres" | "mysql" | "mongodb";
  
  // Prompt Logging
  enablePromptLogging?: boolean;
  promptLogRetentionDays?: number;
}

export interface SettingsState {
  settings: NewsSettings;
  isLoading: boolean;
  error: string | null;
}

export interface PromptLog {
  id: string;
  timestamp: string;
  originalPrompt: string;
  enhancedPrompt: string;
  provider: "perplexity" | "openai" | "anthropic";
  articleCount: number;
  status: "success" | "error";
  errorMessage?: string;
}
