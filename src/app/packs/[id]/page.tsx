import { PackDetail } from '@/components/packs/PackDetail';

export default function PackDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <PackDetail packId={params.id} />
    </div>
  );
} 