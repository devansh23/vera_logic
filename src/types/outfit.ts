export interface WardrobeItem {
  id: string;
<<<<<<< HEAD
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
=======
  name: string;
  image: string;
  imageUrl?: string;  // For backward compatibility
  category: string;
  brand?: string;
  description?: string;
>>>>>>> 854ca2c29487b4ed0fe109a5cd97e572d9b35c7c
}

export interface OutfitItem {
  id: string;
<<<<<<< HEAD
  outfitId: string;
  wardrobeItemId: string;
  left: number;
  top: number;
  zIndex: number;
  width: number;
  height: number;
  isPinned?: boolean;
=======
  name: string;
  items: WardrobeItem[];
  date?: Date;
>>>>>>> 854ca2c29487b4ed0fe109a5cd97e572d9b35c7c
}

export interface CalendarEvent {
  id: string;
  title: string;
<<<<<<< HEAD
  date: Date;
  outfitId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
=======
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
>>>>>>> 854ca2c29487b4ed0fe109a5cd97e572d9b35c7c
} 