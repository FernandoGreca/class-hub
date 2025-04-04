'use client';
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function RelatorioAlunos() {
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [busca, setBusca] = useState("");

  const disciplinas = [
    { id: "MAT101", nome: "Matemática" },
    { id: "PORT102", nome: "Português" },
  ];

  const todosAlunos = [
    { id: "101", nome: "João Silva", disciplinaId: "MAT101" },
    { id: "102", nome: "Maria Souza", disciplinaId: "MAT101" },
    { id: "103", nome: "Carlos Santos", disciplinaId: "PORT102" },
    { id: "104", nome: "Ana Oliveira", disciplinaId: "MAT101" },
    { id: "105", nome: "Pedro Lima", disciplinaId: "PORT102" },
    { id: "106", nome: "Bruna Costa", disciplinaId: "MAT101" },
  ];

  const todasNotas = [
    { id_aluno: "101", disciplinaId: "MAT101", nota: 10 },
    { id_aluno: "101", disciplinaId: "MAT101", nota: 80 },
    { id_aluno: "102", disciplinaId: "MAT101", nota: 90 },
    { id_aluno: "102", disciplinaId: "MAT101", nota: 100 },
    { id_aluno: "103", disciplinaId: "PORT102", nota: 75 },
    { id_aluno: "104", disciplinaId: "MAT101", nota: 60 },
    { id_aluno: "104", disciplinaId: "MAT101", nota: 50 },
    { id_aluno: "105", disciplinaId: "PORT102", nota: 40 },
    { id_aluno: "106", disciplinaId: "MAT101", nota: 100 },
  ];

  const presencas = [
    { id_aluno: "101", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "101", disciplinaId: "MAT101", presenca: false },
    { id_aluno: "101", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "101", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: false },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: false },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: true },
    { id_aluno: "104", disciplinaId: "MAT101", presenca: false },
    { id_aluno: "104", disciplinaId: "MAT101", presenca: false },
    { id_aluno: "105", disciplinaId: "PORT102", presenca: true },
    { id_aluno: "105", disciplinaId: "PORT102", presenca: false },
    { id_aluno: "106", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "106", disciplinaId: "MAT101", presenca: true },
  ];

  const alunosFiltrados = todosAlunos.filter(
    (aluno) =>
      aluno.disciplinaId === disciplinaSelecionada &&
      aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const calcularMedia = (id_aluno: string) => {
    const notasAluno = todasNotas.filter(
      (nota) =>
        nota.id_aluno === id_aluno && nota.disciplinaId === disciplinaSelecionada
    );
    if (notasAluno.length === 0) return null;
    const media =
      notasAluno.reduce((acc, cur) => acc + cur.nota, 0) / notasAluno.length;
    return media;
  };

  const calcularPresenca = (id_aluno: string) => {
    const presencasAluno = presencas.filter(
      (p) => p.id_aluno === id_aluno && p.disciplinaId === disciplinaSelecionada
    );
    if (presencasAluno.length === 0) return null;

    const presencasValidas = presencasAluno.filter((p) => p.presenca).length;
    const percentual = (presencasValidas / presencasAluno.length) * 100;

    return percentual;
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center items-center mb-4">
        <ChartBarIcon className="w-6 h-6 mr-2" />
        <h2 className="text-lg font-semibold">Relatório de Alunos</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={disciplinaSelecionada}
          onChange={(e) => setDisciplinaSelecionada(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="" disabled>Selecione a disciplina</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded p-2 w-full"
          disabled={!disciplinaSelecionada}
        />
      </div>

      {/* Cabeçalho visível apenas em telas médias ou maiores */}
      <div className="hidden md:grid grid-cols-4 gap-4 text-center font-bold mb-2">
        <span>Aluno</span>
        <span>Média</span>
        <span>Presença</span>
        <span>Situação</span>
      </div>

      {alunosFiltrados.map((aluno) => {
        const media = calcularMedia(aluno.id);
        const presenca = calcularPresenca(aluno.id);

        let situacao;
        if (media !== null && presenca !== null) {
          if (media < 70 && presenca >= 75) {
            situacao = "Reprovado por nota";
          } else if (media >= 70 && presenca < 75) {
            situacao = "Reprovado por falta";
          } else if (media < 70 && presenca < 75) {
            situacao = "Reprovado";
          } else {
            situacao = "Aprovado";
          }
        } else {
          situacao = "Sem registros";
        }

        return (
          <div
            key={aluno.id}
            className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-4 border-b p-3 rounded-md hover:bg-gray-100 text-center"
          >
            <div>
              <span className="md:hidden font-semibold">Aluno: </span>
              {aluno.nome}
            </div>

            <div>
              <span className="md:hidden font-semibold">Média: </span>
              <span className={`font-semibold ${media !== null && media < 70 ? "text-red-500" : "text-gray-800"}`}>
                {media !== null ? media.toFixed(1) : "Sem notas"}
              </span>
            </div>

            <div>
              <span className="md:hidden font-semibold">Presença: </span>
              <span className={`font-semibold ${presenca !== null && presenca < 75 ? "text-red-500 font-bold" : "text-gray-800"}`}>
                {presenca !== null ? `${presenca.toFixed(0)}%` : "Sem registros"}
              </span>
            </div>

            <div>
              <span className="md:hidden font-semibold">Situação: </span>
              <span className={`font-semibold ${situacao.includes("Reprovado") ? "text-red-500 font-bold" : "text-green-600 font-semibold"}`}>
                {situacao}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
