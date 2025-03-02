
import { useState, useEffect, useCallback } from "react"
import { Clock, Copy, ExternalLink, Eye, EyeOff, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptLog } from "@/types/settings"

// Mock data for client-side rendering when Supabase is not available
const mockPromptLogs: PromptLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    originalPrompt: "Find news about HPC innovations in the last week",
    enhancedPrompt: "Enhanced prompt with context about HPC innovations...",
    provider: "perplexity",
    articleCount: 12,
    status: "success"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    originalPrompt: "Latest developments in Bitcoin mining efficiency",
    enhancedPrompt: "Enhanced prompt with context about Bitcoin mining...",
    provider: "perplexity",
    articleCount: 8,
    status: "success"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    originalPrompt: "AI advancements in natural language processing",
    enhancedPrompt: "Enhanced prompt with context about NLP advancements...",
    provider: "openai",
    articleCount: 15,
    status: "success"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    originalPrompt: "Quantum computing breakthroughs this month",
    enhancedPrompt: "Enhanced prompt with context about quantum computing...",
    provider: "anthropic",
    articleCount: 6,
    status: "success"
  }
];

// Client-side only implementation of getPromptLogs
const getPromptLogs = async (
  limit: number = 50,
  provider?: "perplexity" | "openai" | "anthropic"
): Promise<PromptLog[]> => {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (provider) {
      return mockPromptLogs.filter(log => log.provider === provider);
    }
    
    return mockPromptLogs;
  } catch (error) {
    console.error("Error retrieving prompt logs:", error);
    return [];
  }
};

// Client-side only implementation of searchPromptLogs
const searchPromptLogs = async (
  searchTerm: string,
  limit: number = 50
): Promise<PromptLog[]> => {
  // In a real implementation, this would call the API
  // For now, we'll use mock data
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockPromptLogs.filter(log => 
      log.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching prompt logs:", error);
    return [];
  }
};

export function ReasoningSettings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<PromptLog | null>(null)
  const [showFullPrompts, setShowFullPrompts] = useState(false)
  const [promptLogs, setPromptLogs] = useState<PromptLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<PromptLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  
  // Memoize fetchPromptLogs to prevent unnecessary re-creation on each render
  const fetchPromptLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = activeTab !== "all" ? activeTab as "perplexity" | "openai" | "anthropic" : undefined;
      const logs = await getPromptLogs(50, provider);
      setPromptLogs(logs);
      setFilteredLogs(logs);
    } catch (err) {
      console.error("Error fetching prompt logs:", err);
      setError("Failed to load prompt logs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);
  
  // Memoize filterLogs to prevent unnecessary re-creation on each render
  const filterLogs = useCallback(async () => {
    if (!searchQuery.trim()) {
      setFilteredLogs(promptLogs);
      return;
    }
    
    try {
      const results = await searchPromptLogs(searchQuery);
      const filtered = activeTab === "all" 
        ? results 
        : results.filter(log => log.provider === activeTab);
      setFilteredLogs(filtered);
    } catch (err) {
      console.error("Error searching prompt logs:", err);
      // Fall back to client-side filtering if search fails
      const filtered = promptLogs.filter(log => 
        (activeTab === "all" || log.provider === activeTab) &&
        (log.originalPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
         log.enhancedPrompt.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredLogs(filtered);
    }
  }, [searchQuery, promptLogs, activeTab]);
  
  // Fetch prompt logs on component mount and when activeTab changes
  useEffect(() => {
    fetchPromptLogs();
  }, [fetchPromptLogs]);
  
  // Filter logs when search query or prompt logs change
  useEffect(() => {
    filterLogs();
  }, [filterLogs]);
  
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
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPromptLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Clock className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-destructive">
            {error}
          </div>
        )}
        
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Providers</TabsTrigger>
            <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLogs.length > 0 ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No prompt logs found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="perplexity" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLogs.filter(log => log.provider === "perplexity").length > 0 ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No Perplexity prompt logs found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="openai" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLogs.filter(log => log.provider === "openai").length > 0 ? (
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
                    .filter(log => log.provider === "openai")
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No OpenAI prompt logs found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="anthropic" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLogs.filter(log => log.provider === "anthropic").length > 0 ? (
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
                    .filter(log => log.provider === "anthropic")
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No Anthropic prompt logs found</p>
              </div>
            )}
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

export default ReasoningSettings;
