import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import ContentManager from '@/components/ContentManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function ContentManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Content Management</h2>
        
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 flex items-center text-lg">
              <Info className="w-5 h-5 mr-2" />
              Content Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Content is organized by <strong>sections</strong> (pages) and <strong>keys</strong> (identifiers).
              </li>
              <li>
                Use descriptive keys to easily identify content items.
              </li>
              <li>
                Setting content as inactive will hide it from the website without deleting it.
              </li>
              <li>
                HTML content supports basic formatting tags like &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, etc.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <ContentManager />
      </div>
    </DashboardLayout>
  );
}