import { Home, Shirt, Palette, Calendar, Package, ShoppingBag, Plus } from 'lucide-react';
import { Button } from './ui/button';

const navigationItems = [
  { icon: Home, label: 'Home', page: 'home' },
  { icon: Shirt, label: 'Wardrobe', page: 'wardrobe' },
  { icon: Palette, label: 'Outfits', page: 'outfits' },
  { icon: Calendar, label: 'Calendar', page: 'calendar' },
  { icon: Package, label: 'Packs', page: 'packs' },
  { icon: ShoppingBag, label: 'Shopping', page: 'shopping' },
];

interface LeftNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function LeftNavigation({ currentPage, onPageChange }: LeftNavigationProps) {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border pt-20 px-6">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => onPageChange(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ui-text ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Add Items Button */}
        <div className="pb-6">
          <Button className="w-full flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6">
            <Plus className="h-5 w-5" />
            <span className="ui-text font-medium">Add Items</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}