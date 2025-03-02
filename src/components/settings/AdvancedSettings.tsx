
import { Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
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
        <DatabaseConnectionSettings />
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Perplexity API Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="perplexity-api-key">Perplexity API Key</Label>
            <Input 
              id="perplexity-api-key"
              type="password"
              placeholder="pplx-..."
            />
            <p className="text-sm text-muted-foreground">
              API key for Perplexity services
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perplexity-model">Perplexity Model</Label>
            <Select defaultValue="mixtral-8x7b-instruct">
              <SelectTrigger id="perplexity-model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixtral-8x7b-instruct">Mixtral 8x7B Instruct</SelectItem>
                <SelectItem value="codellama-70b-instruct">CodeLlama 70B Instruct</SelectItem>
                <SelectItem value="llama-3-70b-instruct">Llama-3 70B Instruct</SelectItem>
                <SelectItem value="sonar-small-online">Sonar Small Online</SelectItem>
                <SelectItem value="sonar-medium-online">Sonar Medium Online</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Perplexity model to use for news fetching and analysis
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perplexity-max-tokens">Max Tokens</Label>
            <div className="flex items-center gap-4">
              <Slider 
                id="perplexity-max-tokens"
                defaultValue={[1024]} 
                max={4096} 
                min={256} 
                step={128}
                className="flex-1"
              />
              <span className="w-12 text-sm">1024</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum number of tokens to generate in the response
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perplexity-temperature">Temperature</Label>
            <div className="flex items-center gap-4">
              <Slider 
                id="perplexity-temperature"
                defaultValue={[0.7]} 
                max={1} 
                min={0} 
                step={0.1}
                className="flex-1"
              />
              <span className="w-12 text-sm">0.7</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Controls randomness: lower values are more deterministic, higher values more creative
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perplexity-endpoint">API Endpoint</Label>
            <Input 
              id="perplexity-endpoint"
              defaultValue="https://api.perplexity.ai/chat/completions"
              placeholder="https://api.perplexity.ai/chat/completions"
            />
            <p className="text-sm text-muted-foreground">
              Perplexity API endpoint URL
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">OpenAI API Settings</h3>
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
            <Label htmlFor="model-selection">OpenAI Model</Label>
            <Select defaultValue="gpt-4">
              <SelectTrigger id="model-selection">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              OpenAI model to use for content generation and analysis
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Pinecone Vector Database</h3>
          <div className="space-y-2">
            <Label htmlFor="pinecone-api-key">Pinecone API Key</Label>
            <Input 
              id="pinecone-api-key"
              type="password"
              placeholder="pcsk_..."
            />
            <p className="text-sm text-muted-foreground">
              API key for Pinecone vector database
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pinecone-url">Pinecone URL</Label>
            <Input 
              id="pinecone-url"
              placeholder="https://your-index.svc.region.pinecone.io"
            />
            <p className="text-sm text-muted-foreground">
              Pinecone service URL for your index
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pinecone-namespace">Pinecone Namespace</Label>
            <Input 
              id="pinecone-namespace"
              placeholder="namespace"
            />
            <p className="text-sm text-muted-foreground">
              Namespace for organizing vectors within your Pinecone index
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pinecone-dimension">Vector Dimension</Label>
            <Input 
              id="pinecone-dimension"
              type="number"
              defaultValue="1536"
              placeholder="1536"
            />
            <p className="text-sm text-muted-foreground">
              Dimension of vectors stored in Pinecone (1536 for OpenAI embeddings)
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="pinecone-metadata" defaultChecked />
              <Label htmlFor="pinecone-metadata">Include Metadata</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Store additional metadata with vectors for better retrieval
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Anthropic API Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
            <Input 
              id="anthropic-api-key"
              type="password"
              placeholder="sk-ant-..."
            />
            <p className="text-sm text-muted-foreground">
              API key for Anthropic services
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="anthropic-model">Anthropic Model</Label>
            <Select defaultValue="claude-3-opus">
              <SelectTrigger id="anthropic-model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="claude-2">Claude 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Anthropic model to use for content generation and analysis
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">System Settings</h3>
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
          
          <div className="space-y-2">
            <Label htmlFor="api-provider">Default API Provider</Label>
            <Select defaultValue="perplexity">
              <SelectTrigger id="api-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perplexity">Perplexity</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select which API provider to use by default
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
