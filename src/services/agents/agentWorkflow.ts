
import { NewsSettings } from "@/types/settings";
import { Article, ResearchPlan, ResearchTask } from "@/types/agents";
import { researchLeaderAgent } from "./researchLeaderAgent";
import { projectPlannerAgent } from "./projectPlannerAgent";
import { researchAssistantAgent } from "./researchAssistantAgent";
import { editorAgent } from "./editorAgent";

export const executeAgentWorkflow = async (
  settings: NewsSettings,
  onProgress?: (stage: string, message: string) => void
): Promise<Article> => {
  try {
    // Step 1: Research Leader Agent creates a research plan
    onProgress?.("research_leader", "Creating research plan...");
    const researchPlan = await researchLeaderAgent(settings);
    onProgress?.("research_leader", "Research plan created successfully");
    
    // Step 2: Project Planner Agent breaks down the research plan into tasks
    onProgress?.("project_planner", "Breaking down research plan into tasks...");
    const tasks = await projectPlannerAgent(researchPlan, settings);
    onProgress?.("project_planner", "Research tasks created successfully");
    
    // Step 3: Research Assistant Agents execute the tasks
    onProgress?.("research_assistants", `Executing ${tasks.length} research tasks...`);
    const completedTasks: ResearchTask[] = [];
    
    for (const task of tasks) {
      onProgress?.("research_assistants", `Researching: ${task.title}...`);
      
      try {
        // Update task status
        task.status = "in_progress";
        
        // Execute the task
        const results = await researchAssistantAgent(task, settings);
        
        // Update task with results
        task.results = results;
        task.status = "completed";
        
        completedTasks.push(task);
        
        onProgress?.("research_assistants", `Completed research on: ${task.title}`);
      } catch (error) {
        console.error(`Error executing task ${task.id}:`, error);
        
        // Update task with error
        task.status = "error";
        task.error = error instanceof Error ? error.message : String(error);
        
        completedTasks.push(task);
        
        onProgress?.("research_assistants", `Error researching: ${task.title}`);
      }
    }
    
    // Step 4: Editor Agent compiles the research into an article
    onProgress?.("editor", "Compiling research into article...");
    const article = await editorAgent(completedTasks, settings);
    onProgress?.("editor", "Article compiled successfully");
    
    return article;
  } catch (error) {
    console.error("Error in agent workflow:", error);
    throw error;
  }
};
