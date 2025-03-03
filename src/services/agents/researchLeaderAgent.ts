
import { NewsSettings } from "@/types/settings";
import { enhancePrompt, getDefaultBasePrompt } from "@/services/promptService";
import { TableOfContents, ResearchPlan } from "@/types/agents";

export const researchLeaderAgent = async (
  settings: NewsSettings
): Promise<ResearchPlan> => {
  try {
    // Get the base prompt from settings
    const basePrompt = getDefaultBasePrompt(settings);
    
    // Enhance the prompt with context
    const enhancedPrompt = await enhancePrompt(basePrompt, settings);
    
    // Create a research plan based on the enhanced prompt
    const researchPlan = await createResearchPlan(enhancedPrompt, settings);
    
    return researchPlan;
  } catch (error) {
    console.error("Error in Research Leader Agent:", error);
    throw error;
  }
};

const createResearchPlan = async (
  enhancedPrompt: string,
  settings: NewsSettings
): Promise<ResearchPlan> => {
  // In a real implementation, this would call an AI service to create a research plan
  // For now, we'll create a mock research plan
  
  // Create a table of contents
  const tableOfContents: TableOfContents = {
    title: "Research Plan for " + (settings.companyName || "Your Company"),
    sections: [
      {
        id: "section-1",
        title: "Industry Overview",
        description: "Current state of the industry and major trends"
      },
      {
        id: "section-2",
        title: "Competitor Analysis",
        description: "Recent developments from major competitors"
      },
      {
        id: "section-3",
        title: "Market Opportunities",
        description: "Emerging opportunities and potential growth areas"
      },
      {
        id: "section-4",
        title: "Regulatory Changes",
        description: "Recent and upcoming regulatory changes affecting the industry"
      },
      {
        id: "section-5",
        title: "Technology Innovations",
        description: "New technologies and innovations relevant to the business"
      }
    ]
  };
  
  // Create the research plan
  const researchPlan: ResearchPlan = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    originalPrompt: enhancedPrompt,
    tableOfContents,
    status: "created"
  };
  
  return researchPlan;
};
