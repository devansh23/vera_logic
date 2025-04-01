export interface WardrobeItem {
  id: string;
  userId?: string;
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  imageUrl?: string;
  productLink?: string;
  myntraLink?: string;
  size?: string;
  color?: string;
  category?: string;
  dateAdded?: Date;
  source?: string;
  sourceEmailId?: string;
  sourceOrderId?: string;
  sourceRetailer?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutfitItem {
  id: string;
  outfitId: string;
  wardrobeItemId: string;
  left: number;
  top: number;
  zIndex: number;
  width: number;
  height: number;
  isPinned?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  outfitId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 