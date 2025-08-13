import { PackCreator } from '@/components/packs/PackCreator';

export default function EditPackPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full max-w-none">
      <PackCreator packId={params.id} />
    </div>
  );
} 