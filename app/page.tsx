'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleXeroAuth = () => {
    try {
      setIsLoading(true);
      setError(null);

      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/xero/auth`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Creating invoices</h1>
        <button
          onClick={handleXeroAuth}
          disabled={isLoading}
          className="bg-blue-900 text-white font-bold w-full rounded-md p-3 shadow-blue-600 hover:dark:bg-blue-900 disabled:opacity-50"
        >
          {isLoading ? 'Connecting to Xero...' : 'Authorize with your Xero account'}
        </button>
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>
    </main>
  );
}
