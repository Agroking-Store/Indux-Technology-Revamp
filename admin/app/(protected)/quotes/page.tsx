'use client';

import { Briefcase } from 'lucide-react';
import QuotesTable from './_components/QuotesTable';

export default function QuotesPage() {
  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Briefcase className="text-indigo-600 dark:text-indigo-400" /> Quote Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your service quote requests and client inquiries.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <QuotesTable />
      </div>
    </div>
  );
}
