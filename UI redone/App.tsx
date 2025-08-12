import { Header } from './components/Header';
import { LeftNavigation } from './components/LeftNavigation';
import { RightRail } from './components/RightRail';
import { MobileNavigation } from './components/MobileNavigation';
import { GreetingSection } from './components/GreetingSection';
import { SuggestedOutfitsCarousel } from './components/SuggestedOutfitsCarousel';
import { WardrobeSection } from './components/WardrobeSection';
import { OutfitsSection } from './components/OutfitsSection';
import { CalendarSection } from './components/CalendarSection';
import { Badge } from './components/ui/badge';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Left Navigation */}
        <LeftNavigation />

        {/* Main Content */}
        <main className="ml-64 mr-80 px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <GreetingSection />
            <SuggestedOutfitsCarousel />
            <WardrobeSection />
            <OutfitsSection />
            <CalendarSection />
          </div>
        </main>

        {/* Right Rail */}
        <RightRail />
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        {/* Left Navigation */}
        <LeftNavigation />

        {/* Main Content */}
        <main className="ml-64 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <GreetingSection />
            <SuggestedOutfitsCarousel />
            <WardrobeSection />
            <OutfitsSection />
            <CalendarSection />
            
            {/* Right Rail Content moved below main content */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Suggestions */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="ui-text text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="text-accent">✨</span>
                  Quick Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-20 bg-secondary rounded overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=64&h=80&fit=crop" 
                        alt="Most Worn Item" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="ui-text font-medium text-sm">Your Go-To Blazer</p>
                      <p className="ui-text text-xs text-muted-foreground">Worn 12 times this month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Shortcuts */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="ui-text text-lg font-medium mb-4">Quick Shortcuts</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded hover:bg-secondary ui-text text-sm">+ Add items</button>
                  <button className="w-full text-left p-2 rounded hover:bg-secondary ui-text text-sm">📦 Make a pack</button>
                  <button className="w-full text-left p-2 rounded hover:bg-secondary ui-text text-sm">🏷️ Create capsule</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <main className="px-4 py-6 pb-20">
          <GreetingSection />
          <SuggestedOutfitsCarousel />
          <WardrobeSection />
          <OutfitsSection />
          <CalendarSection />
          
          {/* Right Rail Content adapted for mobile */}
          <div className="space-y-6">
            {/* Quick Insights */}
            <section>
              <h3 className="editorial-heading text-xl mb-4">Quick Insights</h3>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-secondary rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=64&h=80&fit=crop" 
                      alt="Most Worn Item" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="ui-text font-medium text-sm">Your Go-To Blazer</p>
                    <p className="ui-text text-xs text-muted-foreground mb-2">Worn 12 times this month</p>
                    <Badge variant="outline" className="ui-text text-xs">
                      Most Popular
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h3 className="editorial-heading text-xl mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-card border border-border rounded-lg p-4 text-center hover:bg-secondary transition-colors">
                  <div className="text-2xl mb-2">+</div>
                  <p className="ui-text text-xs">Add Items</p>
                </button>
                <button className="bg-card border border-border rounded-lg p-4 text-center hover:bg-secondary transition-colors">
                  <div className="text-2xl mb-2">📦</div>
                  <p className="ui-text text-xs">Make Pack</p>
                </button>
                <button className="bg-card border border-border rounded-lg p-4 text-center hover:bg-secondary transition-colors">
                  <div className="text-2xl mb-2">🏷️</div>
                  <p className="ui-text text-xs">Capsule</p>
                </button>
              </div>
            </section>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}