
import Head from "next/head"
import { useState, useEffect } from "react"
import { 
  Grid3X3, 
  LayoutList, 
  Sparkles,
  ChevronDown,
  ListTodo,
  Users,
  Lightbulb,
  BookmarkCheck,
  Bookmark,
  Share2,
  RefreshCw,
  Tag,
  ExternalLink,
  BarChart,
  Network
} from "lucide-react"

import { mockArticles, mockDailySummary } from "@/data/mock-news"
import { Article } from "@/types/news"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrendsAnalysis } from "@/components/news/TrendsAnalysis"
import { CrossDomainInsights } from "@/components/news/CrossDomainInsights"
import { CollaborativeAnnotation } from "@/components/news/CollaborativeAnnotation"

export default function NewsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [dailySummary] = useState(mockDailySummary)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [formattedTime, setFormattedTime] = useState("")
  const [formattedDate, setFormattedDate] = useState("")
  const [insightsTimeframe, setInsightsTimeframe] = useState<"day" | "week" | "month" | "quarter">("week")

  // Format the last updated time in a consistent way
  useEffect(() => {
    // Format time consistently for both server and client
    const formatTime = (date: Date) => {
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      const seconds = date.getUTCSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds} UTC`
    }

    // Format date consistently for both server and client
    const formatDate = (date: Date) => {
      const year = date.getUTCFullYear()
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    setFormattedTime(formatTime(lastUpdated))
    setFormattedDate(formatDate(lastUpdated))
  }, [lastUpdated])

  // Toggle bookmark status
  const toggleBookmark = (articleId: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked } 
          : article
      )
    )
  }

  // Simulated refresh function
  const refreshNews = () => {
    setIsRefreshing(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated(new Date())
      // Show notification
      alert("News Feed Refreshed - Latest articles have been loaded")
    }, 1500)
  }

  // Share article
  const shareArticle = (article: Article) => {
    navigator.clipboard.writeText(article.url)
    alert("Link copied to clipboard")
  }

  return (
    <>
      <Head>
        <title>News Scraper</title>
        <meta name="description" content="AI-powered news collection and analysis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">News Feed</h1>
            <p className="text-muted-foreground">
              AI-curated news relevant to your organization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshNews}
              disabled={isRefreshing}
              className="transition-all hover:bg-secondary"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <div className="flex items-center rounded-md border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {formattedTime} · {formattedDate}
        </div>

        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="daily">Daily Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-4">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onBookmarkToggle={toggleBookmark}
                    onReadMore={() => setActiveArticle(article)}
                    onShare={() => shareArticle(article)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <ArticleListItem 
                    key={article.id} 
                    article={article} 
                    onBookmarkToggle={toggleBookmark}
                    onReadMore={() => setActiveArticle(article)}
                    onShare={() => shareArticle(article)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Daily News Summary - {formatDateForDisplay(dailySummary.date)}
                </CardTitle>
                <CardDescription>
                  {dailySummary.articleCount} articles analyzed across {dailySummary.categories.length} categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Summary</h3>
                    <p className="mt-1 text-muted-foreground">{dailySummary.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Top Categories</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dailySummary.categories.map((category) => (
                        <Badge key={category.name} variant="outline">
                          {category.name} ({category.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Top Articles</h3>
                    <div className="mt-2 space-y-3">
                      {dailySummary.topArticles.map((article) => (
                        <div 
                          key={article.id} 
                          className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-secondary/20"
                          onClick={() => setActiveArticle(article)}
                        >
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{article.summary}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="secondary">{article.source}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Score: {article.relevanceScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Advanced Insights & Analysis</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Timeframe:</span>
                <select 
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={insightsTimeframe}
                  onChange={(e) => setInsightsTimeframe(e.target.value as any)}
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              <TrendsAnalysis 
                articles={articles} 
                timeframe={insightsTimeframe}
              />
              
              <CrossDomainInsights articles={articles} />
              
              {activeArticle && (
                <CollaborativeAnnotation article={activeArticle} />
              )}
              
              {!activeArticle && (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Select an article for collaborative annotation</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click "Read More" on any article to add comments and tags for team collaboration
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookmarked" className="mt-4">
            {articles.filter(a => a.isBookmarked).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No bookmarked articles</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bookmark articles to save them for later
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.filter(a => a.isBookmarked).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onBookmarkToggle={toggleBookmark}
                    onReadMore={() => setActiveArticle(article)}
                    onShare={() => shareArticle(article)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {articles.filter(a => a.isBookmarked).map((article) => (
                  <ArticleListItem 
                    key={article.id} 
                    article={article} 
                    onBookmarkToggle={toggleBookmark}
                    onReadMore={() => setActiveArticle(article)}
                    onShare={() => shareArticle(article)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!activeArticle} onOpenChange={(open) => !open && setActiveArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          {activeArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{activeArticle.title}</DialogTitle>
                <DialogDescription className="flex items-center justify-between">
                  <span>{activeArticle.source} • {formatDate(activeArticle.publishedAt)}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleBookmark(activeArticle.id)}
                    >
                      {activeArticle.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => shareArticle(activeArticle)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeArticle.imageUrl && (
                  <div 
                    className="h-56 w-full overflow-hidden rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeArticle.imageUrl})` }}
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{activeArticle.category}</Badge>
                  {activeArticle.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium">Summary</h3>
                  <p className="mt-1 text-muted-foreground">{activeArticle.summary}</p>
                </div>
                <div>
                  <h3 className="font-medium">Content</h3>
                  <p className="mt-1 text-muted-foreground">{activeArticle.content}</p>
                </div>
                {activeArticle.suggestion && (
                  <div className="rounded-lg bg-secondary p-4">
                    <h3 className="font-medium">AI Suggestion</h3>
                    <p className="mt-1 text-muted-foreground">{activeArticle.suggestion}</p>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full ${getScoreColor(activeArticle.relevanceScore)}`} />
                    <span className="text-sm">Relevance Score: {activeArticle.relevanceScore}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(activeArticle.url, "_blank")}
                    className="flex items-center gap-1"
                  >
                    View Original <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ArticleCardProps {
  article: Article
  onBookmarkToggle: (id: string) => void
  onReadMore: () => void
  onShare: () => void
}

function ArticleCard({ article, onBookmarkToggle, onReadMore, onShare }: ArticleCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-48 w-full overflow-hidden bg-cover bg-center transition-transform group-hover:scale-105"
        style={{ backgroundImage: `url(${article.imageUrl})` }}
      />
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{article.category}</Badge>
          <div className="flex items-center">
            <span className={`inline-block h-2 w-2 rounded-full ${getScoreColor(article.relevanceScore)}`} />
            <span className="ml-1 text-xs">{article.relevanceScore}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
        <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.source}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={onReadMore}>Read More</Button>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onBookmarkToggle(article.id)}
          >
            {article.isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Action <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <ListTodo className="mr-2 h-4 w-4" />
                <span>Add to Tasks</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Add to Meetings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                <span>Add to Brainstorm</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center" onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share Article</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}

interface ArticleListItemProps {
  article: Article
  onBookmarkToggle: (id: string) => void
  onReadMore: () => void
  onShare: () => void
}

function ArticleListItem({ article, onBookmarkToggle, onReadMore, onShare }: ArticleListItemProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div 
          className="h-32 w-full overflow-hidden bg-cover bg-center transition-transform group-hover:scale-105 md:h-auto md:w-48 md:rounded-l-lg md:rounded-tr-none"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
        <div className="flex flex-1 flex-col">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{article.category}</Badge>
              <div className="flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full ${getScoreColor(article.relevanceScore)}`} />
                <span className="ml-1 text-xs">{article.relevanceScore}</span>
              </div>
            </div>
            <CardTitle className="line-clamp-1 text-lg">{article.title}</CardTitle>
            <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex justify-between p-4 pt-0">
            <Button variant="outline" size="sm" onClick={onReadMore}>Read More</Button>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onBookmarkToggle(article.id)}
              >
                {article.isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Action <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <ListTodo className="mr-2 h-4 w-4" />
                    <span>Add to Tasks</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Add to Meetings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span>Add to Brainstorm</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share Article</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

function getScoreColor(score: number): string {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function formatDate(dateString: string): string {
  // Parse the date string
  const date = new Date(dateString);
  
  // Format the date in a way that's consistent between server and client
  // by manually constructing the string instead of using toLocaleDateString
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  
  return `${month} ${day}`;
}

function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
