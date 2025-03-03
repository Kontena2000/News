
import Head from "next/head"
import dynamic from "next/dynamic"
import { 
  FileText,
  Globe,
  Sparkles,
  Wrench,
  Info,
  BrainCircuit,
  Loader2,
  Activity,
  ListChecks,
  Bug,
  Network
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptSettings } from "@/components/settings/PromptSettings"
import { SourceSettings } from "@/components/settings/SourceSettings"
import { SummarizationSettings } from "@/components/settings/SummarizationSettings"
import { AdvancedSettings } from "@/components/settings/AdvancedSettings"
import { PipelineOverview } from "@/components/settings/PipelineOverview"
import { PipelineStepByStep } from "@/components/settings/PipelineStepByStep"
import { DebuggingGuide } from "@/components/settings/DebuggingGuide"
import { MultiAgentWorkflow } from "@/components/settings/MultiAgentWorkflow"

// Dynamically import components that use server-side libraries
// This prevents them from being bundled during build time for client-side rendering

// Dynamically import the ReasoningSettings component with SSR disabled
const ReasoningSettings = dynamic(
  () => import("@/components/settings/ReasoningSettings").then(mod => mod.ReasoningSettings),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading reasoning settings...</span>
      </div>
    )
  }
)

// Dynamically import the PipelineMonitor component with SSR disabled
const PipelineMonitor = dynamic(
  () => import("@/components/settings/PipelineMonitor").then(mod => mod.PipelineMonitor),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading pipeline monitor...</span>
      </div>
    )
  }
)

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings - News Scraper</title>
        <meta name="description" content="Configure your news scraper settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure how the News Scraper collects and processes news
            </p>
          </div>
        </div>

        <Tabs defaultValue="step-by-step" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-10">
            <TabsTrigger value="step-by-step" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden md:inline">Step by Step</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden md:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Sources</span>
            </TabsTrigger>
            <TabsTrigger value="summarization" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Summarization</span>
            </TabsTrigger>
            <TabsTrigger value="reasoning" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden md:inline">Reasoning</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span className="hidden md:inline">Debug</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Step by Step Guide */}
          <TabsContent value="step-by-step">
            <PipelineStepByStep />
          </TabsContent>

          {/* Pipeline Overview */}
          <TabsContent value="overview">
            <PipelineOverview />
          </TabsContent>
          
          {/* Multi-Agent Workflow */}
          <TabsContent value="agents">
            <MultiAgentWorkflow />
          </TabsContent>

          {/* Prompt Configuration */}
          <TabsContent value="prompt">
            <PromptSettings />
          </TabsContent>

          {/* Source Management */}
          <TabsContent value="sources">
            <SourceSettings />
          </TabsContent>

          {/* Summarization Controls */}
          <TabsContent value="summarization">
            <SummarizationSettings />
          </TabsContent>

          {/* Reasoning & Prompt Logs */}
          <TabsContent value="reasoning">
            <ReasoningSettings />
          </TabsContent>

          {/* Pipeline Monitor */}
          <TabsContent value="monitor">
            <PipelineMonitor />
          </TabsContent>

          {/* Debugging Guide */}
          <TabsContent value="debug">
            <DebuggingGuide />
          </TabsContent>

          {/* Advanced Configuration */}
          <TabsContent value="advanced">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
