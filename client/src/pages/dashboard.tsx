import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ContactForm, User, Career, ChatMessage } from '@shared/schema';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, MessageSquare, Users, Briefcase } from 'lucide-react';

const metricCardClasses = "flex flex-col items-center justify-center h-full";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: contactForms, isLoading: isLoadingForms } = useQuery<{ data: ContactForm[] }>({
    queryKey: ['/api/dashboard/enquiries'],
    enabled: activeTab === 'overview',
  });
  
  const { data: users, isLoading: isLoadingUsers } = useQuery<{ data: User[] }>({
    queryKey: ['/api/dashboard/users'],
    enabled: activeTab === 'overview',
  });
  
  const { data: careers, isLoading: isLoadingCareers } = useQuery<{ data: Career[] }>({
    queryKey: ['/api/careers'],
    enabled: activeTab === 'overview',
  });
  
  // Prepare data for the enquiries chart
  const enquiriesData = React.useMemo(() => {
    if (!contactForms?.data) return [];
    
    // Group by date (ignoring time)
    const grouped = contactForms.data.reduce((acc, form) => {
      const date = new Date(form.submittedAt).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array format for chart
    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [contactForms]);
  
  // Calculate metrics
  const metrics = {
    totalEnquiries: contactForms?.data?.length || 0,
    totalUsers: users?.data?.length || 0,
    totalCareers: careers?.data?.length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enquiries
                  </CardTitle>
                  <CardDescription>Total contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={metricCardClasses}>
                    <span className="text-4xl font-bold">{metrics.totalEnquiries}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </CardTitle>
                  <CardDescription>Total registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={metricCardClasses}>
                    <span className="text-4xl font-bold">{metrics.totalUsers}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Job Postings
                  </CardTitle>
                  <CardDescription>Total career opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={metricCardClasses}>
                    <span className="text-4xl font-bold">{metrics.totalCareers}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Enquiries Over Time</CardTitle>
                <CardDescription>Number of enquiries received by date</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingForms ? (
                  <div className="flex items-center justify-center h-full">
                    <span>Loading chart data...</span>
                  </div>
                ) : enquiriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enquiriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2f72df" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-muted-foreground">No enquiry data available</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enquiries</CardTitle>
                <CardDescription>Recent contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingForms ? (
                  <div className="text-center py-6">Loading enquiries...</div>
                ) : contactForms?.data && contactForms.data.length > 0 ? (
                  <div className="space-y-8">
                    {contactForms.data.map((form) => (
                      <div key={form.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{form.name}</h3>
                            <p className="text-sm text-muted-foreground">{form.email}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(form.submittedAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Subject: {form.subject}</p>
                          <p className="text-sm">{form.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No enquiries found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>User accounts in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="text-center py-6">Loading users...</div>
                ) : users?.data && users.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Username</th>
                          <th className="text-left py-3 px-2">Full Name</th>
                          <th className="text-left py-3 px-2">Email</th>
                          <th className="text-left py-3 px-2">Role</th>
                          <th className="text-left py-3 px-2">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.data.map(user => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{user.id}</td>
                            <td className="py-3 px-2">{user.username}</td>
                            <td className="py-3 px-2">{user.fullName || '-'}</td>
                            <td className="py-3 px-2">{user.email || '-'}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' 
                                  ? 'bg-red-100 text-red-800' 
                                  : user.role === 'editor'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No users found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="careers">
            <Card>
              <CardHeader>
                <CardTitle>Career Opportunities</CardTitle>
                <CardDescription>Job postings management</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCareers ? (
                  <div className="text-center py-6">Loading careers...</div>
                ) : careers?.data && careers.data.length > 0 ? (
                  <div className="space-y-6">
                    {careers.data.map((career) => (
                      <div key={career.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{career.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm bg-primary/10 text-primary rounded px-2 py-0.5 mr-2">
                                {career.department}
                              </span>
                              <span className="text-sm bg-muted text-muted-foreground rounded px-2 py-0.5">
                                {career.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              career.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {career.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-4">{career.shortDescription}</p>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span>Posted: {new Date(career.createdAt).toLocaleDateString()}</span>
                          <span>Applications: {career.applicationsCount || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No career postings found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}