import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import AdminGuard from '@/components/global/AdminGuard';
import { Toaster } from '@/components/shadcn/sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className='flex h-screen overflow-hidden bg-gray-1'>
        <AdminSidebar />
        <div className='flex min-w-0 flex-1 flex-col'>
          <AdminTopbar />
          <main className='scrollbar-right flex-1 overflow-y-auto p-4 md:p-8'>{children}</main>
        </div>
        <Toaster />
      </div>
    </AdminGuard>
  );
}
