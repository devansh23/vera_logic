"use client";
import { useState } from 'react';
import UploadWardrobeItems from '@/components/UploadWardrobeItems';

export default function AddItemsPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddUrl = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage('Item added from URL');
      setUrl('');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to add from URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <h1 className="text-2xl font-semibold">Add items</h1>

        <section className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-medium">Add via URL</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a Myntra / H&M / Zara product URL"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleAddUrl}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-60"
            >
              {isLoading ? 'Adding…' : 'Add'}
            </button>
          </div>
          {message && <div className="text-sm text-gray-600">{message}</div>}
        </section>

        <section className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-medium">Upload item</h2>
          <UploadWardrobeItems />
        </section>

        <section className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-medium">Import from Email</h2>
          <a
            href="/email-fetcher"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Import from Email
          </a>
        </section>
      </div>
    </main>
  );
} 