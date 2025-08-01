import React, { Suspense } from 'react';
import RegistroPresenca from '@/app/ui/dashboard/presencas';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegistroPresenca />
    </Suspense>
  );
}
