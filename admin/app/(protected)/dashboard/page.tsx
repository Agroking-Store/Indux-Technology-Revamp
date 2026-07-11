'use client';

import { useEffect, useState } from 'react';
import api, { ApiResponse } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  blogs: { total: number; published: number; draft: number };
  careers: { total: number; active: number; closed: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
        setStats(res.data.data);
      } catch (error) {
        // Error is handled by the interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Blogs</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.blogs.total || 0}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-green-600">Published: {stats?.blogs.published || 0}</span>
            <span className="text-yellow-600">Draft: {stats?.blogs.draft || 0}</span>
          </div>
        </div>

        {/* Career Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
          <p className="text-3xl font-bold text-gray-800">{stats?.careers.total || 0}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-green-600">Active: {stats?.careers.active || 0}</span>
            <span className="text-red-600">Closed: {stats?.careers.closed || 0}</span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h3>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/blogs/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              + Add Blog
            </Link>
            <Link
              href="/careers/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              + Add Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}