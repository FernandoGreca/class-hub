'use client';
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function RegistroPresenca() {
  const [dataRegistro, setDataRegistro] = useState(new Date().toISOString().split("T")[0]);
  const [disciplinas, setDisciplinas] = useState<{ codigo_disciplina: string; nome: string }[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [presencas, setPresencas] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem("token") : null;
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem("userId") : null;

  useEffect(() => {
    async function fetchDisciplinasDoProfessor() {
      if (!userId || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        const data = await res.json();
        const lista = data.disciplinas || [];
        setDisciplinas(lista);
        if (lista.length > 0) {
          setDisciplinaSelecionada(lista[0].codigo_disciplina);
        }
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    }

    fetchDisciplinasDoProfessor();
  }, [userId, token]);

  useEffect(() => {
    async function fetchAlunosDaDisciplina() {
      if (!disciplinaSelecionada || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/disciplinas/${disciplinaSelecionada}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        const data = await res.json();
        const alunos = data.alunos || [];

        const presencasFormatadas = alunos.map((aluno: any) => ({
          id_aluno: aluno._id,
          nome_aluno: aluno.nome,
          presenca: false,
          data: dataRegistro,
          codigo_disciplina: disciplinaSelecionada,
        }));

        setPresencas(presencasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar alunos da disciplina:", error);
      }
    }

    fetchAlunosDaDisciplina();
  }, [disciplinaSelecionada, dataRegistro, token]);

  const handlePresencaChange = (id_aluno: string) => {
    setPresencas((prev) =>
      prev.map((p) => (p.id_aluno === id_aluno ? { ...p, presenca: !p.presenca } : p))
    );
  };

  const handleConfirmSubmit = async () => {
    try {
      const promises = presencas.map((presenca) =>
        fetch("http://localhost:3000/presencas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...presenca, data: new Date(dataRegistro).toISOString() }),
        })
      );

      await Promise.all(promises);
      alert("Presenças registradas com sucesso!");
    } catch (error) {
      alert("Erro ao registrar presenças.");
      console.error(error);
    }

    setShowModal(false);
  };

  const alunosFiltrados = presencas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Registro de Presença</h2>

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
          {disciplinas.map((disc) => (
            <option key={disc.codigo_disciplina} value={disc.codigo_disciplina}>
              {disc.nome}
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

      <div className="hidden sm:grid grid-cols-2 gap-4 font-medium mb-2">
        <span>Aluno</span>
        <span>Presença</span>
      </div>

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

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        <CheckCircleIcon className="w-6 h-6 text-white mr-1" />
        Salvar Todas Presenças
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Tem certeza que deseja salvar a chamada?
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Disciplina: {disciplinas.find(d => d.codigo_disciplina === disciplinaSelecionada)?.nome}
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
