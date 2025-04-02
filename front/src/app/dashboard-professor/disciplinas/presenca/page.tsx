'use client';
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";


export default function RegistroPresenca() {
  const [presencas, setPresencas] = useState([
    { data: new Date().toISOString(), presenca: false, codigo_disciplina: "MAT101", id_aluno: "101", nome_aluno: "João Silva" },
    { data: new Date().toISOString(), presenca: false, codigo_disciplina: "MAT101", id_aluno: "102", nome_aluno: "Maria Souza" },
    { data: new Date().toISOString(), presenca: false, codigo_disciplina: "MAT101", id_aluno: "103", nome_aluno: "Carlos Santos" },
  ]);

  const [busca, setBusca] = useState("");

  const handlePresencaChange = (id_aluno: string) => {
    setPresencas((prev) =>
      prev.map((p) => (p.id_aluno === id_aluno ? { ...p, presenca: !p.presenca } : p))
    );
  };

  const handleSubmit = () => {
    console.log("Presenças registradas:", presencas);
  };

  const alunosFiltrados = presencas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Registro de Presença</h2>
      <input
        type="text"
        placeholder="Buscar aluno..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />
      <div className="grid grid-cols-3 gap-4 items-center font-medium mb-2">
        <span>Aluno</span>
        <span>Presença</span>
        <span>Ação</span>
      </div>
      {alunosFiltrados.map((aluno) => (
        <div key={aluno.id_aluno} className="grid grid-cols-3 gap-4 items-center mb-2">
          <span>{aluno.nome_aluno}</span>
          <input
            type="checkbox"
            checked={aluno.presenca}
            onChange={() => handlePresencaChange(aluno.id_aluno)}
            className="w-5 h-5"
          />
          <button
            onClick={handleSubmit}
            className="cursor-pointer flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-6 h-6 text-white mr-1" />
            Salvar
          </button>
        </div>
      ))}
    </div>
  );
}
