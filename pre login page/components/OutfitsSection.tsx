import { Calendar, Sun, Briefcase, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

const outfits = [
  {
    id: 1,
    name: 'Morning Meeting',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=400&fit=crop',
    tags: ['Work', 'Confident', '18-22°C'],
    weatherFit: true,
    moodMatch: true,
  },
  {
    id: 2,
    name: 'Weekend Brunch',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    tags: ['Casual', 'Comfortable', 'Sunny'],
    weatherFit: true,
    moodMatch: false,
  },
  {
    id: 3,
    name: 'Date Night',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=400&fit=crop',
    tags: ['Evening', 'Elegant', 'Special'],
    weatherFit: false,
    moodMatch: true,
  },
  {
    id: 4,
    name: 'Travel Day',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    tags: ['Comfort', 'Layered', 'Practical'],
    weatherFit: true,
    moodMatch: true,
  },
];

export function OutfitsSection() {
  return (
    <section className="mb-12">
      <h2 className="editorial-heading mb-6">Outfits</h2>
      
      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="saved" className="ui-text">Saved</TabsTrigger>
          <TabsTrigger value="suggested" className="ui-text">Suggested</TabsTrigger>
          <TabsTrigger value="work" className="ui-text">Work</TabsTrigger>
          <TabsTrigger value="travel" className="ui-text">Travel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Outfit Image */}
                <div className="relative aspect-[3/4]">
                  <ImageWithFallback
                    src={outfit.image}
                    alt={outfit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Weather/Mood Indicators */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {outfit.weatherFit && (
                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                        <Sun className="h-3 w-3 text-amber-500" />
                      </div>
                    )}
                    {outfit.moodMatch && (
                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                        <span className="text-xs">😊</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Outfit Details */}
                <div className="p-4">
                  <h4 className="ui-text font-medium mb-2">{outfit.name}</h4>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {outfit.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="ui-text text-xs py-0 px-2"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 ui-text">
                      Wear today
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 ui-text">
                      <Calendar className="h-3 w-3" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="suggested">
          <div className="text-center py-12 text-muted-foreground ui-text">
            AI-curated outfit suggestions based on your style and schedule coming soon.
          </div>
        </TabsContent>
        
        <TabsContent value="work">
          <div className="text-center py-12 text-muted-foreground ui-text">
            Professional outfits for your work calendar.
          </div>
        </TabsContent>
        
        <TabsContent value="travel">
          <div className="text-center py-12 text-muted-foreground ui-text">
            Travel-ready outfits and packing suggestions.
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}