
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
  Search
} from "lucide-react"

// Import service check functions
import { checkSupabaseConnection } from "@/services/supabaseService"

// Define log entry type
type LogEntry = {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
  stage: "init" | "fetch" | "process" | "store" | "complete"
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
      
      // Simulate fetching news sources
      addLogEntry("info", "Connecting to news sources...", "fetch")
      await simulateDelay(800)
      addLogEntry("info", "Fetching articles from 5 sources...", "fetch")
      await simulateDelay(1200)
      
      // Randomly decide if we should simulate an error
      const shouldError = Math.random() < 0.3
      
      if (shouldError) {
        addLogEntry("error", "Error fetching from source 'TechCrunch': Rate limit exceeded", "fetch")
        addLogEntry("warning", "Continuing with partial data (4/5 sources)", "fetch")
      } else {
        addLogEntry("success", "Successfully fetched 32 articles from 5 sources", "fetch")
      }
      
      // Simulate processing with Perplexity
      addLogEntry("info", "Connecting to Perplexity API...", "process")
      await simulateDelay(700)
      addLogEntry("info", "Generating enhanced prompt with context...", "process")
      await simulateDelay(900)
      addLogEntry("info", "Sending request to Perplexity API...", "process")
      await simulateDelay(1500)
      
      if (shouldError) {
        addLogEntry("warning", "Received partial response from Perplexity API", "process")
      } else {
        addLogEntry("success", "Successfully processed articles with Perplexity API", "process")
      }
      
      // Simulate vector storage with Pinecone
      addLogEntry("info", "Connecting to Pinecone...", "store")
      await simulateDelay(600)
      addLogEntry("info", "Generating embeddings for articles...", "store")
      await simulateDelay(1000)
      addLogEntry("info", "Storing vectors in Pinecone...", "store")
      await simulateDelay(800)
      
      if (shouldError) {
        addLogEntry("error", "Error storing vectors: Pinecone connection timeout", "store")
        addLogEntry("warning", "Retrying with backoff...", "store")
        await simulateDelay(1200)
        addLogEntry("success", "Successfully stored vectors on retry", "store")
      } else {
        addLogEntry("success", "Successfully stored vectors in Pinecone", "store")
      }
      
      // Simulate storing in Supabase
      addLogEntry("info", "Connecting to Supabase...", "store")
      await simulateDelay(500)
      addLogEntry("info", "Storing processed articles in Supabase...", "store")
      await simulateDelay(1000)
      
      if (shouldError) {
        addLogEntry("warning", "Duplicate articles detected, skipping 3 articles", "store")
        addLogEntry("success", "Successfully stored 29/32 articles in Supabase", "store")
      } else {
        addLogEntry("success", "Successfully stored all articles in Supabase", "store")
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
    
    switch (stage) {
      case "init":
        label = "Initialization"
        break
      case "fetch":
        label = "Data Fetching"
        break
      case "process":
        label = "Processing"
        break
      case "store":
        label = "Storage"
        break
      case "complete":
        label = "Completion"
        variant = "secondary"
        break
    }
    
    return <Badge variant={variant} className="ml-2">{label}</Badge>
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
            Monitor and test the news processing pipeline
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
            Test the complete news fetching pipeline with your current configuration. This will simulate the entire process from fetching to storage.
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
                  Click &quot;Run Pipeline&quot; to test the news fetching pipeline
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
