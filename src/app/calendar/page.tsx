"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  outfitId: string;
  outfit: {
    id: string;
    name: string;
    tryOnImage?: string | null;
    items: {
      wardrobeItem: {
        image: string;
        name: string;
      };
    }[];
  };
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<any[]>([]);
  const [loadingSavedOutfits, setLoadingSavedOutfits] = useState(false);

  // Fetch calendar events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);
        
        const response = await fetch(
          `/api/calendar-events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
        toast.error('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [session, currentMonth]);

  // Function to navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Function to navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Function to handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowScheduleModal(true);
    fetchSavedOutfits();
  };

  // Function to fetch all saved outfits
  const fetchSavedOutfits = async () => {
    if (!session?.user) return;
    
    try {
      setLoadingSavedOutfits(true);
      const response = await fetch('/api/outfits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch outfits');
      }
      
      const data = await response.json();
      setSavedOutfits(data);
    } catch (err) {
      toast.error('Failed to load saved outfits');
    } finally {
      setLoadingSavedOutfits(false);
    }
  };

  // Function to handle outfit click in the calendar
  const handleOutfitClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Function to schedule an outfit
  const scheduleOutfit = async (outfitId: string, outfitName: string) => {
    if (!session?.user || !selectedDate) return;
    
    try {
      const response = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: outfitName,
          date: selectedDate.toISOString(),
          outfitId: outfitId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule outfit');
      }
      
      const newEvent = await response.json();
      
      // Update events list with the new event
      setEvents([...events, newEvent]);
      
      toast.success('Outfit scheduled successfully');
      setShowScheduleModal(false);
    } catch (err) {
      toast.error('Failed to schedule outfit');
    }
  };

  // Function to remove an outfit from the calendar
  const removeOutfitFromCalendar = async () => {
    if (!selectedEvent) return;
    
    try {
      const response = await fetch(`/api/calendar-events?id=${selectedEvent.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove outfit from calendar');
      }
      
      // Remove the event from the events list
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      
      toast.success('Outfit removed from calendar');
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error('Failed to remove outfit from calendar');
    }
  };

  // Function to handle editing an outfit
  const handleEditOutfit = (outfitId: string) => {
    console.log('Navigating to outfit:', outfitId);
    
    // Create the target URL with the edit parameter
    const targetUrl = `/outfit-planner?edit=${outfitId}`;
    console.log('Navigation target URL:', targetUrl);
    
    // Close the event modal
    setShowEventModal(false);
    setSelectedEvent(null);
    
    // Force a full page navigation instead of client-side routing
    // This helps ensure the OutfitPlanner component is fully remounted
    if (typeof window !== 'undefined') {
      console.log('Using window.location for navigation');
      window.location.href = targetUrl;
    } else {
      // Fall back to Next.js router if window is not available
      router.push(targetUrl);
    }
  };

  // Generate calendar days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayOfWeek = getDay(monthStart);

  // Day names for the week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">Loading calendar...</div>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center py-8">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">
              Outfit Calendar
            </h1>
            <p className="text-[#8b8681] font-inter">
              Plan and track your daily outfits
            </p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevMonth}
            className="border-[rgba(45,41,38,0.1)] p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-playfair font-normal text-[#2d2926]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="border-[rgba(45,41,38,0.1)] p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2">
                  <span className="text-sm font-medium text-[#8b8681] font-inter">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24 border border-[rgba(45,41,38,0.1)] rounded-md bg-gray-50"></div>
              ))}

              {/* Days of the month */}
              {monthDays.map((day) => {
                // Find events for this day
                const dayEvents = events.filter(
                  (event) => new Date(event.date).toDateString() === day.toDateString()
                );
                
                return (
                  <div
                    key={day.toString()}
                    className="h-24 border border-[rgba(45,41,38,0.1)] rounded-md p-1 overflow-hidden relative hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-sm font-medium mb-1 text-[#2d2926]">
                      {format(day, 'd')}
                    </div>
                    {dayEvents.map((event) => {
                      // Determine thumbnail image (try-on image or first item image)
                      const thumbnailImage = event.outfit.tryOnImage || 
                        (event.outfit.items[0]?.wardrobeItem.image || '/placeholder-clothing.svg');
                      
                      return (
                        <div
                          key={event.id}
                          className="bg-[#f5f4f2] border border-[#e8c5a0] rounded p-1 flex items-center mb-1 text-xs truncate hover:bg-[#e8c5a0]/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOutfitClick(event);
                          }}
                        >
                          <div 
                            className="w-6 h-6 bg-contain bg-center bg-no-repeat mr-1 flex-shrink-0 rounded" 
                            style={{ backgroundImage: `url(${thumbnailImage})` }}
                          />
                          <span className="truncate text-[#2d2926]">{event.title}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

        {/* Upcoming Events */}
        {events.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-playfair font-normal text-[#2d2926] mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => {
                    const thumbnailImage = event.outfit.tryOnImage || 
                      (event.outfit.items[0]?.wardrobeItem.image || '/placeholder-clothing.svg');
                    
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-[#f8f7f5] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 bg-contain bg-center bg-no-repeat rounded border border-[rgba(45,41,38,0.1)]"
                            style={{ backgroundImage: `url(${thumbnailImage})` }}
                          />
                          <div>
                            <div className="font-medium text-[#2d2926] font-inter">
                              {event.title}
                            </div>
                            <div className="text-sm text-[#8b8681] font-inter">
                              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[rgba(45,41,38,0.1)]"
                          onClick={() => handleEditOutfit(event.outfit.id)}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
              </div>
          </div>
        )}
      </div>

      {/* Schedule Outfit Modal */}
      {showScheduleModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Schedule Outfit for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {loadingSavedOutfits ? (
              <div className="text-center py-4">Loading saved outfits...</div>
            ) : savedOutfits.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No saved outfits found. Create an outfit first to schedule it.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedOutfits.map((outfit) => {
                  const thumbnailImage = outfit.tryOnImage || 
                    (outfit.items[0]?.wardrobeItem.image || '/placeholder-clothing.svg');
                  
                  return (
                    <div
                      key={outfit.id}
                      className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => scheduleOutfit(outfit.id, outfit.name)}
                    >
                      <div
                        className="w-full h-24 bg-contain bg-center bg-no-repeat mb-2"
                        style={{ backgroundImage: `url(${thumbnailImage})` }}
                      />
                      <p className="text-sm font-medium truncate">{outfit.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View/Edit Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <Calendar className="inline-block mr-2" size={16} />
                {format(new Date(selectedEvent.date), 'MMMM d, yyyy')}
              </p>
              
              <div className="mt-4">
                <div
                  className="w-full h-48 bg-contain bg-center bg-no-repeat mb-3 border rounded cursor-pointer hover:shadow-md transition-shadow relative group"
                  style={{ 
                    backgroundImage: `url(${selectedEvent.outfit.tryOnImage || 
                      (selectedEvent.outfit.items[0]?.wardrobeItem.image || '/placeholder-clothing.svg')})` 
                  }}
                  onClick={() => handleEditOutfit(selectedEvent.outfit.id)}
                >
                  {/* Edit overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white rounded-full p-2">
                      <Edit size={20} className="text-blue-500" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-500 italic">Click the outfit image to edit</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => handleEditOutfit(selectedEvent.outfit.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Edit Outfit
              </Button>
              <Button
                onClick={removeOutfitFromCalendar}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Remove from Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 