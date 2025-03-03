
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Database, RefreshCw, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupSecret, setSetupSecret] = useState("")
  const [setupResult, setSetupResult] = useState<{
    success: boolean;
    message: string;
    tables?: string[];
    error?: string;
  } | null>(null)

  const runDatabaseSetup = async () => {
    if (!setupSecret) {
      setSetupResult({
        success: false,
        message: "Please enter the setup secret key",
      })
      return
    }

    setIsLoading(true)
    setSetupResult(null)

    try {
      const response = await fetch("/api/supabase-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: setupSecret }),
      })

      const result = await response.json()
      setSetupResult(result)
    } catch (error) {
      setSetupResult({
        success: false,
        message: "Failed to run database setup",
        error: error instanceof Error ? error.message : String(error),
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
          Database Setup
        </CardTitle>
        <CardDescription>
          Create and update required database tables for prompt logging and data storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This tool will create the necessary tables in your Supabase database using the service role key. 
            Enter the setup secret key from your .env.local file to authorize this operation.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tables">
            <AccordionTrigger className="text-sm font-medium">
              Tables that will be created
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 list-disc text-sm text-muted-foreground space-y-2">
                <li>
                  <span className="font-medium">prompt_logs</span> - Stores the history of prompts used for news fetching
                </li>
                <li>
                  <span className="font-medium">Helper Functions</span> - SQL functions to manage table structure and updates
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2">
          <Label htmlFor="setup-secret">Setup Secret Key</Label>
          <Input
            id="setup-secret"
            type="password"
            placeholder="Enter setup secret key from .env.local"
            value={setupSecret}
            onChange={(e) => setSetupSecret(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            The secret key (SETUP_SECRET_KEY) from your .env.local file that authorizes database setup operations
          </p>
        </div>

        {setupResult && (
          <Alert
            variant={setupResult.success ? "default" : "destructive"}
            className={setupResult.success ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50" : ""}
          >
            {setupResult.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {setupResult.message}
              {setupResult.error && (
                <div className="mt-2 text-sm font-mono">{setupResult.error}</div>
              )}
              {setupResult.tables && setupResult.tables.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Tables created:</p>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {setupResult.tables.map((table) => (
                      <li key={table}>{table}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={runDatabaseSetup}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Setup...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create/Update Tables
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
