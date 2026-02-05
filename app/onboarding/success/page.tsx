import { Suspense } from 'react';
import { SuccessMessage } from './success-message';

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessMessage />
    </Suspense>
  );
}
