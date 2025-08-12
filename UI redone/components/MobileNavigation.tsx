import { Home, Shirt, Palette, Calendar, Package, ShoppingBag } from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Shirt, label: 'Wardrobe', active: false },
  { icon: Palette, label: 'Outfits', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: Package, label: 'Packs', active: false },
  { icon: ShoppingBag, label: 'Shopping', active: false },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 md:hidden z-50">
      <div className="flex items-center justify-between">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                item.active
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