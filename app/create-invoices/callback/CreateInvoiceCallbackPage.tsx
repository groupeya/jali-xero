'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateInvoiceCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = () => {
      try {
        if (!searchParams) {
          setError('Search parameters not available');
          return;
        }

        const encodedToken = searchParams.get('token');

        if (encodedToken) {
          const decodedToken = decodeURIComponent(encodedToken);

          const frontendUrl = `${window.location.origin}`;

          router.push(`${frontendUrl}/create-invoice?token=${decodedToken}`);
        } else {
          setError('No authentication token found');
        }
      } catch (err) {
        console.error('Token processing error:', err);
        setError('Failed to process authentication token');
      }
    };


    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we complete your authentication</p>
      </div>
    </main>
  );
}
