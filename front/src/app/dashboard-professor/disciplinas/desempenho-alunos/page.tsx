'use client';
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
  ];

  const todasNotas = [
    { id_aluno: "101", disciplinaId: "MAT101", nota: 70 },
    { id_aluno: "101", disciplinaId: "MAT101", nota: 80 },
    { id_aluno: "102", disciplinaId: "MAT101", nota: 90 },
    { id_aluno: "102", disciplinaId: "MAT101", nota: 100 },
    { id_aluno: "103", disciplinaId: "PORT102", nota: 75 },
  ];

  const presencas = [
    { id_aluno: "101", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "101", disciplinaId: "MAT101", presenca: false },
    { id_aluno: "101", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "102", disciplinaId: "MAT101", presenca: true },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: false },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: false },
    { id_aluno: "103", disciplinaId: "PORT102", presenca: true },
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
    if (notasAluno.length === 0) return "Sem notas";
    const media =
      notasAluno.reduce((acc, cur) => acc + cur.nota, 0) / notasAluno.length;
    return media.toFixed(1);
  };

  const verificarPresenca = (id_aluno: string) => {
    const presencasAluno = presencas.filter(
      (p) => p.id_aluno === id_aluno && p.disciplinaId === disciplinaSelecionada
    );
    if (presencasAluno.length === 0) return "Sem registros";

    const presencasValidas = presencasAluno.filter((p) => p.presenca).length;
    const percentual = (presencasValidas / presencasAluno.length) * 100;

    return percentual < 75
      ? `Reprovado por falta (${percentual.toFixed(0)}%)`
      : `Aprovado (${percentual.toFixed(0)}%)`;
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Relatório de Alunos</h2>

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

      <div className="grid grid-cols-3 gap-4 font-medium mb-2">
        <span>Aluno</span>
        <span>Média</span>
        <span>Presença</span>
      </div>

      {alunosFiltrados.map((aluno) => (
        <div
          key={aluno.id}
          className="grid grid-cols-3 gap-4 items-center border-b py-2"
        >
          <span>{aluno.nome}</span>
          <span>{calcularMedia(aluno.id)}</span>
          <span>{verificarPresenca(aluno.id)}</span>
        </div>
      ))}
    </div>
  );
}
