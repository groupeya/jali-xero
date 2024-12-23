'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function XeroCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const errorMessage = urlParams.get('message');

      if (token) {
        try {
          localStorage.setItem('xero_token', token);

          router.push('/create-invoice');
        } catch (err) {
          setError('Failed to process authentication token');
          console.error(err);
        }
      } else if (errorMessage) {
        setError(errorMessage);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {error ? 'Authentication Failed' : 'Authenticating...'}
        </h1>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        {!error && (
          <p className="text-gray-600">
            Completing Xero authorization, please wait...
          </p>
        )}
      </div>
    </main>
  );
}
