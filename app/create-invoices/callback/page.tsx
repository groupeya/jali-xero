import React, { Suspense } from 'react';
import CreateInvoiceCallbackPage from './CreateInvoiceCallbackPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateInvoiceCallbackPage />
    </Suspense>
  );
}
