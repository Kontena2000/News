import { useState } from "react"
import { 
  ArrowRight, 
  Brain, 
  ClipboardList, 
  Users, 
  Edit, 
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Zap,
  Database,
  Globe,
  Sparkles,
  Network
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MultiAgentWorkflow() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Agent News Research Workflow</CardTitle>
        <CardDescription>
          How our AI agents collaborate to research and produce comprehensive news articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Visual Workflow Diagram */}
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flow">Workflow Flow</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flow" className="mt-6">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Initial Input */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <Globe className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">News Sources & Settings</h3>
                    <p className="text-sm text-muted-foreground">Configuration from settings page</p>
                  </div>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                
                {/* Research Leader Agent */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <Brain className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Research Leader Agent</h3>
                    <p className="text-sm text-muted-foreground">Creates research plan & outline</p>
                  </div>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                
                {/* Project Planner Agent */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <ClipboardList className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Project Planner Agent</h3>
                    <p className="text-sm text-muted-foreground">Breaks down research into tasks</p>
                  </div>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                
                {/* Research Assistant Agents */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Research Assistant Agents</h3>
                    <p className="text-sm text-muted-foreground">Execute research tasks in parallel</p>
                  </div>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                
                {/* Editor Agent */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <Edit className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Editor Agent</h3>
                    <p className="text-sm text-muted-foreground">Compiles research into article</p>
                  </div>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                
                {/* Final Output */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Completed Article</h3>
                    <p className="text-sm text-muted-foreground">Ready for display in news feed</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-6">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border bg-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Column - Input & Planning */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">News Sources</h3>
                        <p className="text-xs text-muted-foreground">Input data</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <Badge variant="outline" className="mr-1">Trusted Sources</Badge>
                      <Badge variant="outline" className="mr-1">Keywords</Badge>
                      <Badge variant="outline" className="mr-1">Categories</Badge>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Brain className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Leader</h3>
                        <p className="text-xs text-muted-foreground">Strategic planning</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Creates research outline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Defines research scope</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Sets research priorities</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <ClipboardList className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Project Planner</h3>
                        <p className="text-xs text-muted-foreground">Task breakdown</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Creates specific tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Assigns search queries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Prioritizes research areas</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Second Column - Research */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Assistants</h3>
                        <p className="text-xs text-muted-foreground">Parallel research</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="rounded border p-2">
                        <div className="font-medium mb-1">Assistant 1</div>
                        <div className="text-xs text-muted-foreground">Researches background information</div>
                      </div>
                      <div className="rounded border p-2">
                        <div className="font-medium mb-1">Assistant 2</div>
                        <div className="text-xs text-muted-foreground">Researches current developments</div>
                      </div>
                      <div className="rounded border p-2">
                        <div className="font-medium mb-1">Assistant 3</div>
                        <div className="text-xs text-muted-foreground">Researches expert opinions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Search className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">External Research</h3>
                        <p className="text-xs text-muted-foreground">Data gathering</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Perplexity API queries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Source verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Data extraction</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Database className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Results</h3>
                        <p className="text-xs text-muted-foreground">Collected data</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <Badge variant="outline" className="mr-1">Facts</Badge>
                      <Badge variant="outline" className="mr-1">Quotes</Badge>
                      <Badge variant="outline" className="mr-1">Statistics</Badge>
                      <Badge variant="outline" className="mr-1">Sources</Badge>
                      <Badge variant="outline" className="mr-1">Images</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Third Column - Compilation & Output */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Edit className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Editor Agent</h3>
                        <p className="text-xs text-muted-foreground">Content compilation</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Combines research findings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Structures article content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Ensures coherence & flow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Adds citations & references</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Enhancement</h3>
                        <p className="text-xs text-muted-foreground">Final touches</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Relevance scoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Category assignment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Tag generation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-background/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Final Article</h3>
                        <p className="text-xs text-muted-foreground">Ready for display</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>Title & Summary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>Full Content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>Images & Sources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>Metadata & Scoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Agent Descriptions */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Agent Roles & Responsibilities</h3>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("leader")}
            >
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <h4 className="text-lg font-medium">Research Leader Agent</h4>
              </div>
              {expandedSection === "leader" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSection === "leader" && (
              <div className="rounded-lg border p-4 bg-background/50 space-y-3">
                <p className="text-muted-foreground">
                  The Research Leader Agent is responsible for creating a comprehensive research plan based on your settings. It analyzes your prompt, keywords, and trusted sources to determine what information needs to be gathered.
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium">Key Responsibilities:</h5>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Analyzing the base prompt and organization context</li>
                    <li>Creating a structured research outline</li>
                    <li>Identifying key areas that need investigation</li>
                    <li>Setting research priorities based on relevance</li>
                    <li>Defining the scope of the research</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Output:</h5>
                  <p className="text-sm text-muted-foreground">
                    A comprehensive research plan with a table of contents, key questions to answer, and a structured approach to gathering information.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("planner")}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-amber-500" />
                <h4 className="text-lg font-medium">Project Planner Agent</h4>
              </div>
              {expandedSection === "planner" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSection === "planner" && (
              <div className="rounded-lg border p-4 bg-background/50 space-y-3">
                <p className="text-muted-foreground">
                  The Project Planner Agent takes the research plan from the Research Leader and breaks it down into specific, actionable research tasks that can be executed in parallel by the Research Assistant Agents.
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium">Key Responsibilities:</h5>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Breaking down the research plan into discrete tasks</li>
                    <li>Creating specific search queries for each task</li>
                    <li>Assigning priority levels to tasks</li>
                    <li>Ensuring comprehensive coverage of the research plan</li>
                    <li>Structuring tasks for parallel execution</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Output:</h5>
                  <p className="text-sm text-muted-foreground">
                    A set of well-defined research tasks, each with specific search queries, priority levels, and expected outputs.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("assistants")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <h4 className="text-lg font-medium">Research Assistant Agents</h4>
              </div>
              {expandedSection === "assistants" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSection === "assistants" && (
              <div className="rounded-lg border p-4 bg-background/50 space-y-3">
                <p className="text-muted-foreground">
                  The Research Assistant Agents execute the research tasks defined by the Project Planner. Multiple assistants work in parallel to gather information from various sources using the Perplexity API.
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium">Key Responsibilities:</h5>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Executing search queries via Perplexity API</li>
                    <li>Gathering relevant information from trusted sources</li>
                    <li>Extracting key facts, quotes, and statistics</li>
                    <li>Collecting relevant images and media</li>
                    <li>Documenting sources and references</li>
                    <li>Organizing research findings in a structured format</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Output:</h5>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive research results for each task, including content, sources, and supporting media.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("editor")}
            >
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-purple-500" />
                <h4 className="text-lg font-medium">Editor Agent</h4>
              </div>
              {expandedSection === "editor" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {expandedSection === "editor" && (
              <div className="rounded-lg border p-4 bg-background/50 space-y-3">
                <p className="text-muted-foreground">
                  The Editor Agent takes all the research results from the Research Assistants and compiles them into a coherent, well-structured news article that follows your summarization preferences.
                </p>
                <div className="space-y-2">
                  <h5 className="font-medium">Key Responsibilities:</h5>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Combining research findings from all tasks</li>
                    <li>Structuring content into a coherent article</li>
                    <li>Writing a compelling title and summary</li>
                    <li>Ensuring proper citation of sources</li>
                    <li>Selecting the most relevant images</li>
                    <li>Applying your summarization preferences</li>
                    <li>Calculating relevance scores</li>
                    <li>Assigning categories and tags</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Output:</h5>
                  <p className="text-sm text-muted-foreground">
                    A complete, publication-ready news article with all necessary metadata, ready to be displayed in your news feed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Data Flow Between Agents */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Data Flow Between Agents</h3>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border bg-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">Settings → Research Leader</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Your configured settings (prompt, sources, keywords) are passed to the Research Leader
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">Research Leader → Project Planner</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Research plan with table of contents is passed to the Project Planner
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Project Planner → Research Assistants</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Specific research tasks with search queries are assigned to Research Assistants
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Research Assistants → Perplexity API</Badge>
                <ArrowRight