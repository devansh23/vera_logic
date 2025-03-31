export interface ExtractedWardrobeItem {
  brand?: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  productLink?: string;
  retailer: string;
  emailId: string;
  orderId?: string;
  normalizedImageUrl?: string;
  reference?: string;
}

export interface EmailMessage {
  id: string;
  body?: {
    html?: string;
  };
  subject?: string;
}

export interface MyntraOrderItem {
  productName: string;
  brand?: string;
  size?: string;
  color?: string;
  category?: string;
  quantity?: number;
  price?: number;
  imageUrl?: string;
} 