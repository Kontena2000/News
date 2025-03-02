
import { 
  ArrowRight, 
  Database, 
  FileText, 
  Filter, 
  Globe, 
  Search, 
  Sparkles, 
  Zap,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function PipelineOverview() {
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
        <CardTitle>News Processing Pipeline</CardTitle>
        <CardDescription>
          How the system collects, processes, and delivers news content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Visual Pipeline Flow */}
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border bg-card p-4 md:p-6">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-4">
            <PipelineStep 
              icon={<Globe className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />}
              title="Source Collection"
              description="News sources are collected based on your configured trusted sources"
            />
            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-0.5 bg-border md:hidden"></div>
            <PipelineStep 
              icon={<FileText className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />}
              title="Prompt Enhancement"
              description="Base prompts are enhanced with context from your organization"
            />
            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-0.5 bg-border md:hidden"></div>
            <PipelineStep 
              icon={<Zap className="h-6 w-6 md:h-8 md:w-8 text-amber-500" />}
              title="AI Processing"
              description="AI models analyze and extract relevant information"
            />
            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-0.5 bg-border md:hidden"></div>
            <PipelineStep 
              icon={<Filter className="h-6 w-6 md:h-8 md:w-8 text-green-500" />}
              title="Filtering & Scoring"
              description="Content is filtered and scored based on relevance"
            />
            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-0.5 bg-border md:hidden"></div>
            <PipelineStep 
              icon={<Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />}
              title="Summarization"
              description="Articles are summarized for quick consumption"
            />
          </div>
        </div>

        <Separator />

        {/* Detailed Explanation */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">How It Works</h3>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("source")}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h4 className="text-lg font-medium">1. Source Collection</h4>
              </div>
              {expandedSection === "source" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {(expandedSection === "source" || expandedSection === null) && (
              <p className="text-muted-foreground px-4">
                The system starts by collecting news from your configured trusted sources. These sources are defined in the Sources tab and can include websites, RSS feeds, and other content providers. You can prioritize certain sources over others to ensure you get the most relevant information.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("prompt")}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <h4 className="text-lg font-medium">2. Prompt Enhancement</h4>
              </div>
              {expandedSection === "prompt" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {(expandedSection === "prompt" || expandedSection === null) && (
              <p className="text-muted-foreground px-4">
                The base prompt (configured in the Prompt tab) is enhanced with context from your organization&apos;s data. This context enrichment helps the AI understand what&apos;s relevant to your specific needs. The system uses vector embeddings to find related information in your database to include in the prompt.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("ai")}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h4 className="text-lg font-medium">3. AI Processing</h4>
              </div>
              {expandedSection === "ai" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {(expandedSection === "ai" || expandedSection === null) && (
              <p className="text-muted-foreground px-4">
                The enhanced prompt is sent to the AI model (Perplexity, OpenAI, or Anthropic) configured in the Advanced tab. The AI processes the request, searching for and analyzing news content based on your prompt. The model&apos;s parameters (temperature, max tokens) affect how the AI interprets and responds to the prompt.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("filtering")}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-green-500" />
                <h4 className="text-lg font-medium">4. Filtering & Scoring</h4>
              </div>
              {expandedSection === "filtering" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {(expandedSection === "filtering" || expandedSection === null) && (
              <p className="text-muted-foreground px-4">
                The raw results from the AI are filtered based on your settings. Articles are scored for relevance to your organization, and those below your minimum relevance threshold are removed. The system also filters by categories, date ranges, and other criteria you&apos;ve configured.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-secondary/50"
              onClick={() => toggleSection("summarization")}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h4 className="text-lg font-medium">5. Summarization</h4>
              </div>
              {expandedSection === "summarization" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {(expandedSection === "summarization" || expandedSection === null) && (
              <p className="text-muted-foreground px-4">
                Finally, the filtered articles are summarized according to your summarization settings. This includes generating concise summaries of individual articles as well as daily summaries that highlight the most important news across all sources. The summarization process uses the AI model to extract the most relevant information.
              </p>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Data Flow Diagram */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Data Flow</h3>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border bg-card p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Database className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
                <div className="flex-1">
                  <h4 className="font-medium">Settings Database</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Stores your configuration</p>
                </div>
              </div>
              <div className="ml-8 flex items-center">
                <div className="h-8 w-0.5 bg-border"></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <Search className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
                <div className="flex-1">
                  <h4 className="font-medium">News Service</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Processes requests using your settings</p>
                </div>
              </div>
              <div className="ml-8 flex items-center">
                <div className="h-8 w-0.5 bg-border"></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                <div className="flex-1">
                  <h4 className="font-medium">External API Service</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Communicates with AI providers</p>
                </div>
              </div>
              <div className="ml-8 flex items-center">
                <div className="h-8 w-0.5 bg-border"></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <Database className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                <div className="flex-1">
                  <h4 className="font-medium">Results Database</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Stores processed articles</p>
                </div>
              </div>
              <div className="ml-8 flex items-center">
                <div className="h-8 w-0.5 bg-border"></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                <div className="flex-1">
                  <h4 className="font-medium">User Interface</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Displays news to users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PipelineStep({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border bg-background">
        {icon}
      </div>
      <h3 className="text-xs md:text-sm font-medium">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-[120px] md:max-w-[150px]">{description}</p>
    </div>
  )
}
