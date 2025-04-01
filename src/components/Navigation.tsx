'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white shadow-sm mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/"
              className={`text-lg font-semibold ${
                isActive('/') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Wardrobe
            </Link>
            <Link 
              href="/outfit-planner"
              className={`text-lg font-semibold ${
                isActive('/outfit-planner') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Outfit Planner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 