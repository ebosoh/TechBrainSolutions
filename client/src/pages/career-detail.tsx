import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building, MapPin, Calendar, ChevronLeft, Send } from 'lucide-react';
import { Career } from '@shared/schema';
import WavySeparator from '@/components/ui/wavy-separator';

export default function CareerDetail() {
  // Get the career ID from the URL
  const [match, params] = useRoute<{ id: string }>('/career/:id');
  const careerId = match ? parseInt(params.id) : null;

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
            <CardHeader>
              <CardTitle className="text-xl">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-muted-foreground mb-6">
                Interested in joining our team? Submit your application, and we'll get back to you as soon as possible.
              </p>
              <Button size="lg" className="gap-2">
                <Send className="h-4 w-4" /> Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}