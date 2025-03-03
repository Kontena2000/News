
import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AlertCircle, 
  Check, 
  XCircle, 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Play,
  Database,
  Globe,
  FileText,
  Zap,
  Filter,
  Sparkles,
  Search,
  BookOpen,
  ClipboardList,
  Users,
  Edit
} from "lucide-react"

// Import service check functions
import { checkSupabaseConnection } from "@/services/supabaseService"

// Define log entry type
type LogEntry = {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
  stage: "init" | "research_leader" | "project_planner" | "research_assistants" | "editor" | "storage" | "complete"
}

// Define service type
type Service = {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "unknown"
  icon: React.ReactNode
  lastChecked: Date | null
  checkConnection?: () => Promise<boolean>
}

// Function to check Pinecone connection via API route
const checkPineconeConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/pinecone-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error checking Pinecone connection:', error);
    return false;
  }
};

export function PipelineMonitor() {
  // State for pipeline testing
  const [isTestingPipeline, setIsTestingPipeline] = useState(false)
  const [pipelineLogs, setPipelineLogs] = useState<LogEntry[]>([])
  
  // State for services
  const [services, setServices] = useState<Service[]>([
    {
      id: "perplexity",
      name: "Perplexity API",
      description: "AI model for news processing",
      status: "unknown",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      lastChecked: null,
      checkConnection: async () => {
        // In a real implementation, this would check the Perplexity API
        // For now, we'll simulate a check based on whether the API key is set
        const apiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY
        return !!apiKey
      }
    },
    {
      id: "openai",
      name: "OpenAI API",
      description: "Alternative AI model",
      status: "unknown",
      icon: <Sparkles className="h-5 w-5 text-green-500" />,
      lastChecked: null,
      checkConnection: async () => {
        // In a real implementation, this would check the OpenAI API
        // For now, we'll simulate a check based on whether the API key is set
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
        return !!apiKey
      }
    },
    {
      id: "pinecone",
      name: "Pinecone",
      description: "Vector database for embeddings",
      status: "unknown",
      icon: <Database className="h-5 w-5 text-blue-500" />,
      lastChecked: null,
      checkConnection: checkPineconeConnection
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Database for storing articles and logs",
      status: "unknown",
      icon: <Database className="h-5 w-5 text-purple-500" />,
      lastChecked: null,
      checkConnection: checkSupabaseConnection
    },
    {
      id: "news-sources",
      name: "News Sources",
      description: "External news APIs and websites",
      status: "unknown",
      icon: <Globe className="h-5 w-5 text-indigo-500" />,
      lastChecked: null,
      checkConnection: async () => {
        // In a real implementation, this would check the news APIs
        // For now, we'll simulate a successful connection
        return true
      }
    },
    {
      id: "news-service",
      name: "News Service",
      description: "Internal service for processing news",
      status: "unknown",
      icon: <Search className="h-5 w-5 text-orange-500" />,
      lastChecked: null,
      checkConnection: async () => {
        // In a real implementation, this would check the internal service
        // For now, we'll simulate a successful connection
        return true
      }
    }
  ])
  
  // Add a log entry
  const addLogEntry = (level: LogEntry["level"], message: string, stage: LogEntry["stage"]) => {
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      stage
    }
    
    setPipelineLogs(prev => [...prev, newEntry])
  }
  
  // Clear logs
  const clearLogs = () => {
    setPipelineLogs([])
  }
  
  // Update service status
  const updateServiceStatus = (serviceId: string, status: Service["status"]) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status, lastChecked: new Date() } 
          : service
      )
    )
  }
  
  // Check all services
  const checkAllServices = async () => {
    // Reset all services to unknown
    setServices(prev => 
      prev.map(service => ({ ...service, status: "unknown", lastChecked: null }))
    )
    
    // Check each service
    for (const service of services) {
      addLogEntry("info", `Checking connection to ${service.name}...`, "init")
      
      try {
        // Use the service's checkConnection function if available
        if (service.checkConnection) {
          const isConnected = await service.checkConnection()
          updateServiceStatus(service.id, isConnected ? "connected" : "disconnected")
          
          if (isConnected) {
            addLogEntry("success", `Successfully connected to ${service.name}`, "init")
          } else {
            addLogEntry("error", `Failed to connect to ${service.name}`, "init")
          }
        } else {
          // Fallback to simulation if no check function is available
          await simulateDelay(500)
          const isConnected = Math.random() > 0.3
          updateServiceStatus(service.id, isConnected ? "connected" : "disconnected")
          
          if (isConnected) {
            addLogEntry("success", `Successfully connected to ${service.name}`, "init")
          } else {
            addLogEntry("error", `Failed to connect to ${service.name}`, "init")
          }
        }
      } catch (error) {
        console.error(`Error checking connection to ${service.name}:`, error)
        updateServiceStatus(service.id, "disconnected")
        addLogEntry("error", `Error checking connection to ${service.name}: ${error instanceof Error ? error.message : String(error)}`, "init")
      }
    }
  }
  
  // Test the complete pipeline
  const testPipeline = async () => {
    // Reset logs and set testing state
    clearLogs()
    setIsTestingPipeline(true)
    
    try {
      // Check all services first
      addLogEntry("info", "Starting pipeline test...", "init")
      addLogEntry("info", "Checking service connections...", "init")
      await checkAllServices()
      
      // Check if any critical services are disconnected
      const criticalServices = ["perplexity", "supabase", "pinecone"]
      const disconnectedCritical = services.filter(
        service => criticalServices.includes(service.id) && service.status === "disconnected"
      )
      
      if (disconnectedCritical.length > 0) {
        addLogEntry(
          "error", 
          `Critical services disconnected: ${disconnectedCritical.map(s => s.name).join(", ")}`, 
          "init"
        )
        addLogEntry("error", "Pipeline test aborted due to disconnected services", "init")
        setIsTestingPipeline(false)
        return
      }
      
      // Log successful initialization
      addLogEntry("success", "Service connections verified", "init")
      await simulateDelay(500)
      
      // Simulate Research Leader Agent
      addLogEntry("info", "Starting Research Leader Agent...", "research_leader")
      await simulateDelay(800)
      addLogEntry("info", "Analyzing prompt and company context...", "research_leader")
      await simulateDelay(1000)
      addLogEntry("info", "Creating research plan and table of contents...", "research_leader")
      await simulateDelay(1200)
      addLogEntry("success", "Research plan created with 5 main sections", "research_leader")
      
      // Simulate Project Planner Agent
      addLogEntry("info", "Starting Project Planner Agent...", "project_planner")
      await simulateDelay(700)
      addLogEntry("info", "Breaking down research plan into tasks...", "project_planner")
      await simulateDelay(900)
      addLogEntry("info", "Assigning priorities and research depth to tasks...", "project_planner")
      await simulateDelay(800)
      addLogEntry("success", "Created 8 research tasks with priorities", "project_planner")
      
      // Randomly decide if we should simulate an error
      const shouldError = Math.random() < 0.3
      
      // Simulate Research Assistant Agents
      addLogEntry("info", "Starting Research Assistant Agents...", "research_assistants")
      await simulateDelay(600)
      addLogEntry("info", "Assigning tasks to research assistants...", "research_assistants")
      await simulateDelay(800)
      
      // Simulate multiple research assistants working
      for (let i = 1; i <= 3; i++) {
        addLogEntry("info", `Research Assistant ${i} starting work on assigned tasks...`, "research_assistants")
        await simulateDelay(1000)
        
        if (shouldError && i === 2) {
          addLogEntry("error", `Research Assistant ${i} encountered an error: Rate limit exceeded`, "research_assistants")
          addLogEntry("warning", `Reassigning tasks from Research Assistant ${i}...`, "research_assistants")
          await simulateDelay(800)
        } else {
          addLogEntry("success", `Research Assistant ${i} completed assigned tasks`, "research_assistants")
        }
      }
      
      addLogEntry("success", "All research tasks completed", "research_assistants")
      
      // Simulate Editor Agent
      addLogEntry("info", "Starting Editor Agent...", "editor")
      await simulateDelay(700)
      addLogEntry("info", "Collecting research from all assistants...", "editor")
      await simulateDelay(900)
      addLogEntry("info", "Compiling research into coherent article...", "editor")
      await simulateDelay(1200)
      addLogEntry("info", "Adding citations and formatting...", "editor")
      await simulateDelay(800)
      addLogEntry("success", "Article successfully compiled", "editor")
      
      // Simulate storing in Supabase
      addLogEntry("info", "Connecting to Supabase...", "storage")
      await simulateDelay(500)
      addLogEntry("info", "Storing article in database...", "storage")
      await simulateDelay(1000)
      
      if (shouldError) {
        addLogEntry("warning", "Duplicate article detected, updating existing record", "storage")
        await simulateDelay(700)
        addLogEntry("success", "Article successfully updated in database", "storage")
      } else {
        addLogEntry("success", "Article successfully stored in database", "storage")
      }
      
      // Complete the pipeline
      addLogEntry("info", "Finalizing pipeline execution...", "complete")
      await simulateDelay(500)
      addLogEntry("success", "Pipeline test completed successfully", "complete")
      
      // Summary
      if (shouldError) {
        addLogEntry("warning", "Pipeline completed with warnings/errors. See log for details.", "complete")
      } else {
        addLogEntry("success", "Pipeline completed without errors", "complete")
      }
    } catch (error) {
      console.error("Error during pipeline test:", error)
      addLogEntry("error", `Pipeline test failed: ${error instanceof Error ? error.message : String(error)}`, "complete")
    } finally {
      setIsTestingPipeline(false)
    }
  }
  
  // Helper function to simulate delay
  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  // Format timestamp for logs
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  }
  
  // Get color for log level
  const getLogLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "info": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "success": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }
  
  // Get icon for log level
  const LogLevelIcon = ({ level }: { level: LogEntry["level"] }) => {
    switch (level) {
      case "info": return <Terminal className="h-4 w-4" />
      case "warning": return <AlertCircle className="h-4 w-4" />
      case "error": return <XCircle className="h-4 w-4" />
      case "success": return <Check className="h-4 w-4" />
    }
  }
  
  // Get badge for pipeline stage
  const StageBadge = ({ stage }: { stage: LogEntry["stage"] }) => {
    let label = ""
    let variant: "default" | "secondary" | "outline" = "outline"
    let icon: React.ReactNode = null
    
    switch (stage) {
      case "init":
        label = "Initialization"
        icon = <Terminal className="h-3 w-3 mr-1" />
        break
      case "research_leader":
        label = "Research Leader"
        icon = <BookOpen className="h-3 w-3 mr-1" />
        break
      case "project_planner":
        label = "Project Planner"
        icon = <ClipboardList className="h-3 w-3 mr-1" />
        break
      case "research_assistants":
        label = "Research Assistants"
        icon = <Users className="h-3 w-3 mr-1" />
        break
      case "editor":
        label = "Editor"
        icon = <Edit className="h-3 w-3 mr-1" />
        break
      case "storage":
        label = "Storage"
        icon = <Database className="h-3 w-3 mr-1" />
        break
      case "complete":
        label = "Completion"
        variant = "secondary"
        icon = <Check className="h-3 w-3 mr-1" />
        break
    }
    
    return (
      <Badge variant={variant} className="ml-2 flex items-center">
        {icon}
        {label}
      </Badge>
    )
  }
  
  // Get status indicator for service
  const ServiceStatusIndicator = ({ status }: { status: Service["status"] }) => {
    switch (status) {
      case "connected":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
          </div>
        )
      case "disconnected":
        return (
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Disconnected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Unknown</span>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Monitor</CardTitle>
          <CardDescription>
            Monitor and test the multi-agent news research & article generation pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Services Status Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Services Status</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkAllServices}
                disabled={isTestingPipeline}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Check Connections
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {service.icon}
                          <span className="font-medium">{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        <ServiceStatusIndicator status={service.status} />
                      </TableCell>
                      <TableCell>
                        {service.lastChecked 
                          ? formatTimestamp(service.lastChecked) 
                          : "Never"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Agent Workflow Diagram */}
          <div className="border rounded-md p-4 bg-muted/20">
            <h3 className="text-lg font-medium mb-3">Multi-Agent Workflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center">
              <div className="flex flex-col items-center p-3 bg-background rounded-md border w-full md:w-1/5">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium">Research Leader</h4>
                <p className="text-xs text-muted-foreground mt-1">Plans research & creates TOC</p>
              </div>
              <div className="hidden md:block text-muted-foreground">→</div>
              <div className="flex flex-col items-center p-3 bg-background rounded-md border w-full md:w-1/5">
                <ClipboardList className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium">Project Planner</h4>
                <p className="text-xs text-muted-foreground mt-1">Breaks down into tasks</p>
              </div>
              <div className="hidden md:block text-muted-foreground">→</div>
              <div className="flex flex-col items-center p-3 bg-background rounded-md border w-full md:w-1/5">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium">Research Assistants</h4>
                <p className="text-xs text-muted-foreground mt-1">Gather information</p>
              </div>
              <div className="hidden md:block text-muted-foreground">→</div>
              <div className="flex flex-col items-center p-3 bg-background rounded-md border w-full md:w-1/5">
                <Edit className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium">Editor</h4>
                <p className="text-xs text-muted-foreground mt-1">Compiles final article</p>
              </div>
            </div>
          </div>
          
          {/* Pipeline Test Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Pipeline Test</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearLogs}
                disabled={isTestingPipeline || pipelineLogs.length === 0}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Logs
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={testPipeline}
                disabled={isTestingPipeline}
                className="flex items-center gap-1"
              >
                {isTestingPipeline ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Run Pipeline
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Test the complete multi-agent news research and article generation pipeline with your current configuration. This will simulate the entire process from research planning to article creation.
          </p>
          
          {/* Log Display */}
          <div>
            <h3 className="text-md font-medium mb-2">Pipeline Execution Log</h3>
            {pipelineLogs.length > 0 ? (
              <div className="border rounded-md bg-muted/40">
                <ScrollArea className="h-[400px] w-full">
                  <div className="p-3 space-y-2">
                    {pipelineLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`text-sm p-2 rounded flex items-start ${getLogLevelColor(log.level)}`}
                      >
                        <div className="mr-2 mt-0.5">
                          <LogLevelIcon level={log.level} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-mono text-xs opacity-70">{formatTimestamp(log.timestamp)}</span>
                            <StageBadge stage={log.stage} />
                          </div>
                          <div className="mt-1">{log.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center bg-muted/20">
                <Terminal className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Click &quot;Run Pipeline&quot; to test the multi-agent news research pipeline
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
