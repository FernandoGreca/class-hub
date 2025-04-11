"use client";
import { useState, useEffect } from "react";
import { ClipboardDocumentIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from "next/navigation";

export default function Atividades() {
    const searchParams = useSearchParams();
    const disciplinaAtual = searchParams.get("disciplina");
    const [atividades, setAtividades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setRole(sessionStorage.getItem("role") ?? null);
        setUserId(sessionStorage.getItem("userId") ?? null);
    }, []);

    useEffect(() => {
        async function fetchAtividades() {
            try {
                const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
                if (!token || !userId) throw new Error("Token ou userId não encontrado");

                if (disciplinaAtual) {
                    // Busca atividades de uma disciplina específica
                    const response = await fetch(`http://localhost:3000/disciplinas/${disciplinaAtual}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                        },
                    });

                    if (!response.ok) throw new Error("Erro ao buscar dados da disciplina");

                    const data = await response.json();
                    if (!data.atividades) throw new Error("Nenhuma atividade encontrada");

                    setAtividades(data.atividades);
                } else {
                    // Busca todas as disciplinas do aluno
                    const response = await fetch(`http://localhost:3000/users/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                        },
                    });

                    if (!response.ok) throw new Error("Erro ao buscar disciplinas do aluno");

                    const userData = await response.json();
                    const disciplinas = userData.disciplinas || [];

                    let todasAtividades: any[] = [];

                    for (const d of disciplinas) {
                        const res = await fetch(`http://localhost:3000/disciplinas/${d.codigo_disciplina}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "*/*",
                            },
                        });

                        if (res.ok) {
                            const data = await res.json();
                            todasAtividades = [...todasAtividades, ...(data.atividades || [])];
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
    }, [disciplinaAtual, userId]);

    if (loading) return <p className="text-gray-500 text-sm text-center mt-4">Carregando atividades...</p>;
    if (error) return <p className="text-red-500 text-sm text-center mt-4">{error}</p>;

    const handleCriarAtividade = () => {
        if (role === "professor") {
            router.push(`/dashboard-professor/disciplinas/atividades/criar?disciplina=${disciplinaAtual}`);
        } else {
            alert("Você não tem permissão para criar atividades.");
        }
    };

    const handleVerPresencas = () => {
        router.push(`/dashboard-aluno/disciplinas/presenca-aluno?disciplina=${disciplinaAtual}`);
    };

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
                                    className="flex items-start justify-between space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <ClipboardDocumentIcon className="w-5 h-5 text-gray-700" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{atividade.nome}</p>
                                            <p className="text-gray-600 text-sm">Disciplina: {atividade.disciplina}</p>
                                            <p className="text-gray-500 text-xs">
                                                Data de entrega:{" "}
                                                {new Date(atividade.data_entrega).toLocaleDateString("pt-BR")}
                                            </p>
                                            <p className="text-gray-700 text-xs">Nota máxima: {atividade.nota}</p>
                                        </div>
                                    </div>

                                    {role === "aluno" && (
                                        <div className="text-right text-sm text-gray-800 font-semibold whitespace-nowrap">
                                            {notaDoAluno !== null
                                                ? `${notaDoAluno}/${atividade.nota}`
                                                : `--/${atividade.nota}`}
                                        </div>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-sm text-center mt-4">
                            Nenhuma atividade encontrada para {disciplinaAtual || "as disciplinas disponíveis"}.
                        </p>
                    )}
                </ul>
            </div>
        </>
    );
}
