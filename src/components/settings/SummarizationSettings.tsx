
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function SummarizationSettings() {
  const summarizationPrompt = `Below is a collection of articles from our database. Each article has metadata fields such as title, source, date, overall_score, business_area, key_innovations, relevance_factors, kontena_opportunity, and keywords. Summarize all of these articles into concise bullet points, focusing on HPC, Bitcoin mining, and Energy Storage news. If articles mention heat recovery, immersion cooling, battery technology, or other high-priority innovations, include them in the summary. Omit generic or unrelated content.
Context:
Kontena specializes in modular HPC data centers, sustainable Bitcoin mining, and energy storage solutions.
Articles are already filtered for technical innovation, business impact, and sustainability.
Summaries should highlight any synergy or business opportunity for Kontena.
If multiple articles share the same theme (e.g., immersion cooling), group them together under a single bullet point for clarity.
Output Format:
Overall Summary (2-3 sentences): A top-level overview of the main themes and trends.
Key Highlights (Bulleted List): Summaries of each relevant article, grouped by business area (HPC, Bitcoin, Energy Storage).
For each bullet:
Mention the article title or a short reference.
Briefly state the main insight or innovation.
Note any synergy with Kontena's focus on modular solutions, sustainability, or heat recovery.
Notable Opportunities (Optional): List 2-3 cross-cutting opportunities for Kontena if applicable.
Database Content:
{INSERT YOUR ARTICLES HERE IN A STRUCTURED FORMAT}
Remember:
Keep your response concise, but with enough detail to understand the significance of each article.
Combine or group articles covering the same theme.
Do not output chain-of-thought; just provide the final summaries and any relevant context for Kontena.`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summarization Controls</CardTitle>
        <CardDescription>
          Configure how articles are summarized and daily news flashes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summarization-prompt">Summarization Prompt</Label>
            <Textarea 
              id="summarization-prompt"
              placeholder="Enter your summarization prompt"
              className="min-h-[300px] font-mono text-sm"
              defaultValue={summarizationPrompt}
            />
            <p className="text-sm text-muted-foreground">
              This prompt will be used to generate summaries of news articles
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary-length">Summary Length</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="summary-length">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                <SelectItem value="long">Long (2-3 paragraphs)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How long the generated summaries should be
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="daily-summary-frequency">Daily Summary Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="daily-summary-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays Only</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to generate daily news summaries
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="include-quotes" defaultChecked />
              <Label htmlFor="include-quotes">Include Key Quotes</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Include important quotes from the original articles in summaries
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="highlight-keywords" defaultChecked />
              <Label htmlFor="highlight-keywords">Highlight Keywords</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Highlight important keywords in the generated summaries
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
