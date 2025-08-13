"use client"

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Package } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface Outfit {
  id: string;
  name: string;
  tryOnImage?: string | null;
  description?: string | null;
}

interface WardrobeItem {
  id: string;
  image?: string | null;
  name: string;
}

export function SuggestedOutfitsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [fallbackSets, setFallbackSets] = useState<WardrobeItem[][]>([]);
  const router = useRouter();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/outfits');
        if (resp.ok) {
          const data = await resp.json();
          const saved: Outfit[] = Array.isArray(data)
            ? data.map((o: any) => ({ id: o.id, name: o.name, tryOnImage: o.tryOnImage ?? null, description: o.description ?? null }))
            : [];
          if (saved.length > 0) {
            setOutfits(saved);
            return;
          }
        }
      } catch {}

      // Fallback: generate suggestions from wardrobe items
      try {
        const w = await fetch('/api/wardrobe');
        if (!w.ok) return;
        const items: WardrobeItem[] = await w.json();
        if (!Array.isArray(items) || items.length === 0) return;
        // create 5 sets of up to 4 items each
        const sets: WardrobeItem[][] = [];
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(5, Math.ceil(shuffled.length / 4)); i++) {
          sets.push(shuffled.slice(i * 4, i * 4 + 4));
        }
        setFallbackSets(sets);
      } catch {}
    };
    load();
  }, []);

  const handleSchedule = (outfitId?: string) => {
    if (outfitId) {
      router.push(`/calendar?outfitId=${encodeURIComponent(outfitId)}`);
    } else {
      router.push('/calendar');
    }
  };

  const handleAddToPack = (outfitId?: string) => {
    if (outfitId) {
      router.push(`/packs?addOutfit=${encodeURIComponent(outfitId)}`);
    } else {
      router.push('/packs');
    }
  };

  const hasSaved = outfits.length > 0;

  return (
    <section className="mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-4 max-w-full">
        <h2 className="text-2xl font-normal text-gray-900 font-serif">Suggested Outfits</h2>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={scrollLeft} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={scrollRight} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="carousel-container flex gap-6 pb-4 w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hasSaved
          ? outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-200"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-50">
                  {outfit.tryOnImage ? (
                    <img
                      src={outfit.tryOnImage}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">{outfit.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {outfit.description || 'A personalized look picked from your saved outfits.'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1 rounded-full flex items-center justify-center gap-2" onClick={() => handleSchedule(outfit.id)}>
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>
                    <Button variant="outline" className="rounded-full flex items-center gap-2" onClick={() => handleAddToPack(outfit.id)}>
                      <Package className="h-4 w-4" />
                      Pack
                    </Button>
                  </div>
                </div>
              </div>
            ))
          : fallbackSets.map((set, idx) => (
              <div
                key={`fallback-${idx}`}
                className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-200"
              >
                {/* Collage */}
                <div className="relative aspect-[4/5] bg-gray-50">
                  <div className="grid grid-cols-2 gap-0.5 w-full h-full p-0.5">
                    {set.slice(0, 4).map((it) => (
                      <div key={it.id} className="bg-gray-100 overflow-hidden">
                        {it.image ? (
                          <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">Suggested Outfit</h3>
                  <p className="text-sm text-gray-600 mb-4">A quick mix-and-match from your wardrobe.</p>
                  <div className="flex gap-3">
                    <Button className="flex-1 rounded-full" onClick={() => handleSchedule()}>
                      <Calendar className="h-4 w-4 inline-block mr-2" />
                      Schedule
                    </Button>
                    <Button variant="outline" className="rounded-full flex items-center gap-2" onClick={() => handleAddToPack()}>
                      <Package className="h-4 w-4" />
                      Pack
                    </Button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
} 