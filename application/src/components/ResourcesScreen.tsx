import { useState } from 'react';
import { ArrowLeft, Plus, ExternalLink, Trash2, FileText, Video, BookOpen, Users, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'document' | 'tip';
  category: 'getting-started' | 'research' | 'partner-tips' | 'modeling';
}

const defaultResources: Resource[] = [
  {
    id: '1',
    title: 'Why Partner Modeling is Essential',
    description: 'Research shows that modeling AAC use is one of the most important factors in AAC success. Partners should use the board alongside the user.',
    url: 'https://www.assistiveware.com/learn-aac/model-aided-language',
    type: 'article',
    category: 'partner-tips'
  },
  {
    id: '2',
    title: 'The Core Word Approach',
    description: 'Core vocabulary makes up 80% of what we say. Learn why focusing on core words helps communication development.',
    url: 'https://www.project-core.com/',
    type: 'article',
    category: 'research'
  },
  {
    id: '3',
    title: 'Getting Started with AAC',
    description: 'A comprehensive guide for families new to AAC, including setup tips and first steps.',
    url: '#',
    type: 'document',
    category: 'getting-started'
  },
  {
    id: '4',
    title: 'Tip: Presume Competence',
    description: 'Always assume the AAC user understands more than they can express. Give them time and opportunities to communicate.',
    url: '#',
    type: 'tip',
    category: 'partner-tips'
  },
  {
    id: '5',
    title: 'Tip: Comment, Don\'t Just Question',
    description: 'Instead of only asking questions, model commenting: "I see a blue car!" or "This is fun!" This reduces pressure and shows how to use the board.',
    url: '#',
    type: 'tip',
    category: 'modeling'
  },
  {
    id: '6',
    title: 'Tip: Honor All Communication',
    description: 'Gestures, sounds, eye gaze, and board use are all valid communication. Acknowledge and respond to every attempt.',
    url: '#',
    type: 'tip',
    category: 'partner-tips'
  }
];

interface ResourcesScreenProps {
  onBack: () => void;
}

export function ResourcesScreen({ onBack }: ResourcesScreenProps) {
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'article' | 'video' | 'document' | 'tip'>('article');
  const [category, setCategory] = useState<'getting-started' | 'research' | 'partner-tips' | 'modeling'>('partner-tips');

  const handleAddResource = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setType('article');
    setCategory('partner-tips');
    setIsDialogOpen(true);
  };

  const handleSaveResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      title,
      description,
      url,
      type,
      category
    };
    
    setResources([...resources, newResource]);
    setIsDialogOpen(false);
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'document': return BookOpen;
      case 'tip': return Lightbulb;
      default: return FileText;
    }
  };

  const getCategoryResources = (cat: string) => {
    return resources.filter(r => r.category === cat);
  };

  const categoryInfo = {
    'getting-started': {
      title: 'Getting Started',
      description: 'New to AAC? Start here for setup guides and basics.',
      icon: BookOpen
    },
    'research': {
      title: 'Research & Evidence',
      description: 'Scientific studies and evidence-based practices.',
      icon: FileText
    },
    'partner-tips': {
      title: 'Tips for Communication Partners',
      description: 'How families and caregivers can support AAC use.',
      icon: Users
    },
    'modeling': {
      title: 'Modeling & Teaching',
      description: 'Strategies for modeling AAC use and teaching vocabulary.',
      icon: Lightbulb
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Core Board
          </Button>
          <div>
            <h1 className="text-slate-700">Learning Resources</h1>
            <p className="text-slate-600">Educational materials for families and communication partners</p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 rounded-xl"
          onClick={handleAddResource}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Add educational materials, research, or tips for communication partners.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource title..."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>URL or Link</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article/Link</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document/PDF</SelectItem>
                  <SelectItem value="tip">Quick Tip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getting-started">Getting Started</SelectItem>
                  <SelectItem value="research">Research & Evidence</SelectItem>
                  <SelectItem value="partner-tips">Tips for Partners</SelectItem>
                  <SelectItem value="modeling">Modeling & Teaching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveResource} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Add Resource
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-slate-800 mb-2">Why Communication Partners Matter</h3>
            <p className="text-slate-600">
              AAC users learn best when everyone around them uses the board too! Family members, teachers, and caregivers 
              should model using the board during daily activities. Point to words as you talk, use the board to comment 
              (not just ask questions), and give plenty of wait time. The resources below will help everyone become better communication partners.
            </p>
          </div>
        </div>
      </Card>

      {/* Tabbed Resource Categories */}
      <Tabs defaultValue="partner-tips" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="partner-tips">Partner Tips</TabsTrigger>
          <TabsTrigger value="modeling">Modeling</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        {Object.entries(categoryInfo).map(([key, info]) => (
          <TabsContent key={key} value={key} className="flex-1 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <info.icon className="h-5 w-5 text-purple-600" />
                <h2 className="text-slate-800">{info.title}</h2>
              </div>
              <p className="text-slate-600">{info.description}</p>
            </div>

            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 gap-4 pr-4">
                {getCategoryResources(key).map((resource) => {
                  const Icon = getResourceIcon(resource.type);
                  
                  return (
                    <Card key={resource.id} className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          resource.type === 'tip' ? 'bg-yellow-100' : 
                          resource.type === 'video' ? 'bg-red-100' :
                          resource.type === 'document' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            resource.type === 'tip' ? 'text-yellow-600' : 
                            resource.type === 'video' ? 'text-red-600' :
                            resource.type === 'document' ? 'text-blue-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-slate-800 mb-1">{resource.title}</h3>
                          <p className="text-slate-600 mb-3">{resource.description}</p>
                          
                          <div className="flex items-center gap-2">
                            {resource.url !== '#' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(resource.url, '_blank')}
                                className="text-purple-600 hover:text-purple-700"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open Link
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {getCategoryResources(key).length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-slate-500">No resources in this category yet. Click "Add Resource" to add one!</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
