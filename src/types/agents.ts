
export interface ResearchSection {
  id: string;
  title: string;
  description: string;
}

export interface TableOfContents {
  title: string;
  sections: ResearchSection[];
}

export interface ResearchPlan {
  id: string;
  timestamp: string;
  originalPrompt: string;
  tableOfContents: TableOfContents;
  status: "created" | "in_progress" | "completed" | "error";
  error?: string;
}

export interface ResearchTask {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  depth: "deep" | "standard" | "brief";
  status: "pending" | "in_progress" | "completed" | "error";
  assignedTo: string | null;
  searchQueries: string[];
  results: ResearchResult[];
  error?: string;
}

export interface ResearchResult {
  id: string;
  query: string;
  timestamp: string;
  content: string;
  sources: { title: string; url: string }[];
  images: { url: string; alt: string }[];
  status: "completed" | "error";
  error?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  sources: { title: string; url: string }[];
  images: { url: string; alt: string }[];
  publishedAt: string;
  category: string;
  relevanceScore: number;
  status: "draft" | "published" | "archived";
}
