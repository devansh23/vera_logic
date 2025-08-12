"use client"

import React from 'react';
import { Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { useSession, signOut } from 'next-auth/react';

export function NewHeader() {
  const { data: session } = useSession();
  
  return (
    <header className="sticky top-0 z-50 bg-[#fdfcfa] backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-playfair font-medium tracking-tight text-gray-900">Vera</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, brand, color, size…"
                className="pl-10 bg-[#f8f7f5] border-0 rounded-full ui-text"
              />
            </div>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center space-x-4">
            {/* User Profile with Display Picture */}
            <div className="flex items-center space-x-3">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
              <span className="text-sm font-semibold text-gray-700">
                {session?.user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={() => signOut()}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 