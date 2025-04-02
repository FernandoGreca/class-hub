'use client';
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function LancamentoNotas() {
  const [notas, setNotas] = useState([
    { id_atividade: "1", id_aluno: "101", nome_aluno: "João Silva", nota: "" },
    { id_atividade: "1", id_aluno: "102", nome_aluno: "Maria Souza", nota: "" },
    { id_atividade: "1", id_aluno: "103", nome_aluno: "Carlos Santos", nota: "" },
  ]);

  const [busca, setBusca] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] = useState("");
  const atividades = ["Prova 1", "Trabalho Final", "Apresentação"];

  const handleNotaChange = (id_aluno: string, valor: string) => {
    setNotas((prev) =>
      prev.map((n) => (n.id_aluno === id_aluno ? { ...n, nota: valor } : n))
    );
  };

  const handleSubmit = () => {
    console.log("Notas lançadas:", notas);
  };

  const alunosFiltrados = notas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Lançamento de Notas</h2>
      <select
        value={atividadeSelecionada}
        onChange={(e) => setAtividadeSelecionada(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      >
        <option value="" disabled>Selecione a atividade</option>
        {atividades.map((atividade, index) => (
          <option key={index} value={atividade}>{atividade}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Buscar aluno..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />
      <div className="grid grid-cols-4 gap-4 items-center font-medium mb-2">
        <span>Aluno</span>
        <span>Nota</span>
        <span>Ação</span>
      </div>
      {alunosFiltrados.map((aluno) => (
        <div key={aluno.id_aluno} className="grid grid-cols-4 gap-4 items-center mb-2">
          <span>{aluno.nome_aluno}</span>
          <input
            type="number"
            min="0"
            max="100"
            value={aluno.nota}
            onChange={(e) => handleNotaChange(aluno.id_aluno, e.target.value)}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleSubmit}
            className="cursor-pointer w-30 flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-6 h-6 text-white mr-1" />
            Salvar
          </button>
        </div>
      ))}
    </div>
  );
}