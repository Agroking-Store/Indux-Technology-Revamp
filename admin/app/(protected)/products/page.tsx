'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, Package, Search, ExternalLink } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Product, getAdminProducts, deleteProduct, updateProductStatus } from '@/lib/api';
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

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts({ search: searchTerm });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (id: string, currentStatus: "Draft" | "Published") => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await updateProductStatus(id, newStatus);
      toast.success(`Product status updated to ${newStatus}`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="size-8 text-blue-600" /> Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage software products and solutions shown on the public Products page.
          </p>
        </div>
        <Link
          href="/products/create"
          className={cn(buttonVariants({ variant: "default" }), "bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer shadow-md")}
        >
          <Plus className="size-4" /> Add Product
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <Search className="size-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search products by title, category, or description..."
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

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Theme</TableHead>
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
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-slate-500">
                  No products found. Click &quot;Add Product&quot; to create your first one.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const imgUrl = product.image.startsWith("http")
                  ? product.image
                  : product.image.startsWith("/")
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${product.image}`
                    : product.image;

                return (
                  <TableRow key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    <TableCell>
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-1">
                        <img
                          src={product.image.startsWith("http") ? product.image : imgUrl}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 dark:text-white">
                      <div>
                        {product.title}
                        <div className="text-xs text-slate-400 font-normal line-clamp-1 max-w-xs">
                          {product.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      /products/{product.slug}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize",
                        product.themeColor === "blue" && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        product.themeColor === "emerald" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        product.themeColor === "cyan" && "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
                        product.themeColor === "indigo" && "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
                      )}>
                        {product.themeColor}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(product._id, product.status)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                          product.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        )}
                        title="Click to toggle status"
                      >
                        {product.status === "Published" ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        {product.status}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product._id}/edit`}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="size-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Product"
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
        isOpen={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
