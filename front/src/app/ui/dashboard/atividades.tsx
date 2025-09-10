"use client";
import { useState, useEffect } from "react";
import { ClipboardDocumentIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Atividades() {
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [atividadeToDelete, setAtividadeToDelete] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Captura a disciplina da URL ao carregar o componente
  const getDisciplinaAtual = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("disciplina");
    }
    return null;
  };

  useEffect(() => {
    setRole(sessionStorage.getItem("role") ?? null);
    setUserId(sessionStorage.getItem("userId") ?? null);
  }, []);

  useEffect(() => {
    const disciplinaAtual = getDisciplinaAtual();
    async function fetchAtividades() {
      try {
        const token =
          typeof window !== "undefined"
            ? sessionStorage.getItem("token")
            : null;
        if (!token || !userId)
          throw new Error("Token ou userId não encontrado");

        if (disciplinaAtual) {
          // Busca atividades de uma disciplina específica
          const response = await fetch(
            `${API_BASE_URL}/disciplinas/${disciplinaAtual}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
              },
            }
          );

          if (!response.ok)
            throw new Error("Erro ao buscar dados da disciplina");

          const data = await response.json();
          if (!data.atividades) throw new Error("Nenhuma atividade encontrada");

          setAtividades(data.atividades);
        } else {
          // Busca todas as disciplinas do aluno
          const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          });

          if (!response.ok)
            throw new Error("Erro ao buscar disciplinas do aluno");

          const userData = await response.json();
          const disciplinas = userData.disciplinas || [];

          let todasAtividades: any[] = [];

          for (const d of disciplinas) {
            const res = await fetch(
              `${API_BASE_URL}/disciplinas/${d.codigo_disciplina}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "*/*",
                },
              }
            );

            if (res.ok) {
              const data = await res.json();
              todasAtividades = [
                ...todasAtividades,
                ...(data.atividades || []),
              ];
            }
          }

          // Remove duplicadas
          const atividadesUnicas = todasAtividades.filter(
            (atividade, index, self) =>
              index === self.findIndex((a) => a._id === atividade._id)
          );

          setAtividades(atividadesUnicas);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchAtividades();
    }
  }, [userId, API_BASE_URL]);

  if (loading)
    return (
      <p className="text-gray-500 text-sm text-center mt-4">
        Carregando atividades...
      </p>
    );
  if (error)
    return <p className="text-red-500 text-sm text-center mt-4">{error}</p>;

  const handleCriarAtividade = () => {
    const disciplinaAtual = getDisciplinaAtual();
    if (role === "professor") {
      window.location.href = `/dashboard-professor/disciplinas/atividades/criar?disciplina=${disciplinaAtual}`;
    } else {
      // Use um modal ou notificação personalizada em vez de alert()
      // para melhor experiência de usuário
    }
  };

  const handleExcluirAtividade = (atividadeId: string) => {
    if (role === "professor") {
      setAtividadeToDelete(atividadeId);
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!atividadeToDelete) return;

    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetch(
        `${API_BASE_URL}/atividades/${atividadeToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao apagar a atividade.");
      }

      // Remove a atividade da lista localmente
      setAtividades(atividades.filter(ativ => ativ._id !== atividadeToDelete));
      setAtividadeToDelete(null);
      setShowConfirmModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido ao apagar.");
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setAtividadeToDelete(null);
    setShowConfirmModal(false);
  };

  const disciplinaAtual = getDisciplinaAtual();

  return (
    <>
      <div className="mt-4 mb-4 flex justify-end space-x-2">
        {role === "professor" && disciplinaAtual && (
          <button
            onClick={handleCriarAtividade}
            className="cursor-pointer flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-6 h-6 text-white mr-1" />
            Criar Atividade
          </button>
        )}
      </div>

      <div className="w-full mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="w-full flex justify-between items-center text-gray-700 font-semibold border-b pb-2">
          <span>
            {disciplinaAtual
              ? `Atividades de ${disciplinaAtual}`
              : "Atividades de todas as disciplinas"}
          </span>
          <span>{atividades.length}</span>
        </div>

        <ul className="mt-2">
          {atividades.length > 0 ? (
            atividades.map((atividade) => {
              let notaDoAluno = null;
              if (role === "aluno" && atividade.nota_alunos && userId) {
                const notaEncontrada = atividade.nota_alunos.find(
                  (n: any) => n.id_aluno === userId
                );
                notaDoAluno = notaEncontrada ? notaEncontrada.nota : null;
              }

              return (
                <li
                  key={atividade._id}
                  className="flex justify-between p-4 hover:bg-gray-100 rounded-lg cursor-pointer border border-gray-200 mt-1"
                >
                  <div className="flex space-x-4">
                    {/* Ícone */}
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <ClipboardDocumentIcon className="w-6 h-6 text-gray-700" />
                    </div>

                    {/* Conteúdo principal */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">{atividade.nome}</p>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                          {atividade.descricao}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Disciplina:</span> {atividade.disciplina}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-medium">Entrega:</span>{" "}
                          {new Date(atividade.data_entrega).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Nota máxima:</span> {atividade.nota}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Botão de Excluir para Professor */}
                    {role === "professor" && (
                      <button
                        onClick={() => handleExcluirAtividade(atividade._id)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Apagar atividade"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    )}
                    {/* Nota do aluno */}
                    {role === "aluno" && (
                      <div className="flex items-start text-right text-sm font-semibold text-gray-800 ml-4 whitespace-nowrap">
                        {notaDoAluno !== null ? `${notaDoAluno}/${atividade.nota}` : `--/${atividade.nota}`}
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm text-center mt-4">
              Nenhuma atividade encontrada para{" "}
              {disciplinaAtual || "as disciplinas disponíveis"}.
            </p>
          )}
        </ul>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold">Confirmação</h3>
            <p className="mt-2 text-sm text-gray-600">Tem certeza que deseja apagar esta atividade? Esta ação não pode ser desfeita.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
