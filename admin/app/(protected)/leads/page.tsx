'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Briefcase } from 'lucide-react';
import LeadsTable from './_components/LeadsTable';
import QuotesTable from './_components/QuotesTable';

export default function LeadsAndQuotesPage() {
  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Inquiries & Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage contact form submissions and quote requests.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="leads" className="flex items-center gap-2 cursor-pointer">
            <Mail size={16} /> Contact Leads
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2 cursor-pointer">
            <Briefcase size={16} /> Quote Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-0 outline-none">
          <LeadsTable />
        </TabsContent>
        
        <TabsContent value="quotes" className="mt-0 outline-none">
          <QuotesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}