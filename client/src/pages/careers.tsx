import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/layouts/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Career } from '@shared/schema';
import WavySeparator from '@/components/ui/wavy-separator';
import { Career as LucideCareer, Building, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function Careers() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { data: careers, isLoading } = useQuery<{ data: Career[] }>({ 
    queryKey: ['/api/careers']
  });
  
  // Filter careers by type if a type is selected
  const filteredCareers = React.useMemo(() => {
    if (!careers?.data) return [];
    if (!selectedType) return careers.data;
    return careers.data.filter(career => career.type === selectedType);
  }, [careers, selectedType]);
  
  // Get unique job types for filter
  const uniqueTypes = React.useMemo(() => {
    if (!careers?.data) return [];
    const types = new Set<string>();
    careers.data.forEach(career => {
      if (career.type) types.add(career.type);
    });
    return Array.from(types);
  }, [careers]);

  return (
    <MainLayout>
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're looking for exceptional talent to help us build innovative solutions
              for our clients. Explore our open positions and find your next opportunity.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant={selectedType === null ? "default" : "outline"}
                onClick={() => setSelectedType(null)}
              >
                All Positions
              </Button>
              {uniqueTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <WavySeparator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 w-4/5 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 w-28 bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))
            ) : filteredCareers.length > 0 ? (
              filteredCareers.map(career => (
                <Card key={career.id} className="group transition-all hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{career.title}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {career.type}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {career.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {career.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-4">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {career.createdAt ? (
                        <>Posted: {new Date(career.createdAt).toLocaleDateString()}</>
                      ) : 'Recently posted'}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                      View Position
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <LucideCareer className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Positions Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {selectedType 
                    ? `There are currently no openings for ${selectedType} positions.` 
                    : "There are currently no job openings available. Please check back later."}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See a Good Fit?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume, and 
              we'll keep it on file for future opportunities.
            </p>
            <Button size="lg">
              Send Your CV
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}