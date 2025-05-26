"use client";

import AtividadesPendentes from "@/app/ui/dashboard/atividades-pendentes";
import { ClipboardDocumentIcon, ExclamationTriangleIcon, SunIcon } from "@heroicons/react/24/outline";

export default function DashboardAluno() {
  const atividades = [
    {
      disciplina: "aux-039",
      descricao: "Trabalho de Matemática",
      data_entrega: "2025-03-25",
      nota: 10,
      nota_aluno: null,
    },
    {
      disciplina: "aux-039",
      descricao: "Redação",
      data_entrega: "2025-03-30",
      nota: 10,
      nota_aluno: 8,
    },
    {
      disciplina: "aux-039",
      descricao: "Atividade de História",
      data_entrega: "2025-03-20",
      nota: 10,
      nota_aluno: null,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold">Bem vindo, Aluno</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Card de avisos */}
          <div className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Ver últimos avisos</h2>
            <ul className="mt-2">
              {/* Aviso Feira de Ciências */}
              <li className="flex items-start mt-3 space-x-3 p-3 rounded-lg shadow bg-yellow-100 hover:bg-yellow-200 cursor-pointer transition">
                {/* Ícone de aviso */}
                <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-800" />
                </div>

                {/* Informações do evento */}
                <div className="flex-1">
                  <p className="text-yellow-900 font-semibold">
                    Evento Escolar: Feira de Ciências
                  </p>
                  <p className="text-yellow-800 text-sm">
                    Local: Auditório Principal
                  </p>
                  <p className="text-yellow-700 text-xs">Data: 26/05/2025</p>
                  <p className="text-yellow-900 text-xs font-bold">
                    Participe e explore projetos incríveis dos alunos!
                  </p>
                </div>
              </li>

              {/* Aviso de Férias Escolares */}
              <li className="flex items-start mt-3 space-x-3 p-3 rounded-lg shadow bg-blue-100 hover:bg-blue-200 cursor-pointer transition">
                {/* Ícone de férias */}
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                  <SunIcon className="w-5 h-5 text-blue-800" />
                </div>

                {/* Informações das férias */}
                <div className="flex-1">
                  <p className="text-blue-900 font-semibold">
                    Aviso: Férias Escolares de Julho
                  </p>
                  <p className="text-blue-800 text-sm">
                    Período: 01 a 31 de Julho de 2025
                  </p>
                  <p className="text-blue-700 text-xs">
                    Aproveite o descanso, nos vemos em agosto!
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <AtividadesPendentes atividades={atividades} />
        </div>
      </div>
    </div>
  );
}
