'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { NewHeader } from "./NewHeader";
import { LeftNavigation } from "./LeftNavigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { data: session, status } = useSession();
  const [sessionTimeout, setSessionTimeout] = useState(false);

  useEffect(() => {
    // Add a timeout for session loading
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        setSessionTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [status]);

  // Show loading state while checking authentication (with timeout fallback)
  if (status === 'loading' && !sessionTimeout) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no session or session times out, show children without authenticated layout
  if (!session || sessionTimeout) {
    return <>{children}</>;
  }

  // If session exists, show authenticated layout
  return (
    <>
      <NewHeader />
      <div className="flex min-h-screen pt-16">
        <LeftNavigation />
        <main className="flex-1 ml-64 w-full max-w-none overflow-x-hidden">
          <div className="w-full max-w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 