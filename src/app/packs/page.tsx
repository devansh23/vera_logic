import { PacksList } from '@/components/packs/PacksList';

export default function PacksPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Packing Lists</h1>
      <PacksList />
    </div>
  );
} 