'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Admin/Dashboard'; // Adjust the import path as needed
import Sidebar from '@/components/Admin/SideBar'; // Adjust the import path as needed
import { useUser } from '@/context/userContext'; // Adjust the import path as needed

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Or a redirect fallback

  return (
    <div>
      <h1>
        <Dashboard/>
      </h1>
    </div>
  );
}
