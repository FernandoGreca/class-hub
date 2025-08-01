import CriarAtividade from '@/app/ui/dashboard/criar-atividade';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CriarAtividade />
    </Suspense>
  );
}
