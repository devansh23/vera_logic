import { PackCreator } from '@/components/packs/PackCreator';

export default function NewPackPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Pack</h1>
      <PackCreator />
    </div>
  );
} 