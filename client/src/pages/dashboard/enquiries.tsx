import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactForm } from '@shared/schema';
import { 
  Mail,
  Calendar,
  Search,
  ArrowUpDown,
  ChevronDown,
  MessageCircle,
  User,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactForm | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: enquiries, isLoading } = useQuery<{ data: ContactForm[] }>({
    queryKey: ['/api/dashboard/enquiries'],
  });
  
  const ITEMS_PER_PAGE = 10;
  
  // Filter and sort enquiries
  const filteredEnquiries = React.useMemo(() => {
    if (!enquiries?.data) return [];
    
    let filtered = [...enquiries.data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        enquiry => 
          enquiry.name.toLowerCase().includes(query) ||
          enquiry.email.toLowerCase().includes(query) ||
          enquiry.subject.toLowerCase().includes(query) ||
          enquiry.message.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
    
    return filtered;
  }, [enquiries, searchQuery]);
  
  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
  const currentEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // View enquiry details
  const handleViewDetails = (enquiry: ContactForm) => {
    setSelectedEnquiry(enquiry);
    setIsDetailsOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Generate pagination items
  const paginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if not the first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        />
      </PaginationItem>
    );
    
    return items;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Contact Enquiries</h2>
          <Badge variant="outline" className="text-sm">
            {filteredEnquiries.length} total enquiries
          </Badge>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle>Enquiries</CardTitle>
                <CardDescription>
                  Manage contact form submissions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search enquiries..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked>
                      Show all enquiries
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Today only
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      This week
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      This month
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : currentEnquiries.length > 0 ? (
              <div className="space-y-4">
                {currentEnquiries.map((enquiry) => (
                  <div 
                    key={enquiry.id} 
                    className="border rounded-lg p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDetails(enquiry)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{enquiry.name}</h3>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 md:mt-0">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(enquiry.submittedAt)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{enquiry.email}</span>
                      </div>
                      <div className="text-sm flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="font-medium">{enquiry.subject}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{enquiry.message}</p>
                    </div>
                  </div>
                ))}
                
                <Pagination>
                  <PaginationContent>
                    {paginationItems()}
                  </PaginationContent>
                </Pagination>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted mb-4" />
                <h3 className="text-lg font-medium mb-2">No enquiries found</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery 
                    ? `No enquiries match your search for "${searchQuery}"`
                    : "There are no contact form submissions yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Enquiry Details Dialog */}
        {selectedEnquiry && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enquiry Details</DialogTitle>
                <DialogDescription>
                  Contact form submission from {selectedEnquiry.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">From</h4>
                    <p className="font-medium">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                    <p className="font-medium">{selectedEnquiry.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Subject</h4>
                  <p className="font-medium">{selectedEnquiry.subject}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h4>
                  <p>{formatDate(selectedEnquiry.submittedAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Message</h4>
                  <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}