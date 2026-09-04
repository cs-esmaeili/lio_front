import type { Metadata } from "next";
import { Toaster } from "@/components/shadcn/sonner";


export const metadata: Metadata = {
  title: "ورود | دودیگرام",
  robots: "noindex, nofollow",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
        <div>
            {children}
            <Toaster />
        </div>
  );
}
