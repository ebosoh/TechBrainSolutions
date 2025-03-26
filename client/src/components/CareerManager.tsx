import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Career, careerSchema } from '@shared/schema';
import { z } from 'zod';
import { Check, Edit, Plus, Save, Trash2, Briefcase, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Form schema with validation
const formSchema = careerSchema.extend({
  id: z.number().optional(),
  createdAt: z.date().nullable().optional(),
  active: z.boolean().default(true),
  department: z.string().optional(),
  applicationsCount: z.number().optional(),
  shortDescription: z.string().optional(),
});

type CareerFormValues = z.infer<typeof formSchema>;

export default function CareerManager() {
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all careers
  const { data: careers, isLoading } = useQuery<{ data: Career[] }>({
    queryKey: ['/api/careers'],
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newCareer: Omit<Career, 'id' | 'createdAt'>) => {
      return apiRequest('/api/careers', {
        method: 'POST',
        body: JSON.stringify(newCareer),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/careers'] });
      toast({
        title: 'Career created successfully',
        description: 'The job posting has been created.',
      });
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create career',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Career> }) => {
      return apiRequest(`/api/careers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/careers'] });
      toast({
        title: 'Career updated successfully',
        description: 'The job posting has been updated.',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update career',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/careers/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/careers'] });
      toast({
        title: 'Career deleted successfully',
        description: 'The job posting has been removed.',
      });
      setSelectedCareerId(null);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete career',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Form handling
  const form = useForm<CareerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      type: 'Full-time',
      active: true,
      department: '',
      shortDescription: '',
    },
  });
  
  // Handle selecting career for editing
  const handleSelectCareer = (career: Career) => {
    setSelectedCareerId(career.id);
    setIsEditing(false);
    setIsCreating(false);
    
    // Add any missing fields with defaults
    const formData = {
      ...career,
      active: career.active !== undefined ? career.active : true,
      department: career.department || '',
      shortDescription: career.shortDescription || career.description.substring(0, 150),
      // Ensure dates are properly converted
      createdAt: career.createdAt ? new Date(career.createdAt) : null,
    };
    
    form.reset(formData);
  };
  
  // Handle creating new career
  const handleCreateCareer = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedCareerId(null);
    form.reset({
      title: '',
      description: '',
      requirements: '',
      location: '',
      type: 'Full-time',
      active: true,
      department: '',
      shortDescription: '',
    });
  };
  
  // Handle edit mode
  const handleEditCareer = () => {
    setIsEditing(true);
  };
  
  // Handle delete
  const handleDeleteCareer = () => {
    if (selectedCareerId) {
      deleteMutation.mutate(selectedCareerId);
    }
  };
  
  // Handle form submission
  const onSubmit = (values: CareerFormValues) => {
    if (isCreating) {
      // Creating new career
      const { id, createdAt, ...newCareer } = values;
      createMutation.mutate(newCareer);
    } else if (isEditing && selectedCareerId) {
      // Updating existing career
      const { id, createdAt, ...careerData } = values;
      updateMutation.mutate({ id: selectedCareerId, data: careerData });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career Opportunities</h2>
        <Button variant="default" onClick={handleCreateCareer}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Job Posting
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage career opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">Loading job postings...</div>
              ) : careers?.data && careers.data.length > 0 ? (
                <div className="space-y-2">
                  {careers.data.map(career => (
                    <div 
                      key={career.id} 
                      className={`p-3 border rounded-md cursor-pointer transition-colors
                        ${selectedCareerId === career.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                        ${!career.active ? 'opacity-60' : ''}
                      `}
                      onClick={() => handleSelectCareer(career)}
                    >
                      <div className="font-medium">{career.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {career.location}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {career.type}
                        </Badge>
                      </div>
                      {career.active === false && (
                        <div className="text-xs mt-1 text-orange-500">Inactive</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No job postings found
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
                    ? 'Create New Job Posting' 
                    : selectedCareerId 
                      ? isEditing 
                        ? 'Edit Job Posting' 
                        : 'Job Posting Details'
                      : 'Select a Job Posting'}
                </CardTitle>
                <CardDescription>
                  {isCreating 
                    ? 'Create a new career opportunity' 
                    : isEditing 
                      ? 'Modify job details' 
                      : 'View job posting details'}
                </CardDescription>
              </div>
              {selectedCareerId && !isEditing && !isCreating && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleEditCareer}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this job posting? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCareer}>
                          Delete Job Posting
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {(selectedCareerId || isCreating) ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title*</FormLabel>
                        <FormControl>
                          <Input 
                            disabled={!isEditing && !isCreating} 
                            placeholder="e.g., Senior React Developer" 
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
                          <FormLabel>Employment Type*</FormLabel>
                          <Select 
                            disabled={!isEditing && !isCreating}
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input 
                              disabled={!isEditing && !isCreating} 
                              placeholder="e.g., Nairobi, Kenya" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input 
                              disabled={!isEditing && !isCreating} 
                              placeholder="e.g., Engineering" 
                              {...field} 
                            />
                          </FormControl>
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
                            <FormLabel>Active Posting</FormLabel>
                            <FormDescription>
                              Show on careers page
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            disabled={!isEditing && !isCreating} 
                            placeholder="Brief overview of the position (150 characters)" 
                            className="resize-none"
                            maxLength={150}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A brief summary shown in listings (max 150 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            disabled={!isEditing && !isCreating} 
                            placeholder="Detailed job description" 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements*</FormLabel>
                        <FormControl>
                          <Textarea 
                            disabled={!isEditing && !isCreating} 
                            placeholder="Skills and qualifications required" 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          List required skills, experience, and qualifications
                        </FormDescription>
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
                          if (selectedCareerId && careers?.data) {
                            const career = careers.data.find(c => c.id === selectedCareerId);
                            if (career) {
                              handleSelectCareer(career);
                            }
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {isCreating ? 'Create Job Posting' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            ) : (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <Briefcase className="h-12 w-12 mb-4 text-muted" />
                Select a job posting from the list or create a new one
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}