
import { Article, DailySummary } from "@/types/news"

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "AI Breakthrough Could Revolutionize Content Marketing",
    summary: "New AI models are showing unprecedented capabilities in content generation and analysis, potentially transforming how marketing agencies operate.",
    content: "Researchers have developed a new generation of AI models that can not only generate high-quality content but also analyze market trends and consumer behavior with remarkable accuracy. This breakthrough could significantly impact content marketing strategies for agencies worldwide.",
    url: "https://techcrunch.com/ai-breakthrough-content-marketing",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com",
    imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813dce26",
    relevanceScore: 92,
    publishedAt: "2025-03-01T08:30:00Z",
    scrapedAt: "2025-03-01T09:15:00Z",
    category: "Technology",
    tags: ["AI", "Marketing", "Content Strategy"],
    suggestion: "Consider exploring how these AI models could be integrated into your content creation workflow to improve efficiency and quality.",
    isBookmarked: false
  },
  {
    id: "2",
    title: "Major Competitor Acquires Innovative Analytics Platform",
    summary: "DigitalPulse, a direct competitor, has acquired DataInsight, a leading analytics platform known for its advanced customer behavior prediction capabilities.",
    content: "In a move that could reshape the competitive landscape, DigitalPulse has announced the acquisition of DataInsight for $45 million. This acquisition gives DigitalPulse access to DataInsight's proprietary algorithms that have shown 30% better accuracy in predicting consumer behavior compared to industry standards.",
    url: "https://bloomberg.com/competitor-acquisition-analytics",
    source: "Bloomberg",
    sourceUrl: "https://bloomberg.com",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    relevanceScore: 88,
    publishedAt: "2025-02-28T14:45:00Z",
    scrapedAt: "2025-02-28T15:30:00Z",
    category: "Industry",
    tags: ["Acquisition", "Competitor", "Analytics"],
    suggestion: "Evaluate how this acquisition might affect your market position and consider developing partnerships with alternative analytics providers.",
    isBookmarked: true
  },
  {
    id: "3",
    title: "New Privacy Regulations to Impact Digital Marketing Strategies",
    summary: "Upcoming privacy regulations will require significant changes to how companies collect and use consumer data for marketing purposes.",
    content: "Regulatory bodies have announced new privacy frameworks that will come into effect in Q3 2025, imposing stricter limitations on data collection and usage. Companies will need to obtain explicit consent for each type of data collected and provide clear explanations of how it will be used.",
    url: "https://wired.com/privacy-regulations-digital-marketing",
    source: "Wired",
    sourceUrl: "https://wired.com",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    relevanceScore: 85,
    publishedAt: "2025-02-27T11:20:00Z",
    scrapedAt: "2025-02-27T12:05:00Z",
    category: "Regulation",
    tags: ["Privacy", "Compliance", "Data Strategy"],
    suggestion: "Begin auditing your data collection practices now and develop a compliance roadmap to ensure readiness when the regulations take effect.",
    isBookmarked: false
  },
  {
    id: "4",
    title: "Consumer Trends Show Shift Toward Interactive Content",
    summary: "Recent market research indicates consumers are increasingly engaging with interactive content formats over traditional static content.",
    content: "A comprehensive study of consumer behavior across digital platforms shows a significant shift toward interactive content formats. Engagement rates for interactive infographics, quizzes, and configurators were 4-7 times higher than for traditional content formats like articles and static images.",
    url: "https://marketingdive.com/consumer-trends-interactive-content",
    source: "Marketing Dive",
    sourceUrl: "https://marketingdive.com",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    relevanceScore: 78,
    publishedAt: "2025-02-26T09:15:00Z",
    scrapedAt: "2025-02-26T10:00:00Z",
    category: "Market Trends",
    tags: ["Consumer Behavior", "Content Strategy", "Engagement"],
    suggestion: "Allocate resources to developing more interactive content formats and tools that allow your clients to create such content more easily.",
    isBookmarked: false
  },
  {
    id: "5",
    title: "Emerging Social Platform Gaining Traction Among Key Demographics",
    summary: "A new social media platform focused on short-form video content is rapidly gaining popularity among 18-25 year olds.",
    content: "The platform, called FlashFeed, has seen its user base grow by 200% in the last quarter, primarily among users aged 18-25. Its unique algorithm and focus on creator monetization has attracted both users and content creators from established platforms.",
    url: "https://socialmediatoday.com/emerging-platform-demographics",
    source: "Social Media Today",
    sourceUrl: "https://socialmediatoday.com",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
    relevanceScore: 75,
    publishedAt: "2025-02-25T16:40:00Z",
    scrapedAt: "2025-02-25T17:25:00Z",
    category: "Social Media",
    tags: ["Platform", "Demographics", "Video Content"],
    suggestion: "Experiment with content creation on FlashFeed for appropriate clients and monitor performance compared to established platforms.",
    isBookmarked: false
  },
  {
    id: "6",
    title: "Study Reveals Optimal Content Length for Different Platforms",
    summary: "New research provides specific recommendations for content length across different platforms and formats to maximize engagement.",
    content: "A comprehensive analysis of engagement metrics across major platforms has revealed optimal content length guidelines. The study found that LinkedIn articles perform best at 1,500-2,000 words, while Twitter posts see peak engagement at 70-100 characters with a visual element.",
    url: "https://contentmarketinginstitute.com/optimal-content-length",
    source: "Content Marketing Institute",
    sourceUrl: "https://contentmarketinginstitute.com",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    relevanceScore: 72,
    publishedAt: "2025-02-24T13:10:00Z",
    scrapedAt: "2025-02-24T14:00:00Z",
    category: "Content Strategy",
    tags: ["Best Practices", "Engagement", "Platform Optimization"],
    suggestion: "Update your content guidelines to reflect these platform-specific recommendations and train your content team accordingly.",
    isBookmarked: true
  }
]

export const mockDailySummary: DailySummary = {
  id: "summary-2025-03-01",
  date: "2025-03-01",
  summary: "Today's news highlights significant developments in AI for content marketing, with potential implications for efficiency and quality. There's also important movement in the competitive landscape with DigitalPulse's acquisition of DataInsight. Privacy regulations continue to evolve, requiring proactive compliance planning. Consumer engagement trends favor interactive content, while new social platforms emerge as potential channels for reaching younger demographics.",
  articleCount: 6,
  topArticles: mockArticles.slice(0, 3),
  categories: [
    { name: "Technology", count: 1 },
    { name: "Industry", count: 1 },
    { name: "Regulation", count: 1 },
    { name: "Market Trends", count: 1 },
    { name: "Social Media", count: 1 },
    { name: "Content Strategy", count: 1 }
  ]
}
