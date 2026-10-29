"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Briefcase,
  Search,
  X,
  Award,
  Image as ImageIcon,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import api, { ApiResponse } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CaseStudy {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  challenge: string;
  solution: string;
  result: string;
  image?: string;
  status: "Draft" | "Published";
  views?: number;
  createdAt: string;
}

export default function CaseStudiesPage() {
  const router = useRouter();

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CaseStudy | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCaseStudies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await api.get<ApiResponse<any>>("/case-studies", { params });
      const data = res.data.data;
      setCaseStudies(data.caseStudies || []);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch {
      toast.error("Failed to fetch case studies");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  const handleToggleStatus = async (item: CaseStudy) => {
    const newStatus = item.status === "Published" ? "Draft" : "Published";
    try {
      await api.patch(`/case-studies/${item._id}/status`, { status: newStatus });
      toast.success(`Case study marked as ${newStatus}`);
      setCaseStudies((prev) =>
        prev.map((c) => (c._id === item._id ? { ...c, status: newStatus } : c))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      await api.delete(`/case-studies/${itemToDelete._id}`);
      toast.success("Case study deleted successfully");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchCaseStudies();
    } catch {
      toast.error("Failed to delete case study");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Case Studies
            </h1>
            <Badge variant="outline" className="text-xs">
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage real-world customer stories, challenges, solutions, and verified results.
          </p>
        </div>

        <Button
          onClick={() => router.push("/case-studies/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium cursor-pointer"
        >
          <Plus size={16} />
          Create Case Study
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search case studies by name, headline, challenge, result..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(val: any) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] cursor-pointer">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">All Status</SelectItem>
                <SelectItem value="Published" className="cursor-pointer">Published</SelectItem>
                <SelectItem value="Draft" className="cursor-pointer">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Case Studies Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[220px]">Client / Project</TableHead>
                <TableHead className="min-w-[280px]">Headline</TableHead>
                <TableHead className="w-[120px] text-center">Image</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : caseStudies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <Award className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-foreground">No case studies found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchTerm || statusFilter !== "all"
                        ? "Try clearing your filters or search term."
                        : "Click 'Create Case Study' to add your first customer story."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                caseStudies.map((item) => (
                  <TableRow key={item._id} className="hover:bg-muted/40 transition">
                    <TableCell>
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        /{item.slug}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-foreground line-clamp-1 font-medium">
                        {item.headline}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.challenge}
                      </p>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.image ? (
                        <div className="relative inline-block w-12 h-8 rounded border border-border overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={item.status === "Published" ? "default" : "secondary"}
                        className={cn(
                          "cursor-pointer select-none",
                          item.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                        )}
                        onClick={() => handleToggleStatus(item)}
                        title="Click to toggle status"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                  onClick={() => router.push(`/case-studies/${item._id}`)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                  onClick={() => router.push(`/case-studies/edit/${item._id}`)}
                                >
                                  <Edit2 className="size-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>Edit Case Study</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                                  onClick={() => {
                                    setItemToDelete(item);
                                    setDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Case Study"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText={actionLoading ? "Deleting..." : "Delete"}
        variant="destructive"
      />
    </div>
  );
}
