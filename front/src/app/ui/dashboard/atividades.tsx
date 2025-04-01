"use client";
import { useState, useEffect } from "react";
import { ClipboardDocumentIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from "next/navigation";

export default function Atividades() {
    const searchParams = useSearchParams();
    const disciplinaAtual = searchParams.get("disciplina"); // Pega a disciplina da URL
    const [atividades, setAtividades] = useState<{
        id: string;
        disciplina: string;
        data_entrega: string;
        nome: string;
        nota: string;
        nota_alunos: { id_aluno: string; nota: number }[]; // Array de notas dos alunos
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setRole(sessionStorage.getItem("role") ?? null);

        async function fetchAtividades() {
            if (!disciplinaAtual) return;

            try {
                const token = localStorage.getItem("token"); // Pegue o token salvo no login
                if (!token) {
                    throw new Error("Token não encontrado");
                }

                const response = await fetch("http://localhost:3000/atividades", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar atividades");
                }

                const data = await response.json();
                const atividadesFiltradas = data.filter((a: { disciplina: string; }) => a.disciplina.toLowerCase() === disciplinaAtual.toLowerCase());
                setAtividades(atividadesFiltradas);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        }

        fetchAtividades();
    }, [disciplinaAtual]);

    if (loading) return <p className="text-gray-500 text-sm text-center mt-4">Carregando atividades...</p>;
    if (error) return <p className="text-red-500 text-sm text-center mt-4">{error}</p>;

    const handleCriarAtividade = () => {
        if (role === "professor") {
            router.push(`/dashboard-professor/disciplinas/atividades/criar?disciplina=${disciplinaAtual}`);
        } else {
            alert("Você não tem permissão para criar atividades.");
        }
    };

    return (
        <>
            <div className="mt-4 mb-4 flex justify-end">
                {role === "professor" && (
                    <button onClick={handleCriarAtividade} className="cursor-pointer flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-6 h-6 text-white mr-1" />

                        Criar Atividade
                    </button>
                )}
            </div>
            <div className="w-full mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="w-full flex justify-between items-center text-gray-700 font-semibold border-b pb-2">
                    <span>Atividades de {disciplinaAtual || "todas as disciplinas"}</span>
                    <span>{atividades.length}</span>
                </div>


                <ul className="mt-2">
                    {atividades.length > 0 ? (
                        atividades.map((atividade, index) => {
                            return (
                                <li key={atividade.id || index} className="flex items-start space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <ClipboardDocumentIcon className="w-5 h-5 text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">{atividade.nome}</p>
                                        <p className="text-gray-600 text-sm">Disciplina: {atividade.disciplina}</p>
                                        <p className="text-gray-500 text-xs">Data de entrega: {new Date(atividade.data_entrega).toLocaleDateString("pt-BR")}</p>
                                        <p className="text-gray-700 text-xs">Nota máxima: {atividade.nota}</p>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-sm text-center mt-4">Nenhuma atividade encontrada para {disciplinaAtual}.</p>
                    )}
                </ul>
            </div>
        </>

    );
}
