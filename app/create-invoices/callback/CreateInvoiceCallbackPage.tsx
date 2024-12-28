import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CreateInvoiceCallbackPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  if (searchParams.token) {
    const decodedToken = decodeURIComponent(searchParams.token);
    redirect(`/create-invoice?token=${decodedToken}`);
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700">No authentication token found</p>
        <Link
          href="/auth"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </Link>
      </div>
    </main>
  );
}
