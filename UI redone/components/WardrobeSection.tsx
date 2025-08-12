import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const categories = [
  'All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Jewellery', 'Outerwear', 'Active', 'Occasion'
];

const colorSwatches = [
  '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'
];

const wardrobeItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=400&fit=crop',
    brand: 'Reformation',
    type: 'Silk Blouse',
    size: 'M',
    color: 'Ivory',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop',
    brand: 'Everlane',
    type: 'Wide-leg Trousers',
    size: '6',
    color: 'Camel',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
    brand: 'COS',
    type: 'Midi Dress',
    size: 'S',
    color: 'Black',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=400&fit=crop',
    brand: 'Ganni',
    type: 'Ankle Boots',
    size: '7',
    color: 'Brown',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop',
    brand: 'Bottega Veneta',
    type: 'Mini Bag',
    size: 'One Size',
    color: 'Sage',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop',
    brand: 'The Row',
    type: 'Cashmere Sweater',
    size: 'M',
    color: 'Cream',
  },
];

export function WardrobeSection() {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="editorial-heading mb-6">Plan another outfit</h2>
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <Badge
              key={category}
              variant={index === 0 ? "default" : "outline"}
              className={`rounded-full px-4 py-2 ui-text cursor-pointer transition-colors ${
                index === 0 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background border-border hover:bg-secondary'
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your wardrobe..."
              className="pl-10 bg-input-background border-0 rounded-lg ui-text"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 ui-text">
            <Filter className="h-4 w-4" />
            Brand
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 ui-text">
            Size
          </Button>
          
          {/* Color Swatches */}
          <div className="flex items-center gap-2">
            {colorSwatches.map((color, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {wardrobeItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
          >
            {/* Item Image */}
            <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-secondary">
              <ImageWithFallback
                src={item.image}
                alt={`${item.brand} ${item.type}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="space-y-2">
                  <Button size="sm" className="w-full ui-text">Add to outfit</Button>
                  <Button size="sm" variant="outline" className="w-full ui-text bg-white">Details</Button>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-1">
              <p className="ui-text font-medium text-sm">{item.brand}</p>
              <p className="ui-text text-xs text-muted-foreground">{item.type}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="ui-text text-xs py-0 px-2">
                  {item.size}
                </Badge>
                <Badge variant="outline" className="ui-text text-xs py-0 px-2">
                  {item.color}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}