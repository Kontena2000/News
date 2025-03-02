
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Branch {
  id: string
  name: string
  maxArticles: number
}

export function PromptSettings() {
  const [resultsLimit, setResultsLimit] = useState(50)
  const [newBranch, setNewBranch] = useState("")
  const [branches, setBranches] = useState<Branch[]>([
    { id: "1", name: "HPC", maxArticles: 20 },
    { id: "2", name: "Bitcoin", maxArticles: 15 },
    { id: "3", name: "Energy Storage", maxArticles: 25 }
  ])
  
  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranches([
        ...branches,
        { id: Date.now().toString(), name: newBranch.trim(), maxArticles: 20 }
      ])
      setNewBranch("")
    }
  }
  
  const handleRemoveBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id))
  }
  
  const handleMaxArticlesChange = (id: string, value: number) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, maxArticles: value } : branch
    ))
  }
  
  const kontenaPrompt = `*Goal:*  
You are a smart AI Assistant capable of identifying and estimating which topics are of high priority to Kontena. Your objective is to determine subjects with high importance and significance for creating business opportunities and understanding the HPC, Bitcoin, and energy storage sectors in which Kontena operates.  

---

*Return Format:*  
Only list topics that contain high-value keywords relevant to Kontena's business activities. Do not include unrelated or low-priority topics.  

---

*Warnings:*  
- Ensure that the returned topics align with the main business activities of Kontena.  
- Focus on topics that create synergy with our services, solutions, and modular products.  
- Do not include generic industry trends unless they directly impact Kontena's ability to innovate, provide modular solutions, or generate business opportunities.  

---

*Context Dump:*  
Kontena is a Belgium-based company operating in the HPC (High-Performance Computing), Bitcoin, and energy storage sectors. Our primary activity is to provide services, solutions, and products to businesses looking to start or expand in these fields.  

Kontena's key strengths include:  
- Offering modular solutions that deviate from traditional consultancy approaches.  
- A strong "can-do" mentality, providing flexible and out-of-the-box solutions.  
- Adapting quickly to new technological advancements and industry shifts.  

We seek topics that enhance our market position, provide competitive advantages, and align with our vision of revolutionizing HPC and energy storage through innovative modular solutions.`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Configuration</CardTitle>
        <CardDescription>
          Configure the primary news-gathering prompt and related settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-prompt">Primary News-Gathering Prompt</Label>
            <Textarea 
              id="primary-prompt"
              placeholder="Enter your search prompt"
              className="min-h-[300px] font-mono text-sm"
              defaultValue={kontenaPrompt}
            />
            <p className="text-sm text-muted-foreground">
              This prompt will be used as the base for gathering relevant news articles
            </p>
          </div>

          <div className="space-y-2">
            <Label>Company Focus Selectors</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: "products", label: "Products" },
                { id: "competitors", label: "Competitors" },
                { id: "industry", label: "Industry", defaultChecked: true },
                { id: "technology", label: "Technology", defaultChecked: true },
                { id: "market-trends", label: "Market Trends" },
                { id: "regulations", label: "Regulations" }
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} defaultChecked={item.defaultChecked} />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Select aspects of your company to emphasize in news gathering
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-frequency">Update Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="update-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to refresh news data
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="results-limit">Results Limit: <span className="font-normal">{resultsLimit} articles</span></Label>
            </div>
            <Slider 
              defaultValue={[resultsLimit]} 
              max={100} 
              min={10} 
              step={5}
              onValueChange={(value) => setResultsLimit(value[0])}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of articles to collect per update (10-100)
            </p>
          </div>
          
          {/* Company Branches Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Company Branches</Label>
            </div>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Max Articles</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Slider 
                            defaultValue={[branch.maxArticles]} 
                            max={50} 
                            min={5} 
                            step={5}
                            onValueChange={(value) => handleMaxArticlesChange(branch.id, value[0])}
                            className="w-32"
                          />
                          <span className="text-sm">{branch.maxArticles}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveBranch(branch.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Enter new branch name" 
                  className="flex-1" 
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
                />
                <Button onClick={handleAddBranch}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure company branches (e.g., HPC, Bitcoin, Energy Storage) and set maximum articles per branch
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
