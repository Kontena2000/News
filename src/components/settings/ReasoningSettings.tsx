
import { useState } from "react"
import { Clock, Copy, ExternalLink, Eye, EyeOff, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for prompt logs
const mockPromptLogs = [
  {
    id: "1",
    timestamp: "2025-03-02T06:15:00Z",
    originalPrompt: "Find news about HPC innovations in the last week",
    enhancedPrompt: `CONTEXT:
      Company Name: Kontena
      Industry: Technology, HPC, Bitcoin, Energy Storage
      Key Products: Modular HPC solutions, Bitcoin mining infrastructure, Energy storage systems
      Competitors: Traditional HPC providers, Bitcoin mining companies
      Interests: HPC innovations, energy efficiency, modular solutions
    
    BASE PROMPT:
    Find news about HPC innovations in the last week
    
    Please return the results as a JSON array of news articles with the following structure:
    [
      {
        "title": "Article Title",
        "summary": "Brief summary of the article",
        "content": "Full content of the article",
        "url": "URL to the original article",
        "source": "Source name",
        "sourceUrl": "URL of the source",
        "imageUrl": "URL to an image for the article",
        "publishedAt": "Publication date in ISO format",
        "category": "Article category",
        "tags": ["tag1", "tag2", "tag3"]
      }
    ]`,
    provider: "perplexity",
    articleCount: 12,
    status: "success"
  },
  {
    id: "2",
    timestamp: "2025-03-01T18:30:00Z",
    originalPrompt: "Latest developments in Bitcoin mining efficiency",
    enhancedPrompt: `CONTEXT:
      Company Name: Kontena
      Industry: Technology, HPC, Bitcoin, Energy Storage
      Key Products: Modular HPC solutions, Bitcoin mining infrastructure, Energy storage systems
      Competitors: Traditional HPC providers, Bitcoin mining companies
      Interests: HPC innovations, energy efficiency, modular solutions
    
    BASE PROMPT:
    Latest developments in Bitcoin mining efficiency
    
    Please return the results as a JSON array of news articles with the following structure:
    [
      {
        "title": "Article Title",
        "summary": "Brief summary of the article",
        "content": "Full content of the article",
        "url": "URL to the original article",
        "source": "Source name",
        "sourceUrl": "URL of the source",
        "imageUrl": "URL to an image for the article",
        "publishedAt": "Publication date in ISO format",
        "category": "Article category",
        "tags": ["tag1", "tag2", "tag3"]
      }
    ]`,
    provider: "perplexity",
    articleCount: 8,
    status: "success"
  },
  {
    id: "3",
    timestamp: "2025-02-28T09:45:00Z",
    originalPrompt: "Energy storage breakthroughs for data centers",
    enhancedPrompt: `CONTEXT:
      Company Name: Kontena
      Industry: Technology, HPC, Bitcoin, Energy Storage
      Key Products: Modular HPC solutions, Bitcoin mining infrastructure, Energy storage systems
      Competitors: Traditional HPC providers, Bitcoin mining companies
      Interests: HPC innovations, energy efficiency, modular solutions
    
    BASE PROMPT:
    Energy storage breakthroughs for data centers
    
    Please return the results as a JSON array of news articles with the following structure:
    [
      {
        "title": "Article Title",
        "summary": "Brief summary of the article",
        "content": "Full content of the article",
        "url": "URL to the original article",
        "source": "Source name",
        "sourceUrl": "URL of the source",
        "imageUrl": "URL to an image for the article",
        "publishedAt": "Publication date in ISO format",
        "category": "Article category",
        "tags": ["tag1", "tag2", "tag3"]
      }
    ]`,
    provider: "perplexity",
    articleCount: 15,
    status: "success"
  }
];

export function ReasoningSettings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<typeof mockPromptLogs[0] | null>(null)
  const [showFullPrompts, setShowFullPrompts] = useState(false)
  
  // Filter logs based on search query
  const filteredLogs = mockPromptLogs.filter(log => 
    log.originalPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.enhancedPrompt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Copy prompt to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
    alert("Copied to clipboard");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reasoning & Prompt Logs</CardTitle>
        <CardDescription>
          View the history of prompts sent to AI providers and how they were enhanced
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompt logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullPrompts(!showFullPrompts)}
          >
            {showFullPrompts ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Compact View
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Full View
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Providers</TabsTrigger>
            <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Original Prompt</TableHead>
                  <TableHead className="w-[100px]">Provider</TableHead>
                  <TableHead className="w-[100px]">Articles</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {showFullPrompts ? (
                        <div className="whitespace-pre-wrap text-sm">{log.originalPrompt}</div>
                      ) : (
                        <div className="truncate max-w-[400px] text-sm">{log.originalPrompt}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.provider}</Badge>
                    </TableCell>
                    <TableCell>{log.articleCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPrompt(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(log.enhancedPrompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="perplexity" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Original Prompt</TableHead>
                  <TableHead className="w-[100px]">Articles</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs
                  .filter(log => log.provider === "perplexity")
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {showFullPrompts ? (
                          <div className="whitespace-pre-wrap text-sm">{log.originalPrompt}</div>
                        ) : (
                          <div className="truncate max-w-[400px] text-sm">{log.originalPrompt}</div>
                        )}
                      </TableCell>
                      <TableCell>{log.articleCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPrompt(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(log.enhancedPrompt)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="openai" className="mt-4">
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No OpenAI prompt logs found</p>
            </div>
          </TabsContent>
          
          <TabsContent value="anthropic" className="mt-4">
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No Anthropic prompt logs found</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Prompt Detail Dialog */}
        <Dialog open={!!selectedPrompt} onOpenChange={(open) => !open && setSelectedPrompt(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Prompt Details</DialogTitle>
              <DialogDescription>
                View the original and enhanced prompts sent to {selectedPrompt?.provider}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPrompt && (
              <div className="space-y-4 overflow-hidden flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden flex-1">
                  <Card className="overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Original Prompt</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden flex-1 p-0">
                      <ScrollArea className="h-[400px] p-4">
                        <div className="whitespace-pre-wrap text-sm font-mono">
                          {selectedPrompt.originalPrompt}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Enhanced Prompt</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden flex-1 p-0">
                      <ScrollArea className="h-[400px] p-4">
                        <div className="whitespace-pre-wrap text-sm font-mono">
                          {selectedPrompt.enhancedPrompt}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Timestamp:</span> {new Date(selectedPrompt.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Provider:</span> {selectedPrompt.provider}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Articles:</span> {selectedPrompt.articleCount}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(selectedPrompt.enhancedPrompt)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Enhanced Prompt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(selectedPrompt.originalPrompt)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Original Prompt
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">About Prompt Reasoning</h3>
          <p className="text-muted-foreground">
            This tab shows the history of prompts sent to AI providers like Perplexity. You can see how your base prompts are enhanced with context from your organization before being sent to the AI.
          </p>
          <p className="text-muted-foreground">
            Understanding the reasoning behind prompt enhancement helps you:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>See how company context influences news gathering</li>
            <li>Understand why certain articles are returned</li>
            <li>Refine your base prompts for better results</li>
            <li>Track the history of news queries over time</li>
          </ul>
          <p className="text-muted-foreground">
            Prompt logs are stored for 30 days before being automatically deleted.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
