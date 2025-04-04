'use client';
import { useState } from "react";
import { ArrowRightCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function LancamentoNotas() {
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] = useState("");
  const [busca, setBusca] = useState("");
  const [processando, setProcessando] = useState(false);
  const [notasLançadas, setNotasLançadas] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [acaoModal, setAcaoModal] = useState<"individual" | "todas" | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);

  const disciplinas = [
    { id: "MAT101", nome: "Matemática" },
    { id: "PORT102", nome: "Português" },
  ];

  const atividades = [
    { id: "1", nome: "Prova 1", disciplinaId: "MAT101" },
    { id: "2", nome: "Trabalho Final", disciplinaId: "MAT101" },
    { id: "3", nome: "Apresentação", disciplinaId: "PORT102" },
  ];

  const todosAlunos = [
    { id_aluno: "101", nome_aluno: "João Silva", disciplinaId: "MAT101" },
    { id_aluno: "102", nome_aluno: "Maria Souza", disciplinaId: "MAT101" },
    { id_aluno: "103", nome_aluno: "Carlos Santos", disciplinaId: "PORT102" },
  ];

  const [notas, setNotas] = useState<
    { id_atividade: string; id_aluno: string; nome_aluno: string; nota: string; disciplinaId: string }[]
  >([]);

  const handleDisciplinaChange = (id: string) => {
    setDisciplinaSelecionada(id);
    setAtividadeSelecionada("");
    setNotas([]);
    setNotasLançadas([]);
  };

  const handleAtividadeChange = (id: string) => {
    setAtividadeSelecionada(id);
    const alunosFiltrados = todosAlunos
      .filter(aluno => aluno.disciplinaId === disciplinaSelecionada)
      .map(aluno => ({
        id_atividade: id,
        id_aluno: aluno.id_aluno,
        nome_aluno: aluno.nome_aluno,
        nota: "",
        disciplinaId: disciplinaSelecionada,
      }));
    setNotas(alunosFiltrados);
    setNotasLançadas([]);
  };

  const handleNotaChange = (id_aluno: string, valor: string) => {
    setNotas((prev) =>
      prev.map((n) => (n.id_aluno === id_aluno ? { ...n, nota: valor } : n))
    );
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

  const handleConfirmacaoModal = () => {
    if (acaoModal === "individual" && alunoSelecionado) {
      setProcessando(true);
      const notaLançada = notas.find(n => n.id_aluno === alunoSelecionado);
      if (notaLançada) console.log("Nota lançada:", notaLançada);

      setNotasLançadas((prev) => [...prev, alunoSelecionado]);
      setAlunoSelecionado(null);
    }

    if (acaoModal === "todas") {
      const notasPreenchidas = notas.filter((n) => n.nota !== "");
      console.log("Notas lançadas:", notasPreenchidas);
      setNotasLançadas(notasPreenchidas.map((n) => n.id_aluno));
    }

    setShowModal(false);
    setTimeout(() => setProcessando(false), 1000);
  };

  const alunosFiltrados = notas.filter((aluno) =>
    aluno.nome_aluno.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Lançamento de Notas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={disciplinaSelecionada}
          onChange={(e) => handleDisciplinaChange(e.target.value)}
          className="border rounded p-2 w-full text-sm"
        >
          <option value="" disabled>Selecione a disciplina</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>

        <select
          value={atividadeSelecionada}
          onChange={(e) => handleAtividadeChange(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          disabled={!disciplinaSelecionada}
        >
          <option value="" disabled>Selecione a atividade</option>
          {atividades
            .filter(atividade => atividade.disciplinaId === disciplinaSelecionada)
            .map((atividade) => (
              <option key={atividade.id} value={atividade.id}>
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
        className="border rounded p-2 w-full mb-4 text-sm"
        disabled={!atividadeSelecionada}
      />

      <div className="hidden sm:grid grid-cols-3 gap-4 font-medium mb-2">
        <span>Aluno</span>
        <span>Nota</span>
        <span>Ação</span>
      </div>

      {alunosFiltrados.map((aluno) => (
        <div key={aluno.id_aluno} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center mb-3">
          <span className="font-medium">{aluno.nome_aluno}</span>
          <input
            type="number"
            min="0"
            max="100"
            value={aluno.nota}
            onChange={(e) => handleNotaChange(aluno.id_aluno, e.target.value)}
            className="border rounded p-2 w-full text-sm"
            disabled={notasLançadas.includes(aluno.id_aluno)}
          />
          <button
            onClick={() => handleSubmit(aluno.id_aluno)}
            className={`flex justify-center items-center py-2 px-4 rounded-lg text-sm ${
              notasLançadas.includes(aluno.id_aluno)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={aluno.nota === "" || notasLançadas.includes(aluno.id_aluno)}
          >
            <ArrowRightCircleIcon className="w-5 h-5 mr-1" />
            {notasLançadas.includes(aluno.id_aluno) ? "Lançado" : "Lançar"}
          </button>
        </div>
      ))}

      <button
        onClick={handleSubmitAll}
        className="mt-4 w-full flex justify-center items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm"
        disabled={notas.every((n) => notasLançadas.includes(n.id_aluno))}
      >
        <CheckCircleIcon className="w-5 h-5 mr-2" />
        Lançar todas as notas preenchidas
      </button>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {acaoModal === "todas"
                ? "Deseja lançar todas as notas preenchidas?"
                : "Deseja lançar a nota deste aluno?"}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Disciplina: {disciplinas.find(d => d.id === disciplinaSelecionada)?.nome}<br />
              Atividade: {atividades.find(a => a.id === atividadeSelecionada)?.nome}
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmacaoModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
