
import { Star, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SourceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Management</CardTitle>
        <CardDescription>
          Configure trusted sources, social media integration, and content filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible defaultValue="trusted-sources">
          <AccordionItem value="trusted-sources">
            <AccordionTrigger>Trusted Sources Table</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { domain: "techcrunch.com", category: "Technology", priority: 5 },
                    { domain: "wired.com", category: "Technology", priority: 4 },
                    { domain: "bloomberg.com", category: "Finance", priority: 5 },
                    { domain: "marketingdive.com", category: "Marketing", priority: 3 },
                    { domain: "socialmediatoday.com", category: "Social Media", priority: 2 }
                  ].map((source) => (
                    <TableRow key={source.domain}>
                      <TableCell>{source.domain}</TableCell>
                      <TableCell>
                        <Select defaultValue={source.category.toLowerCase()}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="social media">Social Media</SelectItem>
                            <SelectItem value="industry">Industry</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: source.priority }).map((_, i) => (
                            <Star key={i} className="h-4 w-4" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center space-x-2">
                <Input placeholder="Enter domain (e.g., example.com)" className="flex-1" />
                <Button>Add Source</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social-media">
            <AccordionTrigger>Social Media Integration</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="twitter-toggle" className="font-medium">Twitter/X Integration</Label>
                    <Badge variant="outline">Beta</Badge>
                  </div>
                  <Switch id="twitter-toggle" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="twitter-accounts">Accounts to Follow</Label>
                    <Input 
                      id="twitter-accounts" 
                      placeholder="@techcrunch, @wired, @marketingcloud"
                      defaultValue="@techcrunch, @wired, @marketingcloud"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="retweet-threshold">Minimum Retweet Threshold</Label>
                    <Input 
                      id="retweet-threshold" 
                      type="number" 
                      defaultValue={50}
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="reddit-toggle" className="font-medium">Reddit Integration</Label>
                    <Badge variant="outline">Beta</Badge>
                  </div>
                  <Switch id="reddit-toggle" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="subreddits">Subreddits to Monitor</Label>
                    <Input 
                      id="subreddits" 
                      placeholder="r/marketing, r/technology, r/digitalmarketing"
                      defaultValue="r/marketing, r/technology, r/digitalmarketing"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="upvote-threshold">Minimum Upvote Threshold</Label>
                    <Input 
                      id="upvote-threshold" 
                      type="number" 
                      defaultValue={100}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content-filters">
            <AccordionTrigger>Content Filter Controls</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language-filter">Language Preferences</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language-filter">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="all">All Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Type Checkboxes</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="news-articles" defaultChecked />
                    <Label htmlFor="news-articles">News Articles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="blog-posts" defaultChecked />
                    <Label htmlFor="blog-posts">Blog Posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="press-releases" defaultChecked />
                    <Label htmlFor="press-releases">Press Releases</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="research-papers" />
                    <Label htmlFor="research-papers">Research Papers</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusion-keywords">Exclusion Keywords</Label>
                <Textarea 
                  id="exclusion-keywords"
                  placeholder="spam, clickbait, promotional"
                  defaultValue="spam, clickbait, promotional"
                />
                <p className="text-sm text-muted-foreground">
                  Terms that automatically exclude content (comma separated)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-limit">Age Limit Selector</Label>
                <Select defaultValue="7">
                  <SelectTrigger id="age-limit">
                    <SelectValue placeholder="Select age limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Maximum age of content to include
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
