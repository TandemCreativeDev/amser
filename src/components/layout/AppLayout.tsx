"use client";

import { SessionProvider } from "next-auth/react";
import Navigation from "@/components/ui/Navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-base-100">
        <Navigation />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </SessionProvider>
  );
}
