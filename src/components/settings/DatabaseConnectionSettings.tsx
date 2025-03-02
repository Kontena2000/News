
import { useState } from "react"
import { Database, CheckCircle, XCircle, RefreshCw, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export function DatabaseConnectionSettings() {
  const [dbType, setDbType] = useState("postgres")
  const [connectionString, setConnectionString] = useState("")
  const [dbHost, setDbHost] = useState("localhost")
  const [dbPort, setDbPort] = useState("5432")
  const [dbUsername, setDbUsername] = useState("")
  const [dbPassword, setDbPassword] = useState("")
  const [dbName, setDbName] = useState("")
  const [sslMode, setSslMode] = useState("require")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")
  const [connectionError, setConnectionError] = useState("")
  const [useConnectionString, setUseConnectionString] = useState(false)
  
  const handleTestConnection = () => {
    setConnectionStatus("connecting")
    setConnectionError("")
    
    // Simulate connection test with timeout
    setTimeout(() => {
      // For demo purposes, we'll randomly succeed or fail
      if (Math.random() > 0.3) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
        setConnectionError("Failed to connect to database. Please check your credentials and try again.")
      }
    }, 1500)
  }
  
  return (
    <Accordion type="single" collapsible defaultValue="database-connection">
      <AccordionItem value="database-connection">
        <AccordionTrigger className="flex items-center">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Database Connection</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6">
          {/* Connection Status Indicator */}
          {connectionStatus !== "idle" && (
            <div className="mb-4">
              {connectionStatus === "connecting" && (
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    <AlertDescription className="text-blue-600 dark:text-blue-400">
                      Testing connection...
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              
              {connectionStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Connection successful! Database is reachable and credentials are valid.
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              
              {connectionStatus === "error" && (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      {connectionError || "Connection failed. Please check your settings and try again."}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          )}
          
          {/* Database Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="db-type">Database Type</Label>
            <Select 
              value={dbType} 
              onValueChange={setDbType}
            >
              <SelectTrigger id="db-type">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgres">PostgreSQL</SelectItem>
                <SelectItem value="neon">Neon Postgres</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select the type of database you want to connect to
            </p>
          </div>
          
          {/* Connection Method Toggle */}
          <div className="space-y-2">
            <Label>Connection Method</Label>
            <RadioGroup 
              defaultValue={useConnectionString ? "string" : "fields"}
              onValueChange={(value) => setUseConnectionString(value === "string")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="string" id="connection-string" />
                <Label htmlFor="connection-string">Connection String</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fields" id="connection-fields" />
                <Label htmlFor="connection-fields">Individual Fields</Label>
              </div>
            </RadioGroup>
          </div>
          
          {useConnectionString ? (
            <div className="space-y-2">
              <Label htmlFor="connection-string-input">Connection String</Label>
              <Input 
                id="connection-string-input"
                type="password"
                placeholder="postgresql://username:password@localhost:5432/database"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the full connection string for your database
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Host</Label>
                  <Input 
                    id="db-host"
                    placeholder="localhost"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input 
                    id="db-port"
                    placeholder="5432"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-name">Database Name</Label>
                <Input 
                  id="db-name"
                  placeholder="mydatabase"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-username">Username</Label>
                  <Input 
                    id="db-username"
                    placeholder="username"
                    value={dbUsername}
                    onChange={(e) => setDbUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password">Password</Label>
                  <Input 
                    id="db-password"
                    type="password"
                    placeholder="••••••••"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ssl-mode">SSL Mode</Label>
                <Select 
                  value={sslMode} 
                  onValueChange={setSslMode}
                >
                  <SelectTrigger id="ssl-mode">
                    <SelectValue placeholder="Select SSL mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disable">Disable</SelectItem>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="prefer">Prefer</SelectItem>
                    <SelectItem value="require">Require</SelectItem>
                    <SelectItem value="verify-ca">Verify CA</SelectItem>
                    <SelectItem value="verify-full">Verify Full</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Configure SSL/TLS security for the database connection
                </p>
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex items-center space-x-2">
            <Switch id="auto-reconnect" defaultChecked />
            <Label htmlFor="auto-reconnect">Auto-reconnect on failure</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setConnectionString("")
                setDbHost("localhost")
                setDbPort("5432")
                setDbUsername("")
                setDbPassword("")
                setDbName("")
                setSslMode("require")
                setConnectionStatus("idle")
              }}
            >
              Reset
            </Button>
            <Button 
              onClick={handleTestConnection}
              disabled={connectionStatus === "connecting"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
