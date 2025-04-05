// app/upload/page.tsx
'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('Fichier uploadé avec succès !');
      } else {
        setMessage('Erreur lors de l\'upload du fichier.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de l\'upload du fichier.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-4">Upload Image</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center"
        encType="multipart/form-data"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0]);
          }}
          className="mb-4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
