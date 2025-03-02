
import Head from "next/head"
import { useState } from "react"
import { 
  Grid3X3, 
  LayoutList, 
  Sparkles,
  ChevronDown,
  ListTodo,
  Users,
  Lightbulb
} from "lucide-react"

import { mockArticles, mockDailySummary } from "@/data/mock-news"
import { Article } from "@/types/news"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NewsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [articles] = useState<Article[]>(mockArticles)
  const [dailySummary] = useState(mockDailySummary)

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

        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All News</TabsTrigger>
              <TabsTrigger value="daily">Daily Summary</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-4">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Daily News Summary - {new Date(dailySummary.date).toLocaleDateString("en-US")}
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
                        <div key={article.id} className="rounded-lg border p-3">
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

          <TabsContent value="bookmarked" className="mt-4">
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.filter(a => a.isBookmarked).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {articles.filter(a => a.isBookmarked).map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <div 
        className="h-48 w-full overflow-hidden rounded-t-lg bg-cover bg-center"
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
        <Button variant="outline" size="sm">Read More</Button>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

function ArticleListItem({ article }: { article: Article }) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div 
          className="h-32 w-full md:h-auto md:w-48 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none bg-cover bg-center"
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
            <Button variant="outline" size="sm">Read More</Button>
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
              </DropdownMenuContent>
            </DropdownMenu>
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
