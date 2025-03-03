
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Database, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getConnectionStatus } from "@/services/supabaseService"

export function DatabaseConnectionSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "connected" | "disconnected" | "error" | "initializing";
    error: Error | null;
  }>({ status: "initializing", error: null })
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [supabaseServiceKey, setSupabaseServiceKey] = useState("")

  // Load environment variables on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get connection status
      setConnectionStatus(getConnectionStatus())
      
      // Load environment variables
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
      }
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      }
      
      // Check if service key is available (masked)
      if (process.env.SUPABASE_SERVICE_KEY) {
        setSupabaseServiceKey("••••••••••••••••••••••••••••••••")
      } else if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        // For local development, provide a hint about the service key
        setSupabaseServiceKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
      }
    }
  }, [])

  // Test connection to Supabase
  const testConnection = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/supabase-check", {
        method: "GET",
      })
      
      const result = await response.json()
      
      setConnectionStatus({
        status: result.connected ? "connected" : "error",
        error: result.error ? new Error(result.error) : null
      })
    } catch (error) {
      setConnectionStatus({
        status: "error",
        error: error instanceof Error ? error : new Error(String(error))
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection
        </CardTitle>
        <CardDescription>
          Configure connection to your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status:</span>
          <Badge 
            variant={
              connectionStatus.status === "connected" ? "default" : 
              connectionStatus.status === "initializing" ? "outline" : 
              "destructive"
            }
            className={
              connectionStatus.status === "connected" ? "bg-green-500" : 
              connectionStatus.status === "initializing" ? "bg-yellow-500" : 
              ""
            }
          >
            {connectionStatus.status === "connected" ? "Connected" : 
             connectionStatus.status === "initializing" ? "Initializing" : 
             connectionStatus.status === "disconnected" ? "Disconnected" : 
             "Error"}
          </Badge>
        </div>
        
        {connectionStatus.status === "error" && connectionStatus.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionStatus.error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus.status === "connected" && (
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Supabase database
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            placeholder="https://your-project.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            The URL for your Supabase project
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
          <Input
            id="supabase-anon-key"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            The anonymous key for your Supabase project
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supabase-service-key">Supabase Service Role Key</Label>
          <Input
            id="supabase-service-key"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={supabaseServiceKey}
            readOnly
          />
          <p className="text-sm text-muted-foreground">
            The service role key is configured in your .env.local file and is used for database setup operations
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={testConnection}
          disabled={isLoading || !supabaseUrl || !supabaseAnonKey}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
