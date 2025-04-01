export interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  imageUrl?: string;  // For backward compatibility
  category: string;
  brand?: string;
  description?: string;
}

export interface OutfitItem {
  id: string;
  name: string;
  items: WardrobeItem[];
  date?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  outfitId: string;
  outfit: {
    id: string;
    name: string;
    items: WardrobeItem[];
  };
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    id: string;
    left: number;
    top: number;
  }[];
  createdAt: string;
  updatedAt: string;
} 