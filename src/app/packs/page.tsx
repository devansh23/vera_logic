import { PacksList } from '@/components/packs/PacksList';

export default function PacksPage() {
  return (
    <div className="min-h-screen bg-[#fdfcfa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">
              Packing Lists
            </h1>
            <p className="text-[#8b8681] font-inter">
              Organize your travel and daily essentials
            </p>
          </div>
        </div>

        {/* Packs Content */}
        <div className="bg-white rounded-lg border border-[rgba(45,41,38,0.1)] p-6">
          <PacksList />
        </div>
      </div>
    </div>
  );
} 