'use client';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CreateInvoiceResponse {
  message: string;
}

// Separate API functions
const loanAPI = {
  createInvoices: async (loanId: string) => {
    const response = await axios.get<CreateInvoiceResponse>(`${BACKEND_URL}/api/v1/loan/create-invoices/${loanId}`);
    return response.data;
  },
  getLoanDetails: async (loanId: string) => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/loan/${loanId}`);
    return response.data;
  }
};

function useLoanDetails(loanId: string) {
  return useQuery({
    queryKey: ['loan', loanId],
    queryFn: () => loanAPI.getLoanDetails(loanId),
    enabled: !!loanId,
  });
}

function LoanItem({
  loanId,
  onRemove,
  disabled
}: {
  loanId: string;
  onRemove: (id: string) => void;
  disabled: boolean;
}) {
  const { data: loanData, isLoading, isError } = useLoanDetails(loanId);

  const isValidLoanId = /^[A-Za-z0-9-]+$/.test(loanId);

  if (!isValidLoanId) {
    return (
      <li className="flex justify-between items-center text-red-500 border border-red-200 bg-red-50 py-2 px-4 shadow">
        <span>Invalid loan ID format: {loanId}</span>
        <button
          onClick={() => onRemove(loanId)}
          disabled={disabled}
          className="text-red-500 font-bold hover:underline"
        >
          X
        </button>
      </li>
    );
  }

  if (isError) {
    return (
      <li className="flex justify-between items-center text-red-500 border border-red-200 bg-red-50 py-2 px-4 shadow">
        <span>Error fetching loan: {loanId}</span>
        <button
          onClick={() => onRemove(loanId)}
          disabled={disabled}
          className="text-red-500 font-bold hover:underline"
        >
          X
        </button>
      </li>
    );
  }

  if (isLoading) {
    return (
      <li className="flex justify-between items-center text-gray-500 border border-gray-200 py-2 px-4 shadow animate-pulse">
        <span>Loading...</span>
        <span>Loading...</span>
        <button
          onClick={() => onRemove(loanId)}
          disabled={disabled}
          className="text-red-500 font-bold hover:underline opacity-50"
        >
          X
        </button>
      </li>
    );
  }

  if (!loanData?.[0]) {
    return (
      <li className="flex justify-between items-center text-red-500 border border-red-200 bg-red-50 py-2 px-4 shadow">
        <span>No loan data found for ID: {loanId}</span>
        <button
          onClick={() => onRemove(loanId)}
          disabled={disabled}
          className="text-red-500 font-bold hover:underline"
        >
          X
        </button>
      </li>
    );
  }

  return (
    <li className="flex justify-between font-semibold items-center text-gray-700 border border-gray-200 py-2 px-4 shadow">
      <span>
        {loanData[0].borrower_firstname} {loanData[0].borrower_lastname}
      </span>
      <span>Released on: {loanData[0].loan_released_date}</span>
      <button
        onClick={() => onRemove(loanId)}
        disabled={disabled}
        className="text-red-500 font-bold hover:underline"
      >
        X
      </button>
    </li>
  );
}

export default function Page() {
  const [loanIds, setLoanIds] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createInvoicesMutation = useMutation({
    mutationFn: async (loanIds: string[]) => {
      const results = await Promise.all(
        loanIds.map(loanId => loanAPI.createInvoices(loanId))
      );
      return results;
    },
    onSuccess: () => {
      setSuccessMessage('Successfully created invoices for all loans');
      setLoanIds([]);
    },
    onError: () => {
      setInputError('An error occurred while creating invoices');
    }
  });

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const newLoanIds = pastedData
      .split(/\s*[\n,;]\s*/)
      .filter(Boolean)
      .filter((id, index, self) => self.indexOf(id) === index);
    setLoanIds(newLoanIds);
    setInputError(null);
    setSuccessMessage(null);
  };

  const handleCreateInvoices = () => {
    setSuccessMessage(null);
    setInputError(null);

    if (loanIds.length === 0) {
      setInputError('Please provide at least one valid loan ID.');
      return;
    }

    createInvoicesMutation.mutate(loanIds);
  };

  const handleRemoveLoanId = (id: string) => {
    setLoanIds(prev => prev.filter(loanId => loanId !== id));
  };

  const handleClearAll = () => {
    setLoanIds([]);
    setInputError(null);
    setSuccessMessage(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg">
          <div className="flex gap-8">
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Paste Loan IDs
              </h2>

              <textarea
                placeholder={loanIds.length > 0 ? `${loanIds}` : 'Paste loan IDs here'}
                disabled={createInvoicesMutation.isPending || loanIds.length > 0}
                onPaste={handlePaste}
                className="border-2 border-gray-200 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-600 text-lg w-full mb-4"
                rows={6}
              />

              <button
                onClick={handleCreateInvoices}
                disabled={createInvoicesMutation.isPending}
                className={`
                bg-blue-900 text-white font-bold w-full rounded-md p-3 shadow-blue-600
                hover:bg-blue-800 transition-colors
                ${createInvoicesMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              >
                {createInvoicesMutation.isPending ? 'Processing invoices...' : 'Create Invoices'}
              </button>

              {loanIds.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="mt-4 bg-red-500 text-white font-bold w-full rounded-md p-3 shadow-red-600 hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              )}

              {successMessage && (
                <div className="text-green-700 mt-4 text-center">{successMessage}</div>
              )}
              {inputError && (
                <div className="text-red-700 mt-4 text-center">{inputError}</div>
              )}
            </div>

            <div className="w-1/2 border-l pl-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {loanIds.length > 0 ? 'Invoices to create' : ''}
              </h2>

              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                <ul className="text-left space-y-2">
                  {loanIds.map((loanId) => (
                    <LoanItem
                      key={loanId}
                      loanId={loanId}
                      onRemove={handleRemoveLoanId}
                      disabled={createInvoicesMutation.isPending}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

