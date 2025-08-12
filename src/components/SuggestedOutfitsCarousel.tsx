"use client"

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const suggestedOutfits = [
  {
    id: 1,
    name: 'Rainy Day Chic',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=400&fit=crop',
    tags: ['Weather Perfect', 'Work Ready', 'Comfortable'],
    matchScore: 98,
    reason: 'Perfect for today\'s rainy weather and your 2 PM meeting',
    items: ['Trench Coat', 'Silk Blouse', 'Tailored Trousers', 'Ankle Boots']
  },
  {
    id: 2,
    name: 'Cozy Professional',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    tags: ['Mood Match', 'Versatile', 'Stylish'],
    matchScore: 95,
    reason: 'Matches your "feeling comfy" mood while staying professional',
    items: ['Cashmere Sweater', 'Wide-leg Trousers', 'Loafers', 'Statement Necklace']
  },
  {
    id: 3,
    name: 'Power Meeting',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=400&fit=crop',
    tags: ['Confidence', 'Bold', 'Executive'],
    matchScore: 92,
    reason: 'Command attention in your important client presentation',
    items: ['Structured Blazer', 'Midi Skirt', 'Pumps', 'Watch']
  },
  {
    id: 4,
    name: 'Creative Casual',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    tags: ['Creative', 'Relaxed', 'Trendy'],
    matchScore: 88,
    reason: 'Perfect for your brainstorming session this afternoon',
    items: ['Oversized Shirt', 'High-waist Jeans', 'White Sneakers', 'Tote Bag']
  },
  {
    id: 5,
    name: 'Evening Transition',
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop',
    tags: ['Day-to-Night', 'Elegant', 'Adaptable'],
    matchScore: 90,
    reason: 'Seamlessly go from day meetings to dinner plans',
    items: ['Wrap Dress', 'Cardigan', 'Block Heels', 'Crossbody Bag']
  }
];

export function SuggestedOutfitsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        {suggestedOutfits.map((outfit) => (
          <div
            key={outfit.id}
            className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-200"
          >
            {/* Outfit Image */}
            <div className="relative aspect-[4/5]">
              <img
                src={outfit.image}
                alt={outfit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Match Score */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/95 text-gray-900 shadow-sm">
                  {outfit.matchScore}% match
                </Badge>
              </div>
              
              {/* Heart Icon */}
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* Outfit Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2 text-gray-900">{outfit.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {outfit.reason}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {outfit.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs py-1 px-2"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Items List */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {outfit.items.map((item, index) => (
                      <span key={index} className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  Wear Today
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 