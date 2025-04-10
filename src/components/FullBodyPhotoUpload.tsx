'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function FullBodyPhotoUpload() {
  const { data: session } = useSession();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch('/api/user/full-body-photo');
        if (response.ok) {
          const data = await response.json();
          if (data.fullBodyPhoto) {
            setPhoto(data.fullBodyPhoto);
            setIsCollapsed(false);
          }
        }
      } catch (err) {
        console.error('Failed to fetch photo', err);
      }
    };
    fetchPhoto();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!photo || !fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', fileInputRef.current.files[0]);

      const response = await fetch('/api/user/full-body-photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload photo');
      }

      toast.success('Photo saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Toaster />
      <h2 className="text-xl font-semibold mb-4">Upload Full Body Photo</h2>
      <p className="text-gray-600 mb-4">
        Upload a full body photo to help with virtual try-on. Make sure the photo is well-lit and shows your full body clearly.
      </p>

      <div className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Select Photo
        </button>

        {photo && (
          <div>
            <button onClick={toggleCollapse} className="mt-4 bg-gray-200 p-2 rounded">
              {isCollapsed ? 'Show Photo' : 'Hide Photo'}
            </button>
            {!isCollapsed && (
              <div className="mt-4">
                <img src={photo} alt="Uploaded Full Body" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

        {photo && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 