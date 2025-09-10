"use client";

import { ExclamationTriangleIcon, SunIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

export default function DashboardProfessor() {
  const atividades = [
    { nome: "Semana Tecnológica", data: "22/09/2025 até 26/09/2025", local: "Campus Escolar" },
    { nome: "Reunião de Pais e Mestres", data: "20/09/2025", local: "Sala dos Professores" },
    { nome: "Entrega de Notas - 1º Bimestre", data: "05/10/2025", local: "Sistema online" },
    { nome: "Seminário de Educação", data: "25/10/2025", local: "Auditório Principal" },
  ];


  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Cabeçalho */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">Bem-vindo, Professor</h1>
          <p className="mt-2 text-lg">Aqui está um resumo das suas atividades e informações importantes.</p>
        </div>

        {/* Cards responsivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">

          {/* Card de Avisos */}
          <div className="bg-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" /> Avisos Recentes
            </h2>
            <ul className="mt-2 space-y-4">
              {/* Aviso Feira de Ciências */}
              <li className="flex items-start space-x-3 p-4 rounded-lg shadow bg-yellow-100 hover:bg-yellow-200 cursor-pointer transition">
                <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-800" />
                </div>
                <div className="flex-1">
                  <p className="text-yellow-900 font-semibold">Evento Escolar: Feira de Ciências</p>
                  <p className="text-yellow-800 text-sm">Local: Auditório Principal</p>
                  <p className="text-yellow-700 text-xs">Data: 26/05/2025</p>
                </div>
              </li>

              {/* Aviso de Férias Escolares */}
              <li className="flex items-start space-x-3 p-4 rounded-lg shadow bg-blue-100 hover:bg-blue-200 cursor-pointer transition">
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                  <SunIcon className="w-5 h-5 text-blue-800" />
                </div>
                <div className="flex-1">
                  <p className="text-blue-900 font-semibold">Aviso: Férias Escolares de Julho</p>
                  <p className="text-blue-800 text-sm">Período: 01 a 31 de Julho de 2025</p>
                </div>
              </li>
            </ul>
          </div>


          {/* Card de Calendário de Atividades */}
          <div className="bg-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-6 h-6 text-green-500" /> Próximas Atividades
            </h2>
            <ul className="space-y-4">
              {atividades.map((atividade, index) => (
                <li key={index} className="bg-green-50 p-4 rounded-lg shadow-sm hover:bg-green-100 transition cursor-pointer">
                  <p className="font-medium text-green-900">{atividade.nome}</p>
                  <p className="text-sm text-green-800">Data: <span className="font-semibold">{atividade.data}</span></p>
                  <p className="text-xs text-green-700">Local: {atividade.local}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
