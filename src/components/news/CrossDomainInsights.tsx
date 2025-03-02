
import { useState } from "react"
import { Article } from "@/types/news"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, Zap, Network } from "lucide-react"

interface CrossDomainInsightsProps {
  articles: Article[]
}

export function CrossDomainInsights({ articles }: CrossDomainInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null)
  
  // Generate cross-domain insights
  const insights = generateCrossDomainInsights(articles)
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5 text-primary" />
              Cross-Domain Insights
            </CardTitle>
            <CardDescription>
              Connections and patterns across different knowledge domains
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedInsight === index ? "border-primary" : ""}`}
                onClick={() => setSelectedInsight(index === selectedInsight ? null : index)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{insight.type}</Badge>
                    <Lightbulb className={`h-4 w-4 ${selectedInsight === index ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <CardTitle className="mt-2 text-base">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  
                  {selectedInsight === index && (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg bg-secondary p-3">
                        <h4 className="font-medium">Connected Domains</h4>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge>{insight.domains[0]}</Badge>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <Badge>{insight.domains[1]}</Badge>
                          {insight.domains[2] && (
                            <>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <Badge>{insight.domains[2]}</Badge>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Supporting Evidence</h4>
                        <ul className="mt-1 space-y-1 text-sm">
                          {insight.evidence.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 mt-1 block h-2 w-2 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Potential Applications</h4>
                        <ul className="mt-1 space-y-1 text-sm">
                          {insight.applications.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <Zap className="mr-2 h-3 w-3 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          // In a real app, this would add the insight to a collection or share it
                          alert(`Insight "${insight.title}" saved to your collection`)
                        }}
                      >
                        Save Insight
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate cross-domain insights
function generateCrossDomainInsights(articles: Article[]) {
  // In a real implementation, this would analyze articles to find cross-domain connections
  // For this prototype, we'll return mock insights
  
  return [
    {
      type: "Technology × Finance",
      title: "AI-Driven Financial Forecasting Models",
      summary: "Recent advancements in machine learning algorithms are being applied to financial forecasting with unprecedented accuracy.",
      domains: ["Artificial Intelligence", "Financial Analysis", "Data Science"],
      evidence: [
        "Three major banks have implemented AI forecasting systems in Q1",
        "Prediction accuracy improved by 27% compared to traditional models",
        "Regulatory frameworks are being updated to accommodate AI-based financial tools"
      ],
      applications: [
        "Develop internal AI forecasting tools for budget planning",
        "Partner with fintech startups specializing in predictive analytics",
        "Incorporate AI risk assessment into investment strategy"
      ]
    },
    {
      type: "Healthcare × Manufacturing",
      title: "3D Printing Revolution in Medical Devices",
      summary: "Manufacturing techniques from industrial 3D printing are transforming personalized medical device production.",
      domains: ["Additive Manufacturing", "Medical Devices", "Supply Chain"],
      evidence: [
        "FDA approved 14 new 3D-printed medical devices this quarter",
        "Production costs reduced by 40% for certain prosthetics",
        "Hospital systems implementing on-site printing facilities"
      ],
      applications: [
        "Explore partnerships with medical device manufacturers",
        "Invest in specialized 3D printing materials research",
        "Develop logistics solutions for just-in-time medical manufacturing"
      ]
    },
    {
      type: "Energy × Transportation",
      title: "Grid Integration of Electric Vehicle Fleets",
      summary: "Commercial EV fleets are becoming integral to grid stability through bidirectional charging systems.",
      domains: ["Electric Vehicles", "Grid Management", "Energy Storage"],
      evidence: [
        "Three major cities piloting commercial EV fleets as grid resources",
        "Peak demand reduction of 12% in pilot areas",
        "New revenue streams for fleet operators through grid services"
      ],
      applications: [
        "Convert company fleet to EVs with bidirectional charging",
        "Develop energy management systems for vehicle-to-grid integration",
        "Partner with utilities on demand response programs"
      ]
    },
    {
      type: "Agriculture × Technology",
      title: "Blockchain for Agricultural Supply Chain",
      summary: "Distributed ledger technology is revolutionizing transparency and efficiency in food supply chains.",
      domains: ["Blockchain", "Supply Chain", "Food Safety"],
      evidence: [
        "Major retailers implementing blockchain tracking for produce",
        "Contamination source identification time reduced from days to seconds",
        "Consumer trust metrics increased by 35% with transparent tracking"
      ],
      applications: [
        "Implement blockchain verification for critical supply chains",
        "Develop consumer-facing transparency tools",
        "Create internal tracking systems based on distributed ledger technology"
      ]
    },
    {
      type: "Retail × Psychology",
      title: "Behavioral Economics in E-commerce Design",
      summary: "Psychological research findings are being systematically applied to digital retail experiences.",
      domains: ["Behavioral Economics", "UX Design", "Consumer Psychology"],
      evidence: [
        "A/B testing shows 28% conversion improvement with behavioral principles",
        "Reduced cart abandonment by 17% through choice architecture",
        "Personalization based on psychological profiles increasing retention"
      ],
      applications: [
        "Redesign digital interfaces using behavioral economics principles",
        "Train product teams in psychological design patterns",
        "Develop ethical guidelines for persuasive design"
      ]
    },
    {
      type: "Education × Remote Work",
      title: "Corporate Learning in Distributed Teams",
      summary: "Educational methodologies are being reimagined for continuous learning in remote work environments.",
      domains: ["Remote Work", "Professional Development", "Educational Technology"],
      evidence: [
        "Companies with structured remote learning show 24% higher retention",
        "Microlearning modules increasing skill acquisition by 31%",
        "Peer-to-peer learning networks emerging as key knowledge transfer mechanisms"
      ],
      applications: [
        "Implement microlearning platform for distributed teams",
        "Develop peer teaching incentive programs",
        "Create asynchronous learning pathways for global teams"
      ]
    }
  ]
}
