"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Palette, Calendar, Package, Plus } from 'lucide-react';
import { Button } from './ui/button';

const navigationItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Shirt, label: 'Wardrobe', href: '/wardrobe' },
  { icon: Palette, label: 'Outfits', href: '/outfit-planner' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Package, label: 'Packs', href: '/packs' },
];

export function LeftNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-[#fdfcfa] border-r border-[rgba(45,41,38,0.1)] pt-20 px-6">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ui-text ${
                  isActive
                    ? 'bg-[#f5f4f2] text-[#2d2926]'
                    : 'text-[#8b8681] hover:bg-[#f5f4f2] hover:text-[#2d2926]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm"> {item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Add Items Button */}
        <div className="pb-6">
          <Link href="/add">
            <Button className="w-full flex items-center gap-2 bg-[#2d2926] text-[#fdfcfa] hover:bg-[#2d2926]/90 rounded-full py-6">
              <Plus className="h-5 w-5" />
              <span className="ui-text font-medium text-sm">Add Items</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 