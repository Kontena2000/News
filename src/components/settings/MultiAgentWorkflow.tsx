
import { useState } from "react"
import { 
  ArrowRight, 
  Brain, 
  ClipboardList, 
  Users, 
  Edit, 
  FileText,
  Globe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function MultiAgentWorkflow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Agent News Research Workflow</CardTitle>
        <CardDescription>
          How our AI agents collaborate to research and produce comprehensive news articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Simple Visual Workflow Diagram */}
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border bg-card p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Initial Input */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">News Sources & Settings</h3>
                <p className="text-sm text-muted-foreground">Configuration from settings page</p>
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            
            {/* Research Leader Agent */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium">Research Leader Agent</h3>
                <p className="text-sm text-muted-foreground">Creates research plan & outline</p>
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            
            {/* Project Planner Agent */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <ClipboardList className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Project Planner Agent</h3>
                <p className="text-sm text-muted-foreground">Breaks down research into tasks</p>
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            
            {/* Research Assistant Agents */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Research Assistant Agents</h3>
                <p className="text-sm text-muted-foreground">Execute research tasks in parallel</p>
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            
            {/* Editor Agent */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <Edit className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Editor Agent</h3>
                <p className="text-sm text-muted-foreground">Compiles research into article</p>
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            
            {/* Final Output */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-background">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Completed Article</h3>
                <p className="text-sm text-muted-foreground">Ready for display in news feed</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Simple Description */}
        <div>
          <h3 className="text-xl font-medium mb-4">How It Works</h3>
          <p className="text-muted-foreground mb-4">
            Our multi-agent system uses specialized AI agents that work together to research and produce comprehensive news articles:
          </p>
          <ol className="space-y-2 list-decimal pl-5">
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Research Leader:</span> Creates a research plan based on your settings
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Project Planner:</span> Breaks down the research plan into specific tasks
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Research Assistants:</span> Execute the research tasks using Perplexity API
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Editor:</span> Compiles all research into a coherent, well-structured article
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
