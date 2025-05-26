"use client";
import { useEffect, useState } from "react";
import {
  ArrowRightCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export default function LancamentoNotas() {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [atividades, setAtividades] = useState<any[]>([]);
  const [todosAlunos, setTodosAlunos] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [notasLançadas, setNotasLançadas] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"individual" | "todas" | null>(
    null
  );
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("User") || "{}")
      : null;

  const userId = user?._id || null;

  useEffect(() => {
    if (!userId || !token) return;

    fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const disciplinasUser = await Promise.all(
          data.disciplinas.map(async (disciplina: any) => {
            const res = await fetch(
              `${API_BASE_URL}/disciplinas/${disciplina.codigo_disciplina}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return res.json();
          })
        );

        // ✅ Remover duplicatas de disciplinas com base no campo 'codigo_disciplina'
        const disciplinasUnicas = disciplinasUser.filter(
          (disciplina, index, self) =>
            index ===
            self.findIndex(
              (d) => d.codigo_disciplina === disciplina.codigo_disciplina
            )
        );

        setDisciplinas(disciplinasUnicas);
      });
  }, [userId, token]);

  const handleDisciplinaChange = (id: string) => {
    const disciplina = disciplinas.find((d) => d.codigo_disciplina === id);
    if (!disciplina) return;
    setDisciplinaSelecionada(id);
    setAtividadeSelecionada("");

    // Remover duplicatas de alunos pelo _id
    const alunosUnicos = disciplina.alunos.filter(
      (aluno: any, index: number, self: any[]) =>
        index === self.findIndex((a) => a._id === aluno._id)
    );
    setTodosAlunos(alunosUnicos);

    // Remover duplicatas de atividades pelo _id
    const atividadesUnicas = disciplina.atividades.filter(
      (atividade: any, index: number, self: any[]) =>
        index === self.findIndex((a) => a._id === atividade._id)
    );
    setAtividades(atividadesUnicas);

    setNotas([]);
    setNotasLançadas([]);
  };

  const handleAtividadeChange = (id: string) => {
    setAtividadeSelecionada(id);
    const alunos = todosAlunos.map((aluno) => ({
      id_atividade: id,
      id_aluno: aluno._id,
      nome_aluno: aluno.nome,
      nota: "",
      disciplinaId: disciplinaSelecionada,
    }));
    setNotas(alunos);
    setNotasLançadas([]);
  };

  const handleNotaChange = (id_aluno: string, valor: string) => {
    setNotas((prev) =>
      prev.map((n) => (n.id_aluno === id_aluno ? { ...n, nota: valor } : n))
    );
  };

  const enviarNota = async (nota: any) => {
    const res = await fetch(
      `${API_BASE_URL}/atividades/inserir-nota-aluno-atividade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_atividade: nota.id_atividade,
          id_aluno: nota.id_aluno,
          nome_aluno: nota.nome_aluno,
          nota: Number(nota.nota),
        }),
      }
    );

    if (!res.ok) {
      console.error("Erro ao enviar nota:", await res.text());
    }
  };

  const handleSubmit = (id_aluno: string) => {
    if (processando || notasLançadas.includes(id_aluno)) return;
    setAlunoSelecionado(id_aluno);
    setAcaoModal("individual");
    setShowModal(true);
  };

  const handleSubmitAll = () => {
    if (processando || notas.every((n) => n.nota === "")) return;
    setAcaoModal("todas");
    setShowModal(true);
  };

  const handleConfirmacaoModal = async () => {
    setProcessando(true);

    if (acaoModal === "individual" && alunoSelecionado) {
      const nota = notas.find((n) => n.id_aluno === alunoSelecionado);
      if (nota) {
        await enviarNota(nota);
        setNotasLançadas((prev) => [...prev, alunoSelecionado]);
      }
    }

    if (acaoModal === "todas") {
      const notasValidas = notas.filter(
        (n) => n.nota !== "" && !notasLançadas.includes(n.id_aluno)
      );
      for (const nota of notasValidas) {
        await enviarNota(nota);
      }
      setNotasLançadas((prev) => [
        ...prev,
        ...notasValidas.map((n) => n.id_aluno),
      ]);
    }

    setShowModal(false);
    setAlunoSelecionado(null);
    setTimeout(() => setProcessando(false), 1000);
  };

  const alunosFiltrados = notas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
          Lançamento de Notas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            value={disciplinaSelecionada}
            onChange={(e) => handleDisciplinaChange(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="" disabled>
              Selecione a disciplina
            </option>
            {disciplinas.map((disciplina) => (
              <option
                key={disciplina.codigo_disciplina}
                value={disciplina.codigo_disciplina}
              >
                {disciplina.nome}
              </option>
            ))}
          </select>

          <select
            value={atividadeSelecionada}
            onChange={(e) => handleAtividadeChange(e.target.value)}
            className="border rounded p-2 w-full"
            disabled={!disciplinaSelecionada}
          >
            <option value="" disabled>
              Selecione a atividade
            </option>
            {atividades.map((atividade) => (
              <option key={atividade._id} value={atividade._id}>
                {atividade.nome}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Buscar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          disabled={!atividadeSelecionada}
        />

        <div className="hidden sm:grid grid-cols-3 gap-4 font-medium mb-2">
          <span>Aluno</span>
          <span>Nota</span>
          <span>Ação</span>
        </div>

        {alunosFiltrados.map((aluno) => (
          <div
            key={`${aluno.id_aluno}-${atividadeSelecionada}`}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center mb-3"
          >
            <span className="font-medium">{aluno.nome_aluno}</span>
            <input
              type="number"
              min="0"
              max="100"
              value={aluno.nota}
              onChange={(e) => handleNotaChange(aluno.id_aluno, e.target.value)}
              className="border rounded p-2 w-full"
              disabled={notasLançadas.includes(aluno.id_aluno)}
            />
            <button
              onClick={() => handleSubmit(aluno.id_aluno)}
              className={` cursor-pointer flex justify-center items-center py-2 px-4 rounded-lg ${
                notasLançadas.includes(aluno.id_aluno)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              disabled={
                aluno.nota === "" || notasLançadas.includes(aluno.id_aluno)
              }
            >
              <ArrowRightCircleIcon className="w-5 h-5 mr-1" />
              {notasLançadas.includes(aluno.id_aluno) ? "Lançado" : "Lançar"}
            </button>
          </div>
        ))}

        <button
          onClick={handleSubmitAll}
          className="mt-4 w-full cursor-pointer flex justify-center items-center bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900"
          disabled={notas.every((n) => notasLançadas.includes(n.id_aluno))}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Lançar todas as notas preenchidas
        </button>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {acaoModal === "todas"
                  ? "Deseja lançar todas as notas preenchidas?"
                  : "Deseja lançar a nota deste aluno?"}
              </h2>
              <p className="text-gray-600 mt-2">
                Disciplina:{" "}
                {
                  disciplinas.find(
                    (d) => d.codigo_disciplina === disciplinaSelecionada
                  )?.nome
                }
                <br />
                Atividade:{" "}
                {atividades.find((a) => a._id === atividadeSelecionada)?.nome}
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmacaoModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-6 border-t border-gray-300" />

      <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
        Buscar Nota de Aluno
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <select
          onChange={(e) => setDisciplinaSelecionada(e.target.value)}
          value={disciplinaSelecionada}
          className="border rounded p-2 w-full"
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((disciplina) => (
            <option
              key={disciplina.codigo_disciplina}
              value={disciplina.codigo_disciplina}
            >
              {disciplina.nome}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setAtividadeSelecionada(e.target.value)}
          value={atividadeSelecionada}
          className="border rounded p-2 w-full"
          disabled={!disciplinaSelecionada}
        >
          <option value="">Selecione a atividade</option>
          {atividades.map((atividade) => (
            <option key={atividade._id} value={atividade._id}>
              {atividade.nome}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          value={alunoSelecionado ?? ""}
          className="border rounded p-2 w-full"
          disabled={!atividadeSelecionada}
        >
          <option value="">Selecione o aluno</option>
          {todosAlunos.map((aluno) => (
            <option key={aluno._id} value={aluno._id}>
              {aluno.nome}
            </option>
          ))}
        </select>
      </div>

      {disciplinaSelecionada && atividadeSelecionada && alunoSelecionado && (
        <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow text-center">
          {(() => {
            const nota = notas.find(
              (n) =>
                n.id_aluno === alunoSelecionado &&
                n.id_atividade === atividadeSelecionada
            );
            return (
              <p className="text-gray-800">
                Nota do aluno{" "}
                <strong>
                  {todosAlunos.find((a) => a._id === alunoSelecionado)?.nome}
                </strong>{" "}
                na atividade{" "}
                <strong>
                  {atividades.find((a) => a._id === atividadeSelecionada)?.nome}
                </strong>
                :{" "}
                <span className="text-blue-700 font-semibold">
                  {nota?.nota !== "" ? nota?.nota : "Nota não cadastrada"}
                </span>
              </p>
            );
          })()}
        </div>
      )}
    </>
  );
}
