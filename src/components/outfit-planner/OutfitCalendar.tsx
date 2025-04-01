import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  outfitId: string;
  outfit: {
    id: string;
    name: string;
    items: {
      id: string;
      left: number;
      top: number;
    }[];
  };
}

interface OutfitCalendarProps {
  events: CalendarEvent[];
}

export const OutfitCalendar = ({ events }: OutfitCalendarProps) => {
  // Group events by date
  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const dateStr = new Date(event.date).toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        className="rounded-md border"
        modifiers={{
          hasEvents: Object.keys(eventsByDate).map(date => new Date(date)),
        }}
        modifiersStyles={{
          hasEvents: { 
            backgroundColor: "#E5DEFF",
            color: "#6E56CF",
            fontWeight: "bold"
          }
        }}
        components={{
          DayContent: ({ date }) => {
            const dateStr = date.toDateString();
            const dayEvents = eventsByDate[dateStr] || [];
            
            return (
              <div className="relative flex items-center justify-center w-full h-full">
                {date.getDate()}
                
                {dayEvents.length > 0 && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="absolute bottom-0 right-0">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 p-2">
                      <p className="text-sm font-medium mb-2">Scheduled Outfits:</p>
                      <div className="space-y-2">
                        {dayEvents.map(event => (
                          <div key={event.id} className="text-xs p-1 rounded bg-gray-50">
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default OutfitCalendar;
