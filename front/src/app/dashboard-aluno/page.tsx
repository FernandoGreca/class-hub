"use client";

import { ExclamationTriangleIcon, SunIcon, UserPlusIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';

// O componente principal do painel do aluno
export default function DashboardAluno() {
  const proximasAtividades = [
    { nome: "Semana Tecnológica", data: "22/09/2025 até 26/09/2025", local: "Campus Escolar" },
    { nome: "Reunião de Pais e Mestres", data: "20/09/2025", local: "Sala dos Professores" },
    { nome: "Entrega de Notas - 1º Bimestre", data: "05/10/2025", local: "Sistema online" },
    { nome: "Seminário de Educação", data: "25/10/2025", local: "Auditório Principal" },
  ];

  const avisos = [
    {
      titulo: "Novo Professor? Confirme sua conta",
      descricao: "Se você acabou de criar sua conta e é um professor, entre em contato conosco pelo e-mail para efetivar sua conta de docente.",
      detalhe: "Email: efetivaprofessor@classhub.com",
      obs: "Isso garantirá acesso completo às funcionalidades de professor.",
      icon: UserPlusIcon,
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
      iconBgColor: "bg-green-300",
      iconColor: "text-green-800",
      textColor: "text-green-900",
      descColor: "text-green-800",
      obsColor: "text-green-700",
    },
    {
      titulo: "Evento Escolar: Feira de Ciências",
      descricao: "Local: Auditório Principal",
      detalhe: "Data: 26/05/2025",
      obs: "Participe e explore projetos incríveis dos alunos!",
      icon: ExclamationTriangleIcon,
      bgColor: "bg-yellow-100",
      hoverBgColor: "hover:bg-yellow-200",
      iconBgColor: "bg-yellow-300",
      iconColor: "text-yellow-800",
      textColor: "text-yellow-900",
      descColor: "text-yellow-800",
      obsColor: "text-yellow-900",
    },
    {
      titulo: "Aviso: Férias Escolares de Julho",
      descricao: "Período: 01 a 31 de Julho de 2025",
      detalhe: "Aproveite o descanso, nos vemos em agosto!",
      icon: SunIcon,
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
      iconBgColor: "bg-blue-300",
      iconColor: "text-blue-800",
      textColor: "text-blue-900",
      descColor: "text-blue-800",
      obsColor: "text-blue-700",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Cabeçalho */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">Bem-vindo, Aluno</h1>
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
              {avisos.map((aviso, index) => (
                <li key={index} className={`flex items-start space-x-3 p-4 rounded-lg shadow cursor-pointer transition ${aviso.bgColor} ${aviso.hoverBgColor}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${aviso.iconBgColor}`}>
                    <aviso.icon className={`w-5 h-5 ${aviso.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${aviso.textColor}`}>{aviso.titulo}</p>
                    <p className={`text-sm ${aviso.descColor}`}>{aviso.descricao}</p>
                    {aviso.detalhe && <p className={`text-xs ${aviso.obsColor}`}>{aviso.detalhe}</p>}
                    {aviso.obs && <p className={`text-xs font-bold ${aviso.obsColor}`}>{aviso.obs}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Card de Próximas Atividades */}
          <div className="bg-gray-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-6 h-6 text-purple-500" /> Próximas Atividades
            </h2>
            <ul className="space-y-4">
              {proximasAtividades.map((atividade, index) => (
                <li key={index} className="bg-purple-50 p-4 rounded-lg shadow-sm hover:bg-purple-100 transition cursor-pointer">
                  <p className="font-medium text-purple-900">{atividade.nome}</p>
                  <p className="text-sm text-purple-800">Data: <span className="font-semibold">{atividade.data}</span></p>
                  <p className="text-xs text-purple-700">Local: {atividade.local}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}