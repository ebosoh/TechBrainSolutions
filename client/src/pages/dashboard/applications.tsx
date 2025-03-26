import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { type JobApplication } from "@shared/schema";
import { Eye, Filter, Search, X, RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

type ApplicationWithCareerTitle = JobApplication & {
  careerTitle?: string;
};

export default function ApplicationsManagementPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithCareerTitle | null>(null);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch all job applications
  const { data: applications, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      return apiRequest(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      setDetailsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Handle viewing application details
  const handleViewDetails = (application: ApplicationWithCareerTitle) => {
    setSelectedApplication(application);
    setApplicationStatus(application.status);
    setApplicationNotes(application.notes || "");
    setDetailsOpen(true);
  };

  // Handle updating application status
  const handleUpdateStatus = () => {
    if (!selectedApplication) return;

    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status: applicationStatus,
      notes: applicationNotes,
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>;
      case "interviewing":
        return <Badge variant="default">Interviewing</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-green-600 hover:bg-green-700">Hired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Filter applications
  const filteredApplications = applications?.data
    ? applications.data.filter((app: ApplicationWithCareerTitle) => {
        const matchesSearch =
          !search ||
          app.name.toLowerCase().includes(search.toLowerCase()) ||
          app.email.toLowerCase().includes(search.toLowerCase()) ||
          (app.careerTitle && app.careerTitle.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = !statusFilter || app.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
            <p className="text-muted-foreground">
              Manage and review job applications from candidates
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Review and manage all job applications submitted through the careers page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex relative sm:w-2/3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or position..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full"
                />
                {search && (
                  <Button
                    variant="ghost"
                    className="absolute right-0 top-0 h-10 w-10 p-0"
                    onClick={() => setSearch("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 sm:w-1/3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter || ""}
                  onValueChange={(value) => setStatusFilter(value || undefined)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">Loading applications...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading applications. Please try refreshing.</p>
                <Button onClick={() => refetch()} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {applications?.data?.length === 0 ? (
                  <p>No applications have been submitted yet.</p>
                ) : (
                  <p>No applications match your search criteria.</p>
                )}
              </div>
            ) : (
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application: ApplicationWithCareerTitle) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.name}</div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                        </TableCell>
                        <TableCell>{application.careerTitle || "Unknown Position"}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>{formatDate(application.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleViewDetails(application)}
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredApplications.length} of {applications?.data?.length || 0} applications
            </div>
          </CardFooter>
        </Card>

        {/* Application Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review and update this job application status
              </DialogDescription>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Applicant Information</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Name:</span> {selectedApplication.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedApplication.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {selectedApplication.phone}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Position Details</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Position:</span> {selectedApplication.careerTitle || "Unknown Position"}
                      </div>
                      <div>
                        <span className="font-medium">Applied on:</span> {formatDate(selectedApplication.submittedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Current Status:</span> {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Resume Link</h3>
                  <div className="mt-2">
                    <a 
                      href={selectedApplication.resumeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedApplication.resumeLink}
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cover Letter</h3>
                  <div className="mt-2 rounded-md border p-3 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedApplication.coverLetter}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Update Application Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={applicationStatus}
                        onValueChange={setApplicationStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="interviewing">Interviewing</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Internal Notes</label>
                      <Textarea
                        value={applicationNotes}
                        onChange={(e) => setApplicationNotes(e.target.value)}
                        placeholder="Add notes about this candidate..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}