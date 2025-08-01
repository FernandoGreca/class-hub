import React, { Suspense } from 'react';
import HistoricoFaltaAluno from '@/app/ui/dashboard/historico-falta-aluno'; // ou o nome do seu arquivo

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HistoricoFaltaAluno />
    </Suspense>
  );
}
