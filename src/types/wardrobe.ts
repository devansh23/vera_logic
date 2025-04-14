// Base properties that any item must have (minimal required fields)
export interface BaseWardrobeItem {
  id: string;
  name: string;
}

// Complete wardrobe item (matches database schema)
export interface WardrobeItem extends BaseWardrobeItem {
  userId: string;
  brand: string;
  category?: string;
  imageUrl?: string;
  image?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  productLink?: string;
  myntraLink?: string;
  sourceRetailer?: string;
  source?: string;
  sourceEmailId?: string;
  sourceOrderId?: string;
  dateAdded?: Date;
  colorTag?: string;
  dominantColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Position data for items on canvas
export interface PositionedItem {
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned?: boolean;
}

// Combined type for items displayed on canvas
export interface CanvasItem extends WardrobeItem, PositionedItem {}

// Database relation type for saving outfit items
export interface OutfitItemRelation {
  id?: string;
  outfitId: string;
  wardrobeItemId: string;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned?: boolean;
}

// Complete outfit representation
export interface Outfit {
  id: string;
  name: string;
  userId: string;
  tryOnImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  items: OutfitItemRelation[];
} 