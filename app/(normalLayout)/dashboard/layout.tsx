import { Sidebar } from "@/components/dashboard/Sidebar";
import AuthGuard from "@/components/global/AuthGuard";
import type { Metadata } from "next";
import { isSeoEnabled, SEO_DEFAULT_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = isSeoEnabled()
  ? {
      title: " داشبورد | دودیگرام",
      robots: SEO_DEFAULT_ROBOTS,
    }
  : { robots: 'noindex, nofollow' };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-4 my-10">
          <Sidebar />
          <main className="flex flex-col h-full">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}