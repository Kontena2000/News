
import Head from "next/head"
import { 
  FileText,
  Globe,
  Sparkles,
  Wrench
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptSettings } from "@/components/settings/PromptSettings"
import { SourceSettings } from "@/components/settings/SourceSettings"
import { SummarizationSettings } from "@/components/settings/SummarizationSettings"
import { AdvancedSettings } from "@/components/settings/AdvancedSettings"

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

        <Tabs defaultValue="prompt" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
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
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

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

          {/* Advanced Configuration */}
          <TabsContent value="advanced">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
