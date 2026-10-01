import type { Metadata } from "next";
import { Toaster } from "@/components/shadcn/sonner";


export const metadata: Metadata = {
  title: `ورود | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
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
