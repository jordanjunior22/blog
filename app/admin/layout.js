'use client';
import { UserProvider } from '@/context/userContext';
import AdminPageWrapper from '@/utils/AdminPageWrapper';

import Sidebar from "@/components/Admin/SideBar";

export default function AdminLayout({ children }) {
  return (
    <UserProvider>
      <AdminPageWrapper>
        <div className="flex h-screen overflow-hidden text-black">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100 overflow-y-auto text-sm">
            {children}
          </main>
        </div>
      </AdminPageWrapper>
    </UserProvider>

  );
}
