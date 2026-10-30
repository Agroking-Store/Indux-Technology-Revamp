'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, Sparkles, Search, ExternalLink } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { RecentWork, getAdminRecentWorks, deleteRecentWork, updateRecentWorkStatus } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function RecentWorksAdminPage() {
  const [works, setWorks] = useState<RecentWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [workToDelete, setWorkToDelete] = useState<RecentWork | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminRecentWorks({
        search: searchTerm,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      });
      setWorks(data.recentWorks || []);
    } catch (error) {
      console.error("Failed to load recent works:", error);
      toast.error("Failed to load recent works");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleToggleStatus = async (id: string, currentStatus: "Draft" | "Published") => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await updateRecentWorkStatus(id, newStatus);
      toast.success(`Project status updated to ${newStatus}`);
      setWorks((prev) =>
        prev.map((w) => (w._id === id ? { ...w, status: newStatus } : w))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async () => {
    if (!workToDelete) return;
    try {
      await deleteRecentWork(workToDelete._id);
      toast.success("Project deleted successfully");
      setWorks((prev) => prev.filter((w) => w._id !== workToDelete._id));
      setWorkToDelete(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="size-8 text-blue-600" /> Recent Works
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage portfolio case studies, client platforms, and showcase projects.
          </p>
        </div>
        <Link
          href="/recent-works/create"
          className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer shadow-md")}
        >
          <Plus className="size-4" /> Add Project
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 flex-1 w-full">
          <Search className="size-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search projects by title, client, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Clean Energy & Industrial">Clean Energy & Industrial</option>
            <option value="IT & Digital Transformation">IT & Digital Transformation</option>
            <option value="SaaS & FinTech">SaaS & FinTech</option>
            <option value="Retail & Enterprise">Retail & Enterprise</option>
            <option value="Coaching & Corporate">Coaching & Corporate</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Client & Year</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-16 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : works.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-slate-500">
                  No projects found. Click &quot;Add Project&quot; to add your first work showcase.
                </TableCell>
              </TableRow>
            ) : (
              works.map((work) => {
                const imgUrl = work.image.startsWith("http")
                  ? work.image
                  : work.image.startsWith("/")
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${work.image}`
                    : work.image;

                return (
                  <TableRow key={work._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    <TableCell>
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-1">
                        <img
                          src={work.image.startsWith("http") ? work.image : imgUrl}
                          alt={work.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-white">
                      <div>
                        {work.title}
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-normal line-clamp-1">
                          {work.tagline}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {work.client}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {work.year}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {work.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(work._id, work.status)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                          work.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        )}
                        title="Click to toggle status"
                      >
                        {work.status === "Published" ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        {work.status}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {work.liveUrl && work.liveUrl.trim() && (
                          <a
                            href={work.liveUrl.startsWith('http') ? work.liveUrl.trim() : `https://${work.liveUrl.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Visit Live URL"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                        <Link
                          href={`/recent-works/${work._id}/edit`}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="size-4" />
                        </Link>
                        <button
                          onClick={() => setWorkToDelete(work)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={!!workToDelete}
        onOpenChange={(open) => {
          if (!open) setWorkToDelete(null);
        }}
        title="Delete Recent Work Project"
        description={`Are you sure you want to delete "${workToDelete?.title}"? This will remove it from the showcase.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
