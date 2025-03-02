
import { Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatabaseConnectionSettings } from "@/components/settings/DatabaseConnectionSettings"

export function AdvancedSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Configuration</CardTitle>
        <CardDescription>
          Configure technical settings and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Connection Settings */}
        <DatabaseConnectionSettings />
        
        {/* API Settings */}
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input 
              id="api-key"
              type="password"
              placeholder="sk-..."
            />
            <p className="text-sm text-muted-foreground">
              API key for OpenAI services
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model-selection">AI Model</Label>
            <Select defaultValue="gpt-4">
              <SelectTrigger id="model-selection">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              AI model to use for content generation and analysis
            </p>
          </div>
        </div>
        
        {/* System Settings */}
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="debug-mode" />
              <Label htmlFor="debug-mode">Debug Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Enable detailed logging for troubleshooting
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="cache-results" defaultChecked />
              <Label htmlFor="cache-results">Cache Results</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Cache API responses to reduce costs and improve performance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
