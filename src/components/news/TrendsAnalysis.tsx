
import { useState } from "react"
import { Article } from "@/types/news"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface TrendsAnalysisProps {
  articles: Article[]
  timeframe: "day" | "week" | "month" | "quarter"
}

export function TrendsAnalysis({ articles, timeframe }: TrendsAnalysisProps) {
  const [viewMode, setViewMode] = useState<"categories" | "sources" | "relevance">("categories")
  
  // Process articles to extract trend data
  const trendData = processTrendData(articles, timeframe, viewMode)
  
  // Get top trending categories/sources
  const topTrends = getTopTrends(trendData, 5)
  
  // Calculate growth rates
  const growthRates = calculateGrowthRates(trendData, timeframe)
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Trends Analysis</CardTitle>
            <CardDescription>
              Temporal pattern recognition for {timeframe === "day" ? "daily" : 
                timeframe === "week" ? "weekly" : 
                timeframe === "month" ? "monthly" : "quarterly"} news
            </CardDescription>
          </div>
          <div className="flex items-center rounded-md border">
            <TabsList>
              <TabsTrigger 
                value="categories" 
                onClick={() => setViewMode("categories")}
                className={viewMode === "categories" ? "bg-primary text-primary-foreground" : ""}
              >
                <PieChart className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="sources" 
                onClick={() => setViewMode("sources")}
                className={viewMode === "sources" ? "bg-primary text-primary-foreground" : ""}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Sources
              </TabsTrigger>
              <TabsTrigger 
                value="relevance" 
                onClick={() => setViewMode("relevance")}
                className={viewMode === "relevance" ? "bg-primary text-primary-foreground" : ""}
              >
                <LineChart className="mr-2 h-4 w-4" />
                Relevance
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-medium">Top Trending {viewMode === "categories" ? "Categories" : viewMode === "sources" ? "Sources" : "Topics"}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topTrends.map((trend, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{trend.name}</span>
                    <Badge variant={trend.growth > 0 ? "default" : "destructive"}>
                      {trend.growth > 0 ? "+" : ""}{trend.growth}%
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {trend.count} articles
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div 
                      className="h-2 rounded-full bg-primary" 
                      style={{ width: `${Math.min(100, trend.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-lg font-medium">Pattern Recognition Insights</h3>
            <div className="rounded-lg border p-4">
              <ul className="space-y-2">
                {generateInsights(trendData, viewMode, timeframe).map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 block h-2 w-2 rounded-full bg-primary" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-lg font-medium">Growth Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Current Period</th>
                    <th className="border px-4 py-2 text-left">Previous Period</th>
                    <th className="border px-4 py-2 text-left">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {growthRates.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2">{item.current}</td>
                      <td className="border px-4 py-2">{item.previous}</td>
                      <td className="border px-4 py-2">
                        <span className={item.growth > 0 ? "text-green-500" : "text-red-500"}>
                          {item.growth > 0 ? "+" : ""}{item.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions for data processing

function processTrendData(
  articles: Article[], 
  timeframe: "day" | "week" | "month" | "quarter",
  viewMode: "categories" | "sources" | "relevance"
) {
  // In a real implementation, this would process actual article data
  // For this prototype, we'll return mock trend data
  
  const mockTrendData = {
    categories: [
      { name: "Technology", count: 24, percentage: 32, growth: 15 },
      { name: "Finance", count: 18, percentage: 24, growth: 8 },
      { name: "Healthcare", count: 12, percentage: 16, growth: -5 },
      { name: "Energy", count: 9, percentage: 12, growth: 22 },
      { name: "Manufacturing", count: 7, percentage: 9, growth: -3 },
      { name: "Retail", count: 5, percentage: 7, growth: 1 },
    ],
    sources: [
      { name: "TechCrunch", count: 15, percentage: 20, growth: 12 },
      { name: "Wall Street Journal", count: 12, percentage: 16, growth: 5 },
      { name: "Bloomberg", count: 10, percentage: 13, growth: 8 },
      { name: "Reuters", count: 9, percentage: 12, growth: -2 },
      { name: "CNBC", count: 8, percentage: 11, growth: 4 },
      { name: "Forbes", count: 7, percentage: 9, growth: -1 },
    ],
    relevance: [
      { name: "AI Developments", count: 20, percentage: 27, growth: 35 },
      { name: "Market Trends", count: 15, percentage: 20, growth: 12 },
      { name: "Regulatory Changes", count: 12, percentage: 16, growth: -8 },
      { name: "Industry Partnerships", count: 10, percentage: 13, growth: 5 },
      { name: "Product Launches", count: 8, percentage: 11, growth: 18 },
      { name: "Research Breakthroughs", count: 7, percentage: 9, growth: 22 },
    ]
  }
  
  return mockTrendData[viewMode]
}

function getTopTrends(trendData: any[], count: number) {
  return trendData.slice(0, count)
}

function calculateGrowthRates(trendData: any[], timeframe: string) {
  // In a real implementation, this would calculate actual growth rates
  // For this prototype, we'll use the mock data
  
  return trendData.map(item => ({
    name: item.name,
    current: item.count,
    previous: Math.round(item.count / (1 + item.growth / 100)),
    growth: item.growth
  }))
}

function generateInsights(trendData: any[], viewMode: string, timeframe: string) {
  // In a real implementation, this would generate insights based on actual data
  // For this prototype, we'll return mock insights
  
  const insights = [
    `${viewMode === "categories" ? "Technology" : viewMode === "sources" ? "TechCrunch" : "AI Developments"} shows consistent growth over the past ${timeframe}, indicating sustained interest in this area.`,
    `The decline in ${viewMode === "categories" ? "Healthcare" : viewMode === "sources" ? "Reuters" : "Regulatory Changes"} coverage suggests a potential shift in industry focus.`,
    `${viewMode === "categories" ? "Energy" : viewMode === "sources" ? "Bloomberg" : "Research Breakthroughs"} has seen the highest growth rate, highlighting emerging opportunities.`,
    `Correlation analysis shows that ${viewMode === "categories" ? "Finance and Technology" : viewMode === "sources" ? "Wall Street Journal and CNBC" : "Market Trends and AI Developments"} frequently appear together, suggesting interconnected developments.`,
    `Temporal pattern analysis reveals cyclical coverage of ${viewMode === "categories" ? "Manufacturing" : viewMode === "sources" ? "Forbes" : "Product Launches"}, with peaks occurring mid-${timeframe}.`
  ]
  
  return insights
}
