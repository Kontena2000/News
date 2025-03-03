
import { NewsSettings } from "@/types/settings";
import { ResearchTask, Article } from "@/types/agents";

export const editorAgent = async (
  completedTasks: ResearchTask[],
  settings: NewsSettings
): Promise<Article> => {
  try {
    // Compile research results into a coherent article
    const article = await compileArticle(completedTasks, settings);
    
    return article;
  } catch (error) {
    console.error("Error in Editor Agent:", error);
    throw error;
  }
};

const compileArticle = async (
  completedTasks: ResearchTask[],
  settings: NewsSettings
): Promise<Article> => {
  // In a real implementation, this would call an AI service to compile the article
  // For now, we'll create a mock article
  
  // Sort tasks by priority
  const sortedTasks = [...completedTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Generate title based on high priority tasks
  const highPriorityTasks = sortedTasks.filter(task => task.priority === "high");
  const title = highPriorityTasks.length > 0
    ? `${settings.industry || "Industry"} Update: ${highPriorityTasks[0].title}`
    : `${settings.industry || "Industry"} News Update`;
  
  // Generate content sections
  const contentSections = sortedTasks.map(task => {
    // Combine all research results for this task
    const combinedContent = task.results
      .filter(result => result.status === "completed")
      .map(result => result.content)
      .join("\n\n");
    
    // Get sources from all results
    const sources = task.results
      .filter(result => result.status === "completed")
      .flatMap(result => result.sources || []);
    
    // Get images from all results
    const images = task.results
      .filter(result => result.status === "completed")
      .flatMap(result => result.images || []);
    
    return {
      title: task.title,
      content: combinedContent,
      sources,
      images
    };
  });
  
  // Generate summary
  const summary = `This article provides an overview of recent developments in the ${settings.industry || "industry"}, focusing on ${highPriorityTasks.map(task => task.title.toLowerCase()).join(" and ")}.`;
  
  // Compile all sources
  const allSources = contentSections.flatMap(section => section.sources);
  
  // Compile all images
  const allImages = contentSections.flatMap(section => section.images);
  
  // Create the article
  const article: Article = {
    id: `article-${Date.now()}`,
    title,
    summary,
    content: contentSections.map(section => 
      `## ${section.title}\n\n${section.content}`
    ).join("\n\n"),
    sources: allSources,
    images: allImages.slice(0, 3), // Limit to 3 images
    publishedAt: new Date().toISOString(),
    category: settings.industry || "General",
    relevanceScore: 90, // Mock score
    status: "published"
  };
  
  return article;
};
