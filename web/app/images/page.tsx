// app/images/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageData {
  id: string;
  name?: string;
  mime: string;
  data: string; // URL data en base64
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/images');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement');
        }
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des images');
      }
    }
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl mb-4">Galerie d&apos;Images</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        {images.map(image => (
          <div key={image.id} className="border p-2 rounded bg-white shadow">
            <Image
              src={image.data}
              alt={image.name || 'Image'}
              width={500}
              height={300}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
