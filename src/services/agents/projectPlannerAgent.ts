
import { NewsSettings } from "@/types/settings";
import { ResearchPlan, ResearchTask, ResearchSection } from "@/types/agents";

export const projectPlannerAgent = async (
  researchPlan: ResearchPlan,
  settings: NewsSettings
): Promise<ResearchTask[]> => {
  try {
    // Break down the research plan into specific tasks
    const tasks = await breakdownResearchPlan(researchPlan, settings);
    
    return tasks;
  } catch (error) {
    console.error("Error in Project Planner Agent:", error);
    throw error;
  }
};

const breakdownResearchPlan = async (
  researchPlan: ResearchPlan,
  settings: NewsSettings
): Promise<ResearchTask[]> => {
  // In a real implementation, this would call an AI service to break down the plan
  // For now, we'll create mock tasks
  
  const tasks: ResearchTask[] = [];
  
  // Create tasks for each section in the table of contents
  researchPlan.tableOfContents.sections.forEach((section, index) => {
    // Determine priority based on section order
    const priority = index < 2 ? "high" : index < 4 ? "medium" : "low";
    
    // Create a task for the section
    const task: ResearchTask = {
      id: `task-${section.id}`,
      sectionId: section.id,
      title: section.title,
      description: section.description,
      priority,
      depth: priority === "high" ? "deep" : "standard",
      status: "pending",
      assignedTo: null,
      searchQueries: generateSearchQueries(section, settings),
      results: []
    };
    
    tasks.push(task);
  });
  
  return tasks;
};

const generateSearchQueries = (
  section: ResearchSection,
  settings: NewsSettings
): string[] => {
  // Generate search queries based on the section and company context
  const companyContext = settings.companyName || "the company";
  const industryContext = settings.industry || "the industry";
  
  switch (section.id) {
    case "section-1": // Industry Overview
      return [
        `Latest trends in ${industryContext}`,
        `Current state of ${industryContext} market`,
        `${industryContext} outlook 2023-2024`
      ];
    case "section-2": // Competitor Analysis
      return [
        `${settings.competitors?.join(" OR ")} recent developments`,
        `${settings.competitors?.join(" OR ")} market strategy`,
        `${settings.competitors?.join(" OR ")} new products`
      ];
    case "section-3": // Market Opportunities
      return [
        `Emerging opportunities in ${industryContext}`,
        `Growth areas for ${companyContext} in ${industryContext}`,
        `Untapped markets in ${industryContext}`
      ];
    case "section-4": // Regulatory Changes
      return [
        `${industryContext} regulation changes`,
        `New compliance requirements for ${industryContext}`,
        `Regulatory impact on ${industryContext}`
      ];
    case "section-5": // Technology Innovations
      return [
        `New technologies in ${industryContext}`,
        `Technology disruption in ${industryContext}`,
        `Innovation trends affecting ${industryContext}`
      ];
    default:
      return [
        `${section.title} in ${industryContext}`,
        `${section.title} related to ${companyContext}`
      ];
  }
};
