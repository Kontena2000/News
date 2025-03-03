
import { useState } from "react"
import { 
  Check, 
  ChevronRight, 
  Globe, 
  FileText, 
  Zap, 
  Filter, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define step type
type PipelineStep = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "in-progress" | "completed" | "error"
  tasks: {
    id: string
    title: string
    description: string
    status: "pending" | "in-progress" | "completed" | "error"
  }[]
}

export function PipelineStepByStep() {
  // Define the pipeline steps
  const [steps, setSteps] = useState<PipelineStep[]>([
    {
      id: "sources",
      title: "Configure News Sources",
      description: "Set up the sources where news will be collected from",
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      status: "pending",
      tasks: [
        {
          id: "sources-1",
          title: "Add trusted news sources",
          description: "Go to the Sources tab and add at least 3 trusted news sources",
          status: "pending"
        },
        {
          id: "sources-2",
          title: "Set source priorities",
          description: "Assign priority levels to each source",
          status: "pending"
        },
        {
          id: "sources-3",
          title: "Test source connections",
          description: "Verify that the system can connect to each source",
          status: "pending"
        }
      ]
    },
    {
      id: "prompt",
      title: "Configure Base Prompt",
      description: "Set up the prompt that will be used to process news",
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      status: "pending",
      tasks: [
        {
          id: "prompt-1",
          title: "Create base prompt",
          description: "Go to the Prompt tab and create a base prompt for news processing",
          status: "pending"
        },
        {
          id: "prompt-2",
          title: "Add organization context",
          description: "Include specific context about your organization's interests",
          status: "pending"
        },
        {
          id: "prompt-3",
          title: "Save prompt template",
          description: "Save the prompt template for future use",
          status: "pending"
        }
      ]
    },
    {
      id: "ai",
      title: "Configure AI Processing",
      description: "Set up the AI model that will process the news",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      status: "pending",
      tasks: [
        {
          id: "ai-1",
          title: "Select AI provider",
          description: "Go to the Advanced tab and select your preferred AI provider",
          status: "pending"
        },
        {
          id: "ai-2",
          title: "Configure API keys",
          description: "Enter your API keys for the selected provider",
          status: "pending"
        },
        {
          id: "ai-3",
          title: "Set model parameters",
          description: "Configure temperature, max tokens, and other parameters",
          status: "pending"
        }
      ]
    },
    {
      id: "filtering",
      title: "Configure Filtering & Scoring",
      description: "Set up how news will be filtered and scored",
      icon: <Filter className="h-5 w-5 text-green-500" />,
      status: "pending",
      tasks: [
        {
          id: "filtering-1",
          title: "Set relevance threshold",
          description: "Define the minimum relevance score for articles",
          status: "pending"
        },
        {
          id: "filtering-2",
          title: "Configure category filters",
          description: "Select which categories of news to include or exclude",
          status: "pending"
        },
        {
          id: "filtering-3",
          title: "Set date range filters",
          description: "Define how far back to look for news",
          status: "pending"
        }
      ]
    },
    {
      id: "summarization",
      title: "Configure Summarization",
      description: "Set up how news will be summarized",
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      status: "pending",
      tasks: [
        {
          id: "summarization-1",
          title: "Set summary length",
          description: "Go to the Summarization tab and configure summary length",
          status: "pending"
        },
        {
          id: "summarization-2",
          title: "Configure daily summaries",
          description: "Set up how daily news summaries will be generated",
          status: "pending"
        },
        {
          id: "summarization-3",
          title: "Set summary style",
          description: "Choose between concise, detailed, or bullet-point summaries",
          status: "pending"
        }
      ]
    }
  ]);

  // Calculate overall progress
  const totalTasks = steps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasks = steps.reduce((acc, step) => {
    return acc + step.tasks.filter(task => task.status === "completed").length;
  }, 0);
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Update task status
  const updateTaskStatus = (stepId: string, taskId: string, status: "pending" | "in-progress" | "completed" | "error") => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      const stepIndex = newSteps.findIndex(step => step.id === stepId);
      
      if (stepIndex !== -1) {
        const taskIndex = newSteps[stepIndex].tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
          newSteps[stepIndex].tasks[taskIndex].status = status;
          
          // Update step status based on tasks
          const allCompleted = newSteps[stepIndex].tasks.every(task => task.status === "completed");
          const anyError = newSteps[stepIndex].tasks.some(task => task.status === "error");
          const anyInProgress = newSteps[stepIndex].tasks.some(task => task.status === "in-progress");
          
          if (allCompleted) {
            newSteps[stepIndex].status = "completed";
          } else if (anyError) {
            newSteps[stepIndex].status = "error";
          } else if (anyInProgress) {
            newSteps[stepIndex].status = "in-progress";
          } else {
            newSteps[stepIndex].status = "pending";
          }
        }
      }
      
      return newSteps;
    });
  };

  // Get status icon
  const getStatusIcon = (status: "pending" | "in-progress" | "completed" | "error") => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Check className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: "pending" | "in-progress" | "completed" | "error") => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Error</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Setup Guide</CardTitle>
        <CardDescription>
          Follow these steps to set up your news processing pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Overall Progress</h3>
            <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} tasks completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Separator />

        {/* Step by Step Guide */}
        <div className="space-y-6">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-4">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(step.status)}
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{step.title}</h3>
                          {getStatusBadge(step.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="ml-12 space-y-3">
                      {step.tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 rounded-md border p-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mt-0.5 h-6 w-6 rounded-full"
                            onClick={() => {
                              const newStatus = task.status === "completed" ? "pending" : "completed";
                              updateTaskStatus(step.id, task.id, newStatus);
                            }}
                          >
                            {getStatusIcon(task.status)}
                          </Button>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          </div>
                          <div>
                            {task.status === "completed" ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => updateTaskStatus(step.id, task.id, "pending")}
                              >
                                Reset
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => updateTaskStatus(step.id, task.id, "completed")}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="flex justify-center my-4">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
