import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Toaster } from '@/components/shadcn/sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-gray-1'>
      <AdminSidebar />
      <div className='flex min-w-0 flex-1 flex-col'>
        <AdminTopbar />
        <main className='flex-1 p-4 md:p-8'>{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
