import React, { Suspense } from 'react';
import DashboardDisicplinaProfessor from '@/app/ui/dashboard/dashboard-disciplina-professor';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardDisicplinaProfessor />
    </Suspense>
  );
}
