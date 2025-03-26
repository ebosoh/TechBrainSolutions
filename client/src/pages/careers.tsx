import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Career } from '@shared/schema';
import WavySeparator from '@/components/ui/wavy-separator';
import { Briefcase, Building, MapPin, Calendar, ArrowRight, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Careers() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  
  const { data: careers, isLoading } = useQuery<{ data: Career[] }>({ 
    queryKey: ['/api/careers']
  });
  
  // Filter and sort careers
  const filteredCareers = React.useMemo(() => {
    if (!careers?.data) return [];
    
    // First apply type filter
    let result = selectedType 
      ? careers.data.filter(career => career.type === selectedType)
      : careers.data;
    
    // Then apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(career => 
        career.title.toLowerCase().includes(term) || 
        career.description.toLowerCase().includes(term) ||
        career.location.toLowerCase().includes(term) ||
        career.requirements.toLowerCase().includes(term)
      );
    }
    
    // Sort the results
    return result.sort((a, b) => {
      if (sortBy === 'recent') {
        // Sort by date, most recent first
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      } else {
        // Sort by title alphabetically
        return a.title.localeCompare(b.title);
      }
    });
  }, [careers, selectedType, searchTerm, sortBy]);
  
  // Get unique job types for filter
  const uniqueTypes = React.useMemo(() => {
    if (!careers?.data) return [];
    const types = new Set<string>();
    careers.data.forEach(career => {
      if (career.type) types.add(career.type);
    });
    return Array.from(types);
  }, [careers]);

  // Handle clearing all filters
  const clearFilters = () => {
    setSelectedType(null);
    setSearchTerm('');
    setSortBy('recent');
  };

  return (
    <MainLayout>
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're looking for exceptional talent to help us build innovative solutions
              for our clients. Explore our open positions and find your next opportunity.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {!searchTerm && (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Sort: {sortBy === 'recent' ? 'Most Recent' : 'Title A-Z'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('recent')}>
                      Most Recent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('title')}>
                      Title A-Z
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {(selectedType || searchTerm || sortBy !== 'recent') && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Reset
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter by type */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant={selectedType === null ? "default" : "outline"}
                onClick={() => setSelectedType(null)}
                size="sm"
              >
                All Positions
              </Button>
              {uniqueTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  size="sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <WavySeparator />
          
          {/* Filter summary */}
          {filteredCareers.length > 0 && (
            <div className="mb-6 mt-8 text-sm text-muted-foreground">
              Showing {filteredCareers.length} {filteredCareers.length === 1 ? 'position' : 'positions'}
              {selectedType && <span> in <strong>{selectedType}</strong></span>}
              {searchTerm && <span> matching <strong>"{searchTerm}"</strong></span>}
            </div>
          )}
          
          {/* Job listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Link href={`/career/${career.id}`}>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        View Position
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Positions Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm 
                    ? `No positions match your search for "${searchTerm}".` 
                    : selectedType 
                      ? `There are currently no openings for ${selectedType} positions.` 
                      : "There are currently no job openings available. Please check back later."}
                </p>
                {(searchTerm || selectedType) && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See a Good Fit?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume, and 
              we'll keep it on file for future opportunities.
            </p>
            <Link href="/cv-submission">
              <Button size="lg">
                Send Your CV
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}