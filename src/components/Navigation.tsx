"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Vera
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 h-16 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Wardrobe
              </Link>
              
              {session && (
                <Link 
                  href="/outfit-planner" 
                  className={`inline-flex items-center px-1 pt-1 h-16 border-b-2 text-sm font-medium ${
                    pathname === '/outfit-planner' 
                      ? 'border-blue-500 text-gray-900 font-bold' 
                      : 'border-transparent text-purple-600 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  Outfit Planner
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center">
                {session.user?.image && (
                  <img 
                    className="h-8 w-8 rounded-full mr-2" 
                    src={session.user.image} 
                    alt="Profile" 
                  />
                )}
                <span className="text-sm text-gray-700 mr-4">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign in
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {session && (
              <Link
                href="/outfit-planner"
                className="mr-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Outfits
              </Link>
            )}
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 