'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, FileText, Tag, Search, X } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import api, { ApiResponse } from '@/lib/api';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  author?: string;
  tags?: string[];
  status: 'Draft' | 'Published';
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const isMounted = useRef(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, pageIndex: 0 })); // reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { 
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      
      if (statusFilter !== 'all') params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await api.get<ApiResponse<{ blogs: Blog[]; pagination: { total: number } }>>(
        '/blogs',
        { params }
      );
      if (isMounted.current) {
        setBlogs(res.data.data.blogs);
        setTotalCount(res.data.data.pagination.total);
      }
    } catch {
      // handled by axios interceptor
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [statusFilter, debouncedSearch, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    isMounted.current = true;
    fetchBlogs();
    return () => { isMounted.current = false; };
  }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch {
      // handled
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.patch(`/blogs/${id}/status`, { status: newStatus });
      toast.success(`Blog ${newStatus === 'Published' ? 'published' : 'moved to Draft'}`);
      setBlogs(prev =>
        prev.map(b => b._id === id ? { ...b, status: newStatus as Blog['status'] } : b)
      );
    } catch {
      fetchBlogs();
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const columns: ColumnDef<Blog>[] = useMemo(() => [
    {
      id: "serial",
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium text-sm pl-2">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: () => <div className="text-center">Article Title</div>,
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div className="flex flex-col gap-1 w-full pr-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={<div className="text-sm font-semibold text-foreground truncate cursor-help">{blog.title}</div>} />
                <TooltipContent>
                  <p>{blog.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="text-xs text-muted-foreground font-mono truncate">/{blog.slug}</div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 truncate">
                {blog.tags.slice(0, 2).map(tag => (
                  <Badge variant="secondary" key={tag} className="text-[10px] px-1.5 py-0 h-4 truncate max-w-[80px]">
                    <Tag size={8} className="mr-1 shrink-0" /> <span className="truncate">{tag}</span>
                  </Badge>
                ))}
                {blog.tags.length > 2 && (
                  <span className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap">+{blog.tags.length - 2} more</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Category</div>,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap truncate max-w-[120px]">
          {row.getValue("category") || 'Tech'}
        </Badge>
      ),
    },
    {
      accessorKey: "author",
      header: () => <div className="text-center">Author</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-sm font-medium truncate max-w-[120px]">
          {row.getValue("author") || '—'}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isPublished = status === 'Published';
        return (
          <Badge 
            variant="outline" 
            className={`whitespace-nowrap ${
              isPublished 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/40' 
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40'
            }`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <TooltipProvider>
              
              <Tooltip>
                <TooltipTrigger render={
                  <Link
                    href={`/blogs/edit/${blog._id}`}
                    className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-indigo-600 dark:text-indigo-400 cursor-pointer" })}
                  >
                    <Edit2 size={16} />
                  </Link>
                } />
                <TooltipContent>Edit Article</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(blog._id, blog.status)}
                    className={`h-8 w-8 cursor-pointer ${
                      blog.status === 'Published'
                        ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
                        : 'text-green-600 dark:text-green-400 hover:text-green-700'
                    }`}
                  >
                    {blog.status === 'Published' ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                } />
                <TooltipContent>{blog.status === 'Published' ? 'Move to Draft' : 'Publish Article'}</TooltipContent>
              </Tooltip>

              <ConfirmDialog
                title="Are you sure you want to delete this blog?"
                description="This action cannot be undone. This will permanently delete the blog."
                confirmText="Yes, delete"
                onConfirm={() => handleDelete(blog._id)}
                icon="trash"
                trigger={
                    <Tooltip>
  <ConfirmDialog
    title="Are you sure you want to delete this blog?"
    description="This action cannot be undone. This will permanently delete the blog."
    confirmText="Yes, delete"
    onConfirm={() => handleDelete(blog._id)}
    icon="trash"
    trigger={
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 cursor-pointer"
          >
            <Trash2 size={16} />
          </Button>
        }
      />
    }
  />

  <TooltipContent>Delete Article</TooltipContent>
</Tooltip>
                  
                }
              />
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleToggleStatus, handleDelete, pagination]);

  const table = useReactTable({
    data: blogs,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Blogs Feed</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center">
            Write, edit, and publish blog articles.
            {!loading && (
              <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                • {totalCount} article{totalCount !== 1 ? 's' : ''} total
              </span>
            )}
          </p>
        </div>
        
        <Link
          href="/blogs/create"
          className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-600/20")}
        >
          <Plus size={16} className="mr-1" /> Create Article
        </Link>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search title, category, tags..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => { setStatusFilter(value); setPagination(prev => ({ ...prev, pageIndex: 0 })); }}>
            <SelectTrigger className="w-[140px] h-9 cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
              <SelectItem value="Published" className="cursor-pointer">Published</SelectItem>
              <SelectItem value="Draft" className="cursor-pointer">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(statusFilter !== 'all' || searchTerm !== '') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground h-9 cursor-pointer"
          >
            <X size={16} className="mr-1" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  let width = 'auto';
                  if (header.id === 'serial') width = '60px';
                  else if (header.id === 'title') width = '40%';
                  else if (header.id === 'actions') width = '120px';
                  
                  return (
                    <TableHead key={header.id} className="font-bold text-muted-foreground uppercase text-xs tracking-wider h-11 align-middle" style={{ width }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="size-12 mb-3 opacity-30 text-muted-foreground" />
                    <h3 className="text-lg font-bold text-foreground">No Articles Found</h3>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search or filters.' : 'Create your first blog post to populate the feed.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{pagination.pageIndex * pagination.pageSize + 1}</span> to <span className="font-medium text-foreground">{Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)}</span> of <span className="font-medium text-foreground">{totalCount}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}