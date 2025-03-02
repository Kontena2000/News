
import { useState } from "react"
import { Article } from "@/types/news"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Plus, Send, ThumbsUp, Tag } from "lucide-react"

interface CollaborativeAnnotationProps {
  article: Article
}

export function CollaborativeAnnotation({ article }: CollaborativeAnnotationProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "tags">("comments")
  const [newComment, setNewComment] = useState("")
  const [newTag, setNewTag] = useState("")
  
  // Mock data for comments and tags
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
      },
      text: "This article has significant implications for our Q3 planning. The market shift described here aligns with our strategic pivot.",
      timestamp: "2 hours ago",
      likes: 3
    },
    {
      id: 2,
      user: {
        name: "Sam Rivera",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
      },
      text: "I've shared this with the product team. The technology mentioned could help solve our current scalability challenges.",
      timestamp: "1 hour ago",
      likes: 2
    }
  ])
  
  const [tags, setTags] = useState([
    { id: 1, name: "Strategic", count: 5, addedBy: "Alex Johnson" },
    { id: 2, name: "Product Development", count: 3, addedBy: "Sam Rivera" },
    { id: 3, name: "Competitor Analysis", count: 2, addedBy: "Taylor Kim" },
    { id: 4, name: "Market Trend", count: 7, addedBy: "Jordan Lee" }
  ])
  
  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment = {
      id: comments.length + 1,
      user: {
        name: "You",
        avatar: ""
      },
      text: newComment,
      timestamp: "Just now",
      likes: 0
    }
    
    setComments([...comments, comment])
    setNewComment("")
  }
  
  const handleAddTag = () => {
    if (!newTag.trim()) return
    
    // Check if tag already exists
    const existingTag = tags.find(t => t.name.toLowerCase() === newTag.toLowerCase())
    
    if (existingTag) {
      // Update existing tag count
      setTags(tags.map(t => 
        t.id === existingTag.id 
          ? { ...t, count: t.count + 1 } 
          : t
      ))
    } else {
      // Add new tag
      const tag = {
        id: tags.length + 1,
        name: newTag,
        count: 1,
        addedBy: "You"
      }
      setTags([...tags, tag])
    }
    
    setNewTag("")
  }
  
  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 } 
        : comment
    ))
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Collaborative Sensemaking
            </CardTitle>
            <CardDescription>
              Team annotations and insights for shared understanding
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeTab === "comments" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("comments")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Comments
            </Button>
            <Button 
              variant={activeTab === "tags" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveTab("tags")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Tags
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "comments" ? (
          <div className="space-y-4">
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="rounded-lg border p-3">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{comment.user.name}</h4>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.text}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          <span>{comment.likes}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Textarea
                placeholder="Add your insights or observations about this article..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleAddComment}>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Tag className="h-3 w-3" />
                  <span>{tag.name}</span>
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    {tag.count}
                  </span>
                </Badge>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a tag (e.g., Strategic, Actionable, Research)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={handleAddTag}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Tags help categorize articles and identify patterns across your organization&apos;s knowledge base.
              </p>
            </div>
            
            <div className="mt-4 rounded-lg border p-4">
              <h4 className="font-medium">Popular Tags</h4>
              <div className="mt-2 space-y-2">
                {tags
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 3)
                  .map(tag => (
                    <div key={tag.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-primary" />
                        <span>{tag.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Used {tag.count} times
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
