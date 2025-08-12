"use client"

import React from 'react';
import { Sun, Cloud, CloudRain, Moon, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

const greetings = [
  {
    message: "Hello Devansh, it looks like we're headed for a rainy evening today.",
    weather: "rainy",
    timeOfDay: "evening",
    icon: CloudRain,
    suggestion: "Perfect weather for that cozy cashmere sweater!"
  },
  {
    message: "Good morning Devansh! The sun is shining bright at 22°C.",
    weather: "sunny",
    timeOfDay: "morning",
    icon: Sun,
    suggestion: "Time to show off those light layers and your favorite accessories."
  },
  {
    message: "Hey there Devansh, it's looking quite cloudy this afternoon.",
    weather: "cloudy",
    timeOfDay: "afternoon", 
    icon: Cloud,
    suggestion: "A great day to experiment with that statement blazer."
  }
];

export function GreetingSection() {
  const { data: session } = useSession();
  const currentGreeting = greetings[0]; // You can make this dynamic based on actual weather/time
  const IconComponent = currentGreeting.icon;
  
  const firstName = session?.user?.name?.split(' ')[0] || 'Devansh';
  
  return (
    <section className="mb-8 overflow-hidden">
      <div className="bg-gradient-to-br from-[#e8c5a0]/10 to-[#e8c5a0]/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          {/* Weather Icon */}
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <IconComponent className="h-6 w-6 text-[#2d2926]" />
          </div>
          
          {/* Greeting Content */}
          <div className="flex-1">
            <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl mb-3 text-[#2d2926] font-normal">
              {currentGreeting.message}
            </h1>
            <p className="font-inter text-base md:text-lg text-[#8b8681]">
              {currentGreeting.suggestion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 