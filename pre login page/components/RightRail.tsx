import { Plus, Package, Layers, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const todaysSuggestions = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=200&h=240&fit=crop',
    name: 'Confident Professional',
    reason: 'Perfect for your 2 PM client meeting',
    weatherMatch: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=240&fit=crop',
    name: 'Comfortable Casual',
    reason: 'Matches your "feeling comfy" mood',
    weatherMatch: true,
  },
];

const insights = [
  {
    icon: Clock,
    title: '12 items',
    subtitle: 'Unworn this month',
    color: 'text-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Blazers',
    subtitle: 'Your most-worn category',
    color: 'text-green-500',
  },
  {
    icon: Sparkles,
    title: 'Mix & match',
    subtitle: 'Try your silk scarf with denim',
    color: 'text-purple-500',
  },
];

export function RightRail() {
  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border pt-20 px-6 overflow-y-auto">
      <div className="space-y-8">
        {/* Today's Suggestions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="ui-text text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Today's Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                  <ImageWithFallback
                    src={suggestion.image}
                    alt={suggestion.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {suggestion.weatherMatch && (
                    <Badge className="absolute top-2 left-2 bg-white/90 text-foreground">
                      ☀️ Perfect weather
                    </Badge>
                  )}
                </div>
                <div>
                  <h4 className="ui-text font-medium text-sm mb-1">{suggestion.name}</h4>
                  <p className="ui-text text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Shortcuts */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="ui-text text-lg">Quick Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 ui-text">
              <Plus className="h-4 w-4" />
              Add items
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 ui-text">
              <Package className="h-4 w-4" />
              Make a pack
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 ui-text">
              <Layers className="h-4 w-4" />
              Create capsule
            </Button>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="ui-text text-lg">Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${insight.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="ui-text font-medium text-sm">{insight.title}</p>
                    <p className="ui-text text-xs text-muted-foreground">{insight.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}