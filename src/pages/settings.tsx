
import Head from "next/head"
import { useState } from "react"
import { 
  Settings as SettingsIcon,
  FileText,
  Globe,
  BarChart3,
  Layout,
  Sparkles,
  Wrench,
  Save,
  Star,
  X,
  Check
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [resultsLimit, setResultsLimit] = useState(50)
  
  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <>
      <Head>
        <title>Settings - ZORK News Scraper</title>
        <meta name="description" content="Configure your news scraper settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure how the ZORK News Scraper collects and processes news
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="prompt" className="space-y-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Sources</span>
            </TabsTrigger>
            <TabsTrigger value="relevance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Relevance</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="hidden md:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="summarization" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Summarization</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Prompt Configuration */}
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Configuration</CardTitle>
                <CardDescription>
                  Configure the primary news-gathering prompt and related settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-prompt">Primary News-Gathering Prompt</Label>
                    <Textarea 
                      id="primary-prompt"
                      placeholder="Find news articles about developments in AI technology that could impact marketing agencies"
                      className="min-h-[120px]"
                      defaultValue="Find news articles about developments in AI technology that could impact marketing agencies"
                    />
                    <p className="text-sm text-muted-foreground">
                      This prompt will be used as the base for gathering relevant news articles
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Company Focus Selectors</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: "products", label: "Products" },
                        { id: "competitors", label: "Competitors" },
                        { id: "industry", label: "Industry", defaultChecked: true },
                        { id: "technology", label: "Technology", defaultChecked: true },
                        { id: "market-trends", label: "Market Trends" },
                        { id: "regulations", label: "Regulations" }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox id={item.id} defaultChecked={item.defaultChecked} />
                          <Label htmlFor={item.id}>{item.label}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select aspects of your company to emphasize in news gathering
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-frequency">Update Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="update-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to refresh news data
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="results-limit">Results Limit: <span className="font-normal">{resultsLimit} articles</span></Label>
                    </div>
                    <Slider 
                      defaultValue={[resultsLimit]} 
                      max={100} 
                      min={10} 
                      step={5}
                      onValueChange={(value) => setResultsLimit(value[0])}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum number of articles to collect per update (10-100)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Source Management */}
          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Source Management</CardTitle>
                <CardDescription>
                  Configure trusted sources, social media integration, and content filters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible defaultValue="trusted-sources">
                  <AccordionItem value="trusted-sources">
                    <AccordionTrigger>Trusted Sources Table</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { domain: "techcrunch.com", category: "Technology", priority: 5 },
                            { domain: "wired.com", category: "Technology", priority: 4 },
                            { domain: "bloomberg.com", category: "Finance", priority: 5 },
                            { domain: "marketingdive.com", category: "Marketing", priority: 3 },
                            { domain: "socialmediatoday.com", category: "Social Media", priority: 2 }
                          ].map((source) => (
                            <TableRow key={source.domain}>
                              <TableCell>{source.domain}</TableCell>
                              <TableCell>
                                <Select defaultValue={source.category.toLowerCase()}>
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="social media">Social Media</SelectItem>
                                    <SelectItem value="industry">Industry</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex text-yellow-500">
                                  {Array.from({ length: source.priority }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4" />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Enter domain (e.g., example.com)" className="flex-1" />
                        <Button>Add Source</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="social-media">
                    <AccordionTrigger>Social Media Integration</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="twitter-toggle" className="font-medium">Twitter/X Integration</Label>
                            <Badge variant="outline">Beta</Badge>
                          </div>
                          <Switch id="twitter-toggle" />
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="twitter-accounts">Accounts to Follow</Label>
                            <Input 
                              id="twitter-accounts" 
                              placeholder="@techcrunch, @wired, @marketingcloud"
                              defaultValue="@techcrunch, @wired, @marketingcloud"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="retweet-threshold">Minimum Retweet Threshold</Label>
                            <Input 
                              id="retweet-threshold" 
                              type="number" 
                              defaultValue={50}
                              min={0}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="reddit-toggle" className="font-medium">Reddit Integration</Label>
                            <Badge variant="outline">Beta</Badge>
                          </div>
                          <Switch id="reddit-toggle" />
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="subreddits">Subreddits to Monitor</Label>
                            <Input 
                              id="subreddits" 
                              placeholder="r/marketing, r/technology, r/digitalmarketing"
                              defaultValue="r/marketing, r/technology, r/digitalmarketing"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="upvote-threshold">Minimum Upvote Threshold</Label>
                            <Input 
                              id="upvote-threshold" 
                              type="number" 
                              defaultValue={100}
                              min={0}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="content-filters">
                    <AccordionTrigger>Content Filter Controls</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language-filter">Language Preferences</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language-filter">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="all">All Languages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Content Type Checkboxes</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="news-articles" defaultChecked />
                            <Label htmlFor="news-articles">News Articles</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="blog-posts" defaultChecked />
                            <Label htmlFor="blog-posts">Blog Posts</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="press-releases" defaultChecked />
                            <Label htmlFor="press-releases">Press Releases</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="research-papers" />
                            <Label htmlFor="research-papers">Research Papers</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="exclusion-keywords">Exclusion Keywords</Label>
                        <Textarea 
                          id="exclusion-keywords"
                          placeholder="spam, clickbait, promotional"
                          defaultValue="spam, clickbait, promotional"
                        />
                        <p className="text-sm text-muted-foreground">
                          Terms that automatically exclude content (comma separated)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age-limit">Age Limit Selector</Label>
                        <Select defaultValue="7">
                          <SelectTrigger id="age-limit">
                            <SelectValue placeholder="Select age limit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Maximum age of content to include
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Relevance Settings */}
          <TabsContent value="relevance">
            <Card>
              <CardHeader>
                <CardTitle>Relevance Settings</CardTitle>
                <CardDescription>
                  Configure how content relevance is determined
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Relevance Settings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This section will contain settings for minimum relevance score, keyword boost management, competitor handling, and context scoring weights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Configuration */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Configuration</CardTitle>
                <CardDescription>
                  Configure how news content is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <Layout className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Display Configuration</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This section will contain settings for default view, sort order, items per page, card style options, and saved filters management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summarization Controls */}
          <TabsContent value="summarization">
            <Card>
              <CardHeader>
                <CardTitle>Summarization Controls</CardTitle>
                <CardDescription>
                  Configure how articles are summarized and daily news flashes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Summarization Controls</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This section will contain settings for article summary length and style, as well as daily news flash configuration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Configuration */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
                <CardDescription>
                  Configure technical settings and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <Wrench className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Advanced Configuration</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This section will contain settings for vector database connection, API credential management, debug tools, and ZORK CMS integration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
