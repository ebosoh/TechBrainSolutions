import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteContent, websiteContentSchema } from '@shared/schema';
import { z } from 'zod';
import { Check, Edit, Plus, Save, Trash2 } from 'lucide-react';

// Form schema with validation
const formSchema = websiteContentSchema.extend({
  id: z.number().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

type ContentFormValues = z.infer<typeof formSchema>;

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all content
  const { data: contents, isLoading } = useQuery<{ data: WebsiteContent[] }>({
    queryKey: ['/api/content'],
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newContent: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('/api/content', {
        method: 'POST',
        body: JSON.stringify(newContent),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: 'Content created successfully',
        description: 'Your changes have been saved.',
      });
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create content',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WebsiteContent> }) => {
      return apiRequest(`/api/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: 'Content updated successfully',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update content',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Form handling
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: activeTab,
      key: '',
      title: '',
      content: '',
      type: 'text',
      active: true,
    },
  });
  
  const sections = React.useMemo(() => {
    if (!contents?.data) return [];
    const uniqueSections = new Set<string>();
    contents.data.forEach(content => uniqueSections.add(content.section));
    return Array.from(uniqueSections);
  }, [contents]);
  
  // Filter content by active section
  const sectionContent = React.useMemo(() => {
    if (!contents?.data) return [];
    return contents.data.filter(content => content.section === activeTab);
  }, [contents, activeTab]);
  
  // Handle selecting content for editing
  const handleSelectContent = (content: WebsiteContent) => {
    setSelectedContentId(content.id);
    form.reset({
      ...content,
      // Ensure dates are properly converted
      createdAt: content.createdAt ? new Date(content.createdAt) : null,
      updatedAt: content.updatedAt ? new Date(content.updatedAt) : null,
    });
  };
  
  // Handle creating new content
  const handleCreateContent = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedContentId(null);
    form.reset({
      section: activeTab,
      key: '',
      title: '',
      content: '',
      type: 'text',
      active: true,
    });
  };
  
  // Handle edit mode
  const handleEditContent = () => {
    setIsEditing(true);
  };
  
  // Handle form submission
  const onSubmit = (values: ContentFormValues) => {
    if (isCreating) {
      // Creating new content
      const { id, createdAt, updatedAt, ...newContent } = values;
      createMutation.mutate(newContent);
    } else if (isEditing && selectedContentId) {
      // Updating existing content
      const { id, createdAt, updatedAt, ...contentData } = values;
      updateMutation.mutate({ id: selectedContentId, data: contentData });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Content Management</h2>
        <Button variant="outline" size="sm" onClick={handleCreateContent}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Content
        </Button>
      </div>
      
      <Tabs defaultValue={sections[0] || 'home'} value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="w-full justify-start overflow-x-auto">
            {sections.map(section => (
              <TabsTrigger key={section} value={section} className="capitalize">
                {section}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {sections.map(section => (
          <TabsContent key={section} value={section} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{section} Content</CardTitle>
                    <CardDescription>Manage {section} page content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isLoading ? (
                      <div className="text-center py-4">Loading content...</div>
                    ) : sectionContent.length > 0 ? (
                      <div className="space-y-2">
                        {sectionContent.map(content => (
                          <div 
                            key={content.id} 
                            className={`p-3 border rounded-md cursor-pointer transition-colors
                              ${selectedContentId === content.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                              ${!content.active ? 'opacity-50' : ''}
                            `}
                            onClick={() => handleSelectContent(content)}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium truncate">{content.title || content.key}</div>
                              <div className="text-xs text-muted-foreground">{content.type}</div>
                            </div>
                            <div className="text-xs text-muted-foreground flex justify-between mt-1">
                              <span>{content.key}</span>
                              {!content.active && <span className="text-orange-500">Inactive</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No content found for this section
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {isCreating 
                          ? 'Create New Content' 
                          : selectedContentId 
                            ? isEditing 
                              ? 'Edit Content' 
                              : 'Content Details'
                            : 'Select Content'}
                      </CardTitle>
                      <CardDescription>
                        {isCreating 
                          ? 'Add new content to your website' 
                          : isEditing 
                            ? 'Modify existing content' 
                            : 'View content details'}
                      </CardDescription>
                    </div>
                    {selectedContentId && !isEditing && !isCreating && (
                      <Button variant="outline" size="sm" onClick={handleEditContent}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {(selectedContentId || isCreating) ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="section"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select 
                                  disabled={!isEditing && !isCreating}
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {sections.map(section => (
                                      <SelectItem key={section} value={section}>
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content Key</FormLabel>
                                <FormControl>
                                  <Input 
                                    disabled={!isEditing && !isCreating} 
                                    placeholder="e.g., hero_title" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  A unique identifier for this content
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input 
                                  disabled={!isEditing && !isCreating} 
                                  placeholder="Display title" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content Type</FormLabel>
                                <Select 
                                  disabled={!isEditing && !isCreating}
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                    <SelectItem value="image">Image URL</SelectItem>
                                    <SelectItem value="video">Video URL</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-end space-x-2 space-y-0 mt-8">
                                <FormControl>
                                  <Switch
                                    disabled={!isEditing && !isCreating}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Active</FormLabel>
                                  <FormDescription>
                                    Show this content on the website
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  disabled={!isEditing && !isCreating} 
                                  placeholder="Content text" 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {(isEditing || isCreating) && (
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setIsCreating(false);
                                if (selectedContentId && contents?.data) {
                                  const content = contents.data.find(c => c.id === selectedContentId);
                                  if (content) {
                                    handleSelectContent(content);
                                  }
                                }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              {isCreating ? 'Create' : 'Save Changes'}
                            </Button>
                          </div>
                        )}
                      </form>
                    </Form>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select content from the list or create new content to get started
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}