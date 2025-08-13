import { ChevronLeft, ChevronRight, Plus, MapPin, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const weekDays = [
  {
    day: 'MON',
    date: '12',
    weather: { temp: '22°C', icon: '☀️' },
    outfit: {
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=100&h=120&fit=crop',
      name: 'Morning Meeting'
    },
    events: ['Team Standup', 'Client Call']
  },
  {
    day: 'TUE',
    date: '13',
    weather: { temp: '24°C', icon: '🌤️' },
    outfit: null,
    events: ['Lunch with Sarah']
  },
  {
    day: 'WED',
    date: '14',
    weather: { temp: '19°C', icon: '🌧️' },
    outfit: {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=120&fit=crop',
      name: 'Rainy Day Comfort'
    },
    events: ['Workshop', 'Dinner Plans']
  },
  {
    day: 'THU',
    date: '15',
    weather: { temp: '21°C', icon: '⛅' },
    outfit: null,
    events: []
  },
  {
    day: 'FRI',
    date: '16',
    weather: { temp: '23°C', icon: '☀️' },
    outfit: {
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=100&h=120&fit=crop',
      name: 'Friday Night Out'
    },
    events: ['Date Night']
  },
  {
    day: 'SAT',
    date: '17',
    weather: { temp: '25°C', icon: '☀️' },
    outfit: null,
    events: ['Weekend Brunch']
  },
  {
    day: 'SUN',
    date: '18',
    weather: { temp: '22°C', icon: '🌤️' },
    outfit: null,
    events: []
  },
];

export function CalendarSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="editorial-heading">Calendar</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="ui-text font-medium">August 2024</span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Banner */}
      <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Plane className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h4 className="ui-text font-medium">Trip to Paris</h4>
              <p className="ui-text text-sm text-muted-foreground">Sept 2-8 • 6 days</p>
            </div>
          </div>
          <Button variant="outline" className="ui-text">
            Create Pack
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-4 border border-border hover:border-accent transition-colors"
          >
            {/* Day Header */}
            <div className="text-center mb-3">
              <div className="ui-text text-xs font-medium text-muted-foreground mb-1">
                {day.day}
              </div>
              <div className="ui-text text-lg font-medium">{day.date}</div>
            </div>

            {/* Weather */}
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-sm">{day.weather.icon}</span>
              <span className="ui-text text-xs text-muted-foreground">
                {day.weather.temp}
              </span>
            </div>

            {/* Outfit */}
            <div className="mb-3">
              {day.outfit ? (
                <div className="relative">
                  <ImageWithFallback
                    src={day.outfit.image}
                    alt={day.outfit.name}
                    className="w-full aspect-[3/4] object-cover rounded-md"
                  />
                  <div className="mt-1">
                    <p className="ui-text text-xs font-medium truncate">
                      {day.outfit.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] border-2 border-dashed border-border rounded-md flex items-center justify-center group cursor-pointer hover:border-accent transition-colors">
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                </div>
              )}
            </div>

            {/* Events */}
            <div className="space-y-1">
              {day.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="ui-text text-xs bg-secondary rounded px-2 py-1 truncate"
                >
                  {event}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}