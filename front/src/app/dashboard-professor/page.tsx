"use client";

import AtividadesPendentes from "@/app/ui/dashboard/atividades-pendentes";

export default function DashboardProfessor() {
  const atividades = [
    { disciplina: "aux-039", descricao: "Trabalho de Matemática", data_entrega: "2025-03-25", nota: 10, nota_aluno: null },
    { disciplina: "aux-039", descricao: "Redação", data_entrega: "2025-03-30", nota: 10, nota_aluno: 8 },
    { disciplina: "aux-039", descricao: "Atividade de História", data_entrega: "2025-03-20", nota: 10, nota_aluno: null },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold">Bem vindo, Professor</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Card de avisos */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ver últimos avisos</h2>
            <p className="text-gray-500 mt-2">Nenhum aviso encontrado</p>
          </div>

          
          <AtividadesPendentes atividades={atividades}  />
        </div>
      </div>
    </div>
  );
}
