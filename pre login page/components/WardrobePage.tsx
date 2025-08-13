import { Search, Filter, Grid3X3, List, Plus, Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

const categories = [
  { id: 'all', label: 'All Items', count: 127 },
  { id: 'tops', label: 'Tops', count: 45 },
  { id: 'bottoms', label: 'Bottoms', count: 32 },
  { id: 'dresses', label: 'Dresses', count: 18 },
  { id: 'outerwear', label: 'Outerwear', count: 15 },
  { id: 'shoes', label: 'Shoes', count: 12 },
  { id: 'accessories', label: 'Accessories', count: 5 },
];

const mockItems = [
  {
    id: 1,
    name: 'Classic White Button-Down',
    category: 'tops',
    brand: 'COS',
    color: 'White',
    size: 'M',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=400&fit=crop',
    worn: 12,
    lastWorn: '2 days ago',
    favorite: true,
    tags: ['work', 'versatile', 'classic']
  },
  {
    id: 2,
    name: 'High-Waisted Trousers',
    category: 'bottoms',
    brand: '& Other Stories',
    color: 'Navy',
    size: '8',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop',
    worn: 8,
    lastWorn: '1 week ago',
    favorite: false,
    tags: ['work', 'formal']
  },
  {
    id: 3,
    name: 'Silk Midi Dress',
    category: 'dresses',
    brand: 'Arket',
    color: 'Sage Green',
    size: 'S',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    worn: 5,
    lastWorn: '3 weeks ago',
    favorite: true,
    tags: ['special occasion', 'elegant']
  },
  {
    id: 4,
    name: 'Oversized Blazer',
    category: 'outerwear',
    brand: 'Zara',
    color: 'Beige',
    size: 'M',
    image: 'https://images.unsplash.com/photo-1542272454315-7ad9f597b5d4?w=300&h=400&fit=crop',
    worn: 15,
    lastWorn: 'Yesterday',
    favorite: true,
    tags: ['work', 'layering', 'versatile']
  },
  {
    id: 5,
    name: 'Cashmere Sweater',
    category: 'tops',
    brand: 'Everlane',
    color: 'Cream',
    size: 'S',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=400&fit=crop',
    worn: 9,
    lastWorn: '4 days ago',
    favorite: false,
    tags: ['cozy', 'winter', 'neutral']
  },
  {
    id: 6,
    name: 'Black Ankle Boots',
    category: 'shoes',
    brand: 'Acne Studios',
    color: 'Black',
    size: '37',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop',
    worn: 20,
    lastWorn: 'Today',
    favorite: true,
    tags: ['work', 'versatile', 'staple']
  },
  {
    id: 7,
    name: 'Pleated Midi Skirt',
    category: 'bottoms',
    brand: 'COS',
    color: 'Camel',
    size: '8',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d46?w=300&h=400&fit=crop',
    worn: 6,
    lastWorn: '1 week ago',
    favorite: false,
    tags: ['feminine', 'work', 'neutral']
  },
  {
    id: 8,
    name: 'Wool Coat',
    category: 'outerwear',
    brand: 'Toteme',
    color: 'Camel',
    size: 'M',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    worn: 7,
    lastWorn: '2 weeks ago',
    favorite: true,
    tags: ['winter', 'elegant', 'investment']
  }
];

export function WardrobePage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="editorial-heading mb-2">My Wardrobe</h1>
          <p className="ui-text text-muted-foreground">
            Manage and organize your clothing collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="ui-text">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="ui-text">
            <Plus className="h-4 w-4 mr-2" />
            Add Items
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your wardrobe..."
            className="pl-10 bg-input-background border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="recent">
            <SelectTrigger className="w-32 ui-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="worn">Most Worn</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant="ghost" size="sm" className="px-3 bg-secondary">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="px-3">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-secondary/50">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="ui-text text-xs lg:text-sm"
            >
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Items Grid */}
        <div className="mt-8">
          <TabsContent value="all" className="mt-0">
            <ItemsGrid items={mockItems} />
          </TabsContent>
          
          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <ItemsGrid 
                items={mockItems.filter(item => item.category === category.id)} 
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function ItemsGrid({ items }: { items: typeof mockItems }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {items.map((item) => (
        <Card key={item.id} className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[3/4] overflow-hidden">
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Heart className={`h-4 w-4 ${item.favorite ? 'fill-current text-destructive' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Usage Stats */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Badge variant="secondary" className="ui-text text-xs">
                  Worn {item.worn}x
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Item Details */}
          <div className="p-3">
            <h4 className="ui-text font-medium text-sm leading-tight mb-1 line-clamp-2">
              {item.name}
            </h4>
            <p className="ui-text text-xs text-muted-foreground mb-2">
              {item.brand} • {item.color} • {item.size}
            </p>
            <p className="ui-text text-xs text-muted-foreground mb-2">
              Last worn: {item.lastWorn}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="ui-text text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <Badge variant="outline" className="ui-text text-xs px-1 py-0">
                  +{item.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}