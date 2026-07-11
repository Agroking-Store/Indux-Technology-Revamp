'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { admin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.push(admin ? '/dashboard' : '/login');
    }
  }, [admin, isLoading, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
}