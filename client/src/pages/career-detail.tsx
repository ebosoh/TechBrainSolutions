import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building, MapPin, Calendar, ChevronLeft, Send, Share2, Linkedin, Twitter, Facebook, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Career } from '@shared/schema';
import WavySeparator from '@/components/ui/wavy-separator';
import { useToast } from '@/hooks/use-toast';

// Application form schema
const applicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  coverLetter: z.string().min(50, "Please write a brief cover letter (min 50 characters)"),
  resume: z.string().min(1, "Please provide a link to your resume"),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export default function CareerDetail() {
  // State for UI interactions
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Get the career ID from the URL
  const [match, params] = useRoute<{ id: string }>('/career/:id');
  const careerId = match ? parseInt(params.id) : null;

  // Setup form
  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
      resume: ""
    }
  });
  
  // Handle form submission
  const onSubmit = (values: ApplicationValues) => {
    console.log("Application submitted:", values);
    
    // In a real application, this would send data to the server
    // For now, we'll just show a success message
    setApplicationSubmitted(true);
    toast({
      title: "Application Submitted",
      description: "Thank you for your application! We'll be in touch soon.",
    });
  };
  
  // Fetch similar positions
  const { data: relatedData } = useQuery<{ data: Career[] }>({
    queryKey: ['/api/careers'],
    enabled: !!careerId,
  });
  
  // Fetch the career details
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/careers', careerId],
    queryFn: async () => {
      if (!careerId) return null;
      const res = await fetch(`/api/careers/${careerId}`);
      if (!res.ok) throw new Error('Failed to fetch career details');
      return res.json();
    },
    enabled: !!careerId,
  });

  const career: Career | undefined = data?.data;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-12 container mx-auto px-4">
          <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
            <div className="h-10 w-3/4 bg-muted rounded-md"></div>
            <div className="h-6 w-1/2 bg-muted rounded-md"></div>
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="h-40 bg-muted rounded-md"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !career) {
    return (
      <MainLayout>
        <div className="pt-32 pb-12 container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the job position you're looking for.
          </p>
          <Link href="/careers">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Careers
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Format requirements as list
  const requirementsList = career.requirements.split('\\n');

  return (
    <MainLayout>
      <section className="pt-32 pb-16 container mx-auto px-4">
        <Link href="/careers">
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Positions
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">{career.title}</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 text-sm">
              {career.type}
            </Badge>
          </div>

          <Card className="mb-8 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Job Details</CardTitle>
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowShareOptions(!showShareOptions)} 
                        className="relative"
                      >
                        <Share2 className="h-5 w-5" />
                        {showShareOptions && (
                          <div className="absolute top-full right-0 mt-2 bg-card rounded-md shadow-lg border border-border p-2 flex gap-2 z-10">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5]">
                                  <Linkedin className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Share on LinkedIn</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]">
                                  <Twitter className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Share on Twitter</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-[#3b5998]/10 hover:bg-[#3b5998]/20 text-[#3b5998]">
                                  <Facebook className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Share on Facebook</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Share by Email</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this job</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span className="text-muted-foreground">Location: <span className="font-medium text-foreground">{career.location}</span></span>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-primary mr-2" />
                <span className="text-muted-foreground">Type: <span className="font-medium text-foreground">{career.type}</span></span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <span className="text-muted-foreground">Posted: <span className="font-medium text-foreground">
                  {career.createdAt ? new Date(career.createdAt).toLocaleDateString() : 'Recently'}
                </span></span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
              <div className="text-muted-foreground">
                <p>{career.description}</p>
              </div>
            </div>

            <WavySeparator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                {requirementsList.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <WavySeparator />

            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Apply for this Position</h2>
              
              {applicationSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for your interest in joining our team. We will review your application and get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Interested in joining our team? Submit your application, and we'll get back to you as soon as possible.
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="resume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resume/CV Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://drive.google.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coverLetter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Letter</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" size="lg" className="w-full md:w-auto gap-2">
                        <Send className="h-4 w-4" /> Submit Application
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
            
            {/* Related positions */}
            {relatedData?.data && relatedData.data.filter(c => c.id !== career.id).length > 0 && (
              <>
                <WavySeparator />
                
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Similar Positions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedData.data
                      .filter(c => c.id !== career.id)
                      .slice(0, 2)
                      .map(relatedCareer => (
                        <Card key={relatedCareer.id} className="group transition-all hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{relatedCareer.title}</CardTitle>
                              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                                {relatedCareer.type}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center mt-1 text-xs">
                              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                              {relatedCareer.location}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {relatedCareer.description}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Link href={`/career/${relatedCareer.id}`}>
                              <Button size="sm" variant="outline" className="text-xs h-8 group-hover:bg-primary group-hover:text-white transition-colors">
                                View Position
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}