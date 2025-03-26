
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { data: enquiries } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => fetch('/api/dashboard/enquiries').then(res => res.json())
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>
        <div className="grid gap-4">
          {enquiries?.data?.map((enquiry: any) => (
            <Card key={enquiry.id}>
              <CardHeader>
                <CardTitle>{enquiry.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>From:</strong> {enquiry.name} ({enquiry.email})</p>
                <p><strong>Message:</strong> {enquiry.message}</p>
                <p className="text-sm text-gray-500">
                  Received: {new Date(enquiry.submittedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
