
import Head from "next/head"
import { useState } from "react"
import { 
  Settings as SettingsIcon,
  FileText,
  Globe,
  Sparkles,
  Wrench,
  Star,
  X,
  Plus
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
  const [resultsLimit, setResultsLimit] = useState(50)
  const [newBranch, setNewBranch] = useState("")
  const [branches, setBranches] = useState([
    { id: "1", name: "HPC", maxArticles: 20 },
    { id: "2", name: "Bitcoin", maxArticles: 15 },
    { id: "3", name: "Energy Storage", maxArticles: 25 }
  ])
  
  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranches([
        ...branches,
        { id: Date.now().toString(), name: newBranch.trim(), maxArticles: 20 }
      ])
      setNewBranch("")
    }
  }
  
  const handleRemoveBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id))
  }
  
  const handleMaxArticlesChange = (id: string, value: number) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, maxArticles: value } : branch
    ))
  }
  
  const kontenaPrompt = `*Goal:*  
You are a smart AI Assistant capable of identifying and estimating which topics are of high priority to Kontena. Your objective is to determine subjects with high importance and significance for creating business opportunities and understanding the HPC, Bitcoin, and energy storage sectors in which Kontena operates.  

---

*Return Format:*  
Only list topics that contain high-value keywords relevant to Kontena's business activities. Do not include unrelated or low-priority topics.  

---

*Warnings:*  
- Ensure that the returned topics align with the main business activities of Kontena.  
- Focus on topics that create synergy with our services, solutions, and modular products.  
- Do not include generic industry trends unless they directly impact Kontena's ability to innovate, provide modular solutions, or generate business opportunities.  

---

*Context Dump:*  
Kontena is a Belgium-based company operating in the HPC (High-Performance Computing), Bitcoin, and energy storage sectors. Our primary activity is to provide services, solutions, and products to businesses looking to start or expand in these fields.  

Kontena's key strengths include:  
- Offering modular solutions that deviate from traditional consultancy approaches.  
- A strong "can-do" mentality, providing flexible and out-of-the-box solutions.  
- Adapting quickly to new technological advancements and industry shifts.  

We seek topics that enhance our market position, provide competitive advantages, and align with our vision of revolutionizing HPC and energy storage through innovative modular solutions.`

  const summarizationPrompt = `Below is a collection of articles from our database. Each article has metadata fields such as title, source, date, overall_score, business_area, key_innovations, relevance_factors, kontena_opportunity, and keywords. Summarize all of these articles into concise bullet points, focusing on HPC, Bitcoin mining, and Energy Storage news. If articles mention heat recovery, immersion cooling, battery technology, or other high-priority innovations, include them in the summary. Omit generic or unrelated content.
Context:
Kontena specializes in modular HPC data centers, sustainable Bitcoin mining, and energy storage solutions.
Articles are already filtered for technical innovation, business impact, and sustainability.
Summaries should highlight any synergy or business opportunity for Kontena.
If multiple articles share the same theme (e.g., immersion cooling), group them together under a single bullet point for clarity.
Output Format:
Overall Summary (2-3 sentences): A top-level overview of the main themes and trends.
Key Highlights (Bulleted List): Summaries of each relevant article, grouped by business area (HPC, Bitcoin, Energy Storage).
For each bullet:
Mention the article title or a short reference.
Briefly state the main insight or innovation.
Note any synergy with Kontena's focus on modular solutions, sustainability, or heat recovery.
Notable Opportunities (Optional): List 2-3 cross-cutting opportunities for Kontena if applicable.
Database Content:
{INSERT YOUR ARTICLES HERE IN A STRUCTURED FORMAT}
Remember:
Keep your response concise, but with enough detail to understand the significance of each article.
Combine or group articles covering the same theme.
Do not output chain-of-thought; just provide the final summaries and any relevant context for Kontena.`

  return (
    <>
      <Head>
        <title>Settings - News Scraper</title>
        <meta name="description" content="Configure your news scraper settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure how the News Scraper collects and processes news
            </p>
          </div>
        </div>

        <Tabs defaultValue="prompt" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Sources</span>
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
                      placeholder="Enter your search prompt"
                      className="min-h-[300px] font-mono text-sm"
                      defaultValue={kontenaPrompt}
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
                  
                  {/* Company Branches Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Company Branches</Label>
                    </div>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Branch Name</TableHead>
                            <TableHead>Max Articles</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {branches.map((branch) => (
                            <TableRow key={branch.id}>
                              <TableCell>{branch.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Slider 
                                    defaultValue={[branch.maxArticles]} 
                                    max={50} 
                                    min={5} 
                                    step={5}
                                    onValueChange={(value) => handleMaxArticlesChange(branch.id, value[0])}
                                    className="w-32"
                                  />
                                  <span className="text-sm">{branch.maxArticles}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveBranch(branch.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex items-center space-x-2">
                        <Input 
                          placeholder="Enter new branch name" 
                          className="flex-1" 
                          value={newBranch}
                          onChange={(e) => setNewBranch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
                        />
                        <Button onClick={handleAddBranch}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Branch
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Configure company branches (e.g., HPC, Bitcoin, Energy Storage) and set maximum articles per branch
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summarization-prompt">Summarization Prompt</Label>
                    <Textarea 
                      id="summarization-prompt"
                      placeholder="Enter your summarization prompt"
                      className="min-h-[300px] font-mono text-sm"
                      defaultValue={summarizationPrompt}
                    />
                    <p className="text-sm text-muted-foreground">
                      This prompt will be used to generate summaries of news articles
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="summary-length">Summary Length</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="summary-length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                        <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                        <SelectItem value="long">Long (2-3 paragraphs)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How long the generated summaries should be
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="daily-summary-frequency">Daily Summary Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="daily-summary-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays Only</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to generate daily news summaries
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-quotes" defaultChecked />
                      <Label htmlFor="include-quotes">Include Key Quotes</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Include important quotes from the original articles in summaries
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="highlight-keywords" defaultChecked />
                      <Label htmlFor="highlight-keywords">Highlight Keywords</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Highlight important keywords in the generated summaries
                    </p>
                  </div>
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
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">OpenAI API Key</Label>
                    <Input 
                      id="api-key"
                      type="password"
                      placeholder="sk-..."
                    />
                    <p className="text-sm text-muted-foreground">
                      API key for OpenAI services
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model-selection">AI Model</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger id="model-selection">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      AI model to use for content generation and analysis
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="debug-mode" />
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for troubleshooting
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="cache-results" defaultChecked />
                      <Label htmlFor="cache-results">Cache Results</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cache API responses to reduce costs and improve performance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
