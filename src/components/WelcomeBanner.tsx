
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Settings, X, Check, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  if (dismissed) return null

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-blue-800 dark:text-blue-300">Welcome to News Scraper</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDismissed(true)}
            className="h-8 w-8 text-blue-600 dark:text-blue-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-400">
          Complete the setup to start collecting and analyzing news
        </CardDescription>
      </CardHeader>
      <CardContent className="text-blue-700 dark:text-blue-400">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              {setupComplete ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Set up the database</h3>
              <p className="text-sm">
                Configure your Supabase database to store prompt logs and other data
              </p>
              <Alert className="mt-2 border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                <Database className="h-4 w-4" />
                <AlertDescription>
                  The Supabase service role key has been added to your configuration. Use the setup secret key from your .env.local file to create the required tables.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          <Separator className="bg-blue-200 dark:bg-blue-800" />
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Configure API keys</h3>
              <p className="text-sm">
                Add your Perplexity, OpenAI, or other API keys to enable news fetching and analysis
              </p>
            </div>
          </div>
          
          <Separator className="bg-blue-200 dark:bg-blue-800" />
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Customize your news sources</h3>
              <p className="text-sm">
                Select which news sources and topics to monitor for your organization
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-blue-200 pt-4 dark:border-blue-800">
        <Link href="/settings?tab=advanced" passHref>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
            Go to Settings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
