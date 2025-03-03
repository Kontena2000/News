
import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertCircle, 
  Bug, 
  CheckCircle2, 
  Clipboard, 
  Database, 
  ExternalLink, 
  FileCode, 
  Info, 
  KeyRound, 
  Network, 
  RefreshCw, 
  Server, 
  Settings, 
  Zap 
} from "lucide-react"

export function DebuggingGuide() {
  const [activeTab, setActiveTab] = useState<string>("connection")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            <CardTitle>Debugging Guide</CardTitle>
          </div>
          <CardDescription>
            Troubleshoot common issues with your News Scraper deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="info" className="bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4" />
            <AlertTitle>Debugging Mode</AlertTitle>
            <AlertDescription>
              This guide will help you identify and fix common issues with your News Scraper deployment.
              Follow the steps below to diagnose and resolve problems.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="connection" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span>Connection Issues</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="deployment" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span>Deployment</span>
              </TabsTrigger>
            </TabsList>

            {/* Connection Issues Tab */}
            <TabsContent value="connection" className="space-y-4">
              <h3 className="text-lg font-medium">Diagnosing Connection Issues</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pinecone">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span>Pinecone Connection Issues</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>If you're having trouble connecting to Pinecone, check the following:</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Verify Environment Variables</h4>
                      <div className="rounded-md bg-muted p-3 font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_PINECONE_API_KEY</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_PINECONE_API_KEY", "pinecone-key")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "pinecone-key" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>NEXT_PUBLIC_PINECONE_INDEX</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_PINECONE_INDEX", "pinecone-index")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "pinecone-index" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>NEXT_PUBLIC_PINECONE_ENVIRONMENT</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_PINECONE_ENVIRONMENT", "pinecone-env")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "pinecone-env" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium">2. Check Pinecone Console</h4>
                      <p>Verify that your index exists and is active in the Pinecone console.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => window.open("https://app.pinecone.io/", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Pinecone Console
                      </Button>
                      
                      <h4 className="font-medium">3. Common Errors</h4>
                      <div className="space-y-2">
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Index not found</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Make sure the index name in your environment variables matches exactly with the one in your Pinecone console.
                          </p>
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Authentication failed</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Your API key may be invalid or expired. Generate a new API key in the Pinecone console.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="supabase">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>Supabase Connection Issues</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>If you're having trouble connecting to Supabase, check the following:</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Verify Environment Variables</h4>
                      <div className="rounded-md bg-muted p-3 font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_SUPABASE_URL</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_URL", "supabase-url")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "supabase-url" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_ANON_KEY", "supabase-key")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "supabase-key" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium">2. Check Database Schema</h4>
                      <p>Ensure your Supabase database has the required tables:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>prompt_logs</li>
                        <li>articles</li>
                        <li>sources</li>
                      </ul>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 mt-2"
                        onClick={() => window.open("https://app.supabase.io/", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Supabase Dashboard
                      </Button>
                      
                      <h4 className="font-medium">3. Common Errors</h4>
                      <div className="space-y-2">
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Relation does not exist</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            The required tables may not exist in your Supabase database. Create the missing tables.
                          </p>
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Invalid API key</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Your anon key may be invalid. Check the API settings in your Supabase dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="perplexity">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Perplexity API Issues</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p>If you're having trouble connecting to the Perplexity API, check the following:</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Verify Environment Variables</h4>
                      <div className="rounded-md bg-muted p-3 font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_PERPLEXITY_API_KEY</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_PERPLEXITY_API_KEY", "perplexity-key")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "perplexity-key" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span>NEXT_PUBLIC_PERPLEXITY_ENDPOINT</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard("NEXT_PUBLIC_PERPLEXITY_ENDPOINT", "perplexity-endpoint")}
                            className="h-6 gap-1"
                          >
                            <Clipboard className="h-3 w-3" />
                            {copiedText === "perplexity-endpoint" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium">2. Check API Status</h4>
                      <p>Verify that the Perplexity API is operational.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => window.open("https://docs.perplexity.ai/", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Perplexity API Docs
                      </Button>
                      
                      <h4 className="font-medium">3. Common Errors</h4>
                      <div className="space-y-2">
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Unauthorized</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Your API key may be invalid or expired. Check your Perplexity account for a valid API key.
                          </p>
                        </div>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
                          <p className="font-medium text-amber-800 dark:text-amber-300">Error: Rate limit exceeded</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            You may have exceeded your API usage limits. Check your Perplexity account for usage details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Connection Test</h3>
                <p className="text-muted-foreground mb-3">
                  Use the Pipeline Monitor to test connections to all services.
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="default" 
                    onClick={() => {
                      // Navigate to the monitor tab
                      const monitorTab = document.querySelector('[value="monitor"]') as HTMLElement;
                      if (monitorTab) monitorTab.click();
                    }}
                    className="gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Go to Pipeline Monitor
                  </Button>
                  <Badge variant="outline" className="gap-1">
                    <Info className="h-3 w-3" />
                    Recommended
                  </Badge>
                </div>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-4">
              <h3 className="text-lg font-medium">API Key Troubleshooting</h3>
              
              <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security Warning</AlertTitle>
                <AlertDescription>
                  Never expose your API keys in client-side code. Always use environment variables and server-side API routes.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    Vercel Environment Variables
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Make sure your API keys are properly set in your Vercel project settings.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Navigate to Settings → Environment Variables</li>
                    <li>Verify that all required API keys are set</li>
                    <li>Ensure the variable names match exactly with what's expected in the code</li>
                    <li>After updating environment variables, redeploy your application</li>
                  </ol>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 mt-3"
                    onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Vercel Dashboard
                  </Button>
                </div>
                
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Required Environment Variables
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    These are the environment variables required for the application to function properly.
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-md bg-muted p-3">
                      <h5 className="text-sm font-medium">Perplexity API</h5>
                      <div className="font-mono text-xs mt-1">
                        <div>NEXT_PUBLIC_PERPLEXITY_API_KEY</div>
                        <div>NEXT_PUBLIC_PERPLEXITY_ENDPOINT</div>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <h5 className="text-sm font-medium">OpenAI API (Optional)</h5>
                      <div className="font-mono text-xs mt-1">
                        <div>NEXT_PUBLIC_OPENAI_API_KEY</div>
                        <div>NEXT_PUBLIC_OPENAI_ENDPOINT</div>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <h5 className="text-sm font-medium">Pinecone</h5>
                      <div className="font-mono text-xs mt-1">
                        <div>NEXT_PUBLIC_PINECONE_API_KEY</div>
                        <div>NEXT_PUBLIC_PINECONE_INDEX</div>
                        <div>NEXT_PUBLIC_PINECONE_ENVIRONMENT</div>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <h5 className="text-sm font-medium">Supabase</h5>
                      <div className="font-mono text-xs mt-1">
                        <div>NEXT_PUBLIC_SUPABASE_URL</div>
                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" />
                    Using Mock Mode for Development
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    If you're developing locally or don't have all API keys, you can use mock mode.
                  </p>
                  <div className="rounded-md bg-muted p-3 font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_USE_MOCK_DATA=true</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard("NEXT_PUBLIC_USE_MOCK_DATA=true", "mock-mode")}
                        className="h-6 gap-1"
                      >
                        <Clipboard className="h-3 w-3" />
                        {copiedText === "mock-mode" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Setting this to <code className="text-xs bg-muted px-1 py-0.5 rounded">true</code> will use mock data instead of making actual API calls.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Deployment Tab */}
            <TabsContent value="deployment" className="space-y-4">
              <h3 className="text-lg font-medium">Vercel Deployment Troubleshooting</h3>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    Deployment Logs
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Check your Vercel deployment logs for errors.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Click on the latest deployment</li>
                    <li>Check the "Build Logs" and "Runtime Logs" tabs for errors</li>
                    <li>Look for any failed builds or runtime errors</li>
                  </ol>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 mt-3"
                    onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Vercel Dashboard
                  </Button>
                </div>
                
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Redeployment Steps
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    If you've made changes to environment variables or need to force a fresh deployment:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Click on the "Deployments" tab</li>
                    <li>Click "Redeploy" on your latest deployment</li>
                    <li>Select "Redeploy with existing Build Cache" or "Redeploy without Build Cache" for a complete rebuild</li>
                  </ol>
                </div>
                
                <div className="rounded-md border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Deployment Checklist
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Use this checklist to ensure your deployment is properly configured:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">All environment variables are set in Vercel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">API keys are valid and not expired</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">Pinecone index exists and is properly configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">Supabase database has the required tables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">Latest code is pushed to the repository</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded border flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm">Build completed successfully without errors</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              variant="default" 
              onClick={() => {
                // Navigate to the monitor tab
                const monitorTab = document.querySelector('[value="monitor"]') as HTMLElement;
                if (monitorTab) monitorTab.click();
              }}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Go to Pipeline Monitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
