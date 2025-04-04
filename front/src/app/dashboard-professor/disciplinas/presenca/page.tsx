'use client';
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function RegistroPresenca() {
  const [dataRegistro, setDataRegistro] = useState(new Date().toISOString().split("T")[0]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [presencas, setPresencas] = useState<{
    presenca: boolean;
    data: string;
    codigo_disciplina: string;
    id_aluno: string;
    nome_aluno: string;
  }[]>([]);

  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string }[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      const disciplinasMock = [
        { id: "MAT101", nome: "Matemática" },
        { id: "FIS102", nome: "Física" },
        { id: "QUI103", nome: "Química" },
      ];
      setDisciplinas(disciplinasMock);
      setDisciplinaSelecionada(disciplinasMock[0]?.id || "");
    };

    fetchDisciplinas();
  }, []);

  useEffect(() => {
    if (disciplinaSelecionada) {
      const fetchAlunos = async () => {
        const alunosPorDisciplina: Record<string, { id_aluno: string; nome_aluno: string }[]> = {
          MAT101: [
            { id_aluno: "101", nome_aluno: "João Silva" },
            { id_aluno: "102", nome_aluno: "Maria Souza" },
          ],
          FIS102: [
            { id_aluno: "201", nome_aluno: "Ana Lima" },
            { id_aluno: "202", nome_aluno: "Pedro Rocha" },
          ],
          QUI103: [
            { id_aluno: "301", nome_aluno: "Lucas Mendes" },
            { id_aluno: "302", nome_aluno: "Carla Dias" },
          ],
        };

        const alunos = alunosPorDisciplina[disciplinaSelecionada] || [];

        setPresencas(
          alunos.map((aluno) => ({
            ...aluno,
            presenca: false,
            data: dataRegistro,
            codigo_disciplina: disciplinaSelecionada,
          }))
        );
      };

      fetchAlunos();
    }
  }, [disciplinaSelecionada, dataRegistro]);

  const handlePresencaChange = (id_aluno: string) => {
    setPresencas((prev) =>
      prev.map((p) => (p.id_aluno === id_aluno ? { ...p, presenca: !p.presenca } : p))
    );
  };

  const handleConfirmSubmit = () => {
    const presencasAtualizadas = presencas.map((p) => ({ ...p, data: dataRegistro }));
    console.log("Presenças registradas:", presencasAtualizadas);
    setShowModal(false);
  };

  const alunosFiltrados = presencas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Registro de Presença</h2>

      {/* Filtros Responsivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-medium mb-4">
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <select
          value={disciplinaSelecionada}
          onChange={(e) => setDisciplinaSelecionada(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dataRegistro}
          onChange={(e) => setDataRegistro(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Cabeçalho da Lista de Alunos */}
      <div className="hidden sm:grid grid-cols-2 gap-4 font-medium mb-2">
        <span>Aluno</span>
        <span>Presença</span>
      </div>

      {/* Lista de Alunos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {alunosFiltrados.map((aluno) => (
          <div
            key={aluno.id_aluno}
            className="flex items-center justify-between border rounded-lg p-3 shadow-sm bg-gray-50"
          >
            <span className="text-sm sm:text-base">{aluno.nome_aluno}</span>
            <input
              type="checkbox"
              checked={aluno.presenca}
              onChange={() => handlePresencaChange(aluno.id_aluno)}
              className="w-5 h-5"
            />
          </div>
        ))}
      </div>

      {/* Botão Salvar */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-6 w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        <CheckCircleIcon className="w-6 h-6 text-white mr-1" />
        Salvar Todas Presenças
      </button>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Tem certeza que deseja salvar a chamada?
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Disciplina: {disciplinas.find(d => d.id === disciplinaSelecionada)?.nome}
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Salvar Chamada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
