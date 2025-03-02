
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  url: string
  source: string
  sourceUrl: string
  imageUrl: string
  relevanceScore: number
  publishedAt: string
  scrapedAt: string
  category: string
  tags: string[]
  suggestion: string
  isBookmarked: boolean
}

export interface NewsFilter {
  search: string
  categories: string[]
  sources: string[]
  dateRange: {
    from: Date | null
    to: Date | null
  }
  minRelevanceScore: number
  sortBy: 'relevance' | 'date' | 'source'
  sortOrder: 'asc' | 'desc'
}

export interface DailySummary {
  id: string
  date: string
  summary: string
  articleCount: number
  topArticles: Article[]
  categories: {
    name: string
    count: number
  }[]
}
