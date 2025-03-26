import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import CareerManager from '@/components/CareerManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function CareerManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Careers Management</h2>
        
        <Card className="bg-green-50 border-green-200 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 flex items-center text-lg">
              <HelpCircle className="w-5 h-5 mr-2" />
              Careers Management Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-800">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Create job postings with detailed descriptions and requirements.
              </li>
              <li>
                Use the <strong>Active Posting</strong> toggle to control visibility on the careers page.
              </li>
              <li>
                The <strong>Short Description</strong> is displayed in the job listings preview.
              </li>
              <li>
                Be specific about the job location, required skills, and responsibilities.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <CareerManager />
      </div>
    </DashboardLayout>
  );
}