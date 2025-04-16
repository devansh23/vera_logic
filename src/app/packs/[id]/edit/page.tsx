import { PackCreator } from '@/components/packs/PackCreator';

export default function EditPackPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Pack</h1>
      <PackCreator packId={params.id} />
    </div>
  );
} 