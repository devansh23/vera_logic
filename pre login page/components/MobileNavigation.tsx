import { Home, Shirt, Palette, Calendar, Package, ShoppingBag } from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', page: 'home' },
  { icon: Shirt, label: 'Wardrobe', page: 'wardrobe' },
  { icon: Palette, label: 'Outfits', page: 'outfits' },
  { icon: Calendar, label: 'Calendar', page: 'calendar' },
  { icon: Package, label: 'Packs', page: 'packs' },
  { icon: ShoppingBag, label: 'Shopping', page: 'shopping' },
];

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function MobileNavigation({ currentPage, onPageChange }: MobileNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 md:hidden z-50">
      <div className="flex items-center justify-between">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => onPageChange(item.page)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="ui-text text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}