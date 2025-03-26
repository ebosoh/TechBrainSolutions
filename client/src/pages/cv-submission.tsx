import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/layouts/MainLayout';
import { GrassTexture } from "@/components/ui/grass-texture";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import { Briefcase, CheckCircle2 } from 'lucide-react';

// Define schema for CV submission form
const cvSubmissionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
  experience: z.string().min(10, "Please provide a brief description of your experience"),
  resumeLink: z.string().url("Please provide a valid URL to your resume/CV")
});

type CVSubmissionFormData = z.infer<typeof cvSubmissionSchema>;

export default function CVSubmissionPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const form = useForm<CVSubmissionFormData>({
    resolver: zodResolver(cvSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      linkedIn: "",
      portfolio: "",
      experience: "",
      resumeLink: ""
    }
  });
  
  const cvSubmissionMutation = useMutation({
    mutationFn: (data: CVSubmissionFormData) => {
      return apiRequest("/api/job-applications/cv", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          careerId: null, // General CV submission, not for a specific position
          status: "pending",
          applicationDate: new Date().toISOString()
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "CV Submitted Successfully!",
        description: "Thank you for your interest. We'll review your CV and get back to you if there's a good match.",
        variant: "default",
      });
      form.reset();
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error submitting CV",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CVSubmissionFormData) => {
    cvSubmissionMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <MainLayout>
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center py-12">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Your Submission!</h1>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                We've received your CV and will review it shortly. If your skills and experience match our needs, 
                we'll reach out to discuss potential opportunities.
              </p>
              <Button size="lg" onClick={() => window.location.href = "/careers"}>
                Back to Careers
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-20 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col lg:flex-row max-w-5xl mx-auto"
          >
            <motion.div
              variants={fadeIn("right", "tween", 0.2, 1)}
              className="lg:w-2/5 lg:pr-12 mb-10 lg:mb-0"
            >
              <div className="sticky top-24">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Submit Your CV
                </h2>
                <p className="text-lg opacity-80 mb-8 leading-relaxed">
                  Join our talented team at TechBrain. We're always looking for exceptional individuals to help us build innovative solutions.
                </p>
                
                <div className="bg-primary/10 p-6 rounded-lg mb-8">
                  <h3 className="flex items-center text-xl font-semibold mb-4">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Why Join TechBrain?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Work on cutting-edge projects with industry leaders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Collaborative, inclusive and supportive work environment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Opportunities for professional growth and development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Competitive compensation and benefits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideIn("left", "tween", 0.2, 1)}
              className="lg:w-3/5"
            >
              <GrassTexture className="p-8">
                <h3 className="text-xl font-semibold mb-6">Tell Us About Yourself</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              className="w-full" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                type="email"
                                className="w-full" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+254 700 000 000" 
                                className="w-full" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="linkedIn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://linkedin.com/in/yourprofile" 
                                className="w-full" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="portfolio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Portfolio/Website (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://yourportfolio.com" 
                                className="w-full" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="resumeLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link to your Resume/CV (Google Drive, Dropbox, etc.)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://docs.google.com/document/d/your-cv" 
                              className="w-full" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Description of Your Experience & Skills</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your key skills, experience, and why you'd like to join our team"
                              className="w-full" 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                      disabled={cvSubmissionMutation.isPending}
                    >
                      {cvSubmissionMutation.isPending 
                        ? "Submitting..." 
                        : "Submit Your CV"
                      }
                    </Button>
                  </form>
                </Form>
              </GrassTexture>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}