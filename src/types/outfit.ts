import { WardrobeItem, OutfitItemRelation } from './wardrobe';

export interface Outfit {
  id: string;
  name: string;
  items: OutfitItemRelation[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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