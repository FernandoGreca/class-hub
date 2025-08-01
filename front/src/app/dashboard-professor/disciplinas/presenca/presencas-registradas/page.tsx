import React, { Suspense } from 'react';
import PresencasRegistradas from '@/app/ui/dashboard/presencas-registradas';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PresencasRegistradas />
    </Suspense>
  );
}
