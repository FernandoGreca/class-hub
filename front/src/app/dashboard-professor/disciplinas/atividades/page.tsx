'use client';
import { Suspense } from "react";
import Atividades from "@/app/ui/dashboard/atividades";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Atividades />
    </Suspense>
  );
}