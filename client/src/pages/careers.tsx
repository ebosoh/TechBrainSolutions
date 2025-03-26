
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Careers() {
  const { data: careers } = useQuery({
    queryKey: ['careers'],
    queryFn: () => fetch('/api/careers').then(res => res.json())
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Career Opportunities</h1>
      
      <div className="grid gap-6">
        {careers?.data?.map((career: any) => (
          <Card key={career.id}>
            <CardHeader>
              <CardTitle>{career.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {career.location} • {career.type}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{career.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p>{career.requirements}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
