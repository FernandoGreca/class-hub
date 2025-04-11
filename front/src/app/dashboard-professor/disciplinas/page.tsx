"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";
import CadastrarDisciplina from "@/app/ui/dashboard/cadastrar-disciplina";
import { PlusIcon } from "@heroicons/react/24/outline";


export default function DashboardDisicplinaProfessor() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [disciplinas, setDisciplinas] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const storedRole = sessionStorage.getItem("role");

        if (!token) {
            router.push("/login");
            return;
        }

        setRole(storedRole);

        const user = sessionStorage.getItem("User");

        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser && parsedUser.disciplinas) {
                // 🧼 Remover duplicadas com base no _id
                const disciplinasUnicas = parsedUser.disciplinas.filter(
                    (disciplina: any, index: number, self: any[]) =>
                        index === self.findIndex((d) => d._id === disciplina._id)
                );

                setDisciplinas(disciplinasUnicas);
            } else {
                setDisciplinas([]);
            }
        }

        setIsLoading(false);
    }, []);

    const irParaAtividades = (idDisciplina: string) => {
        const storedRole = sessionStorage.getItem("role");
        if (!storedRole) return;

        const basePath = storedRole === "professor"
            ? "/dashboard-professor/disciplinas/atividades"
            : "/dashboard-aluno/disciplinas/atividades";

        router.push(`${basePath}?disciplina=${encodeURIComponent(idDisciplina)}`);
    };

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                    {role === "professor" ? "Minhas Disciplinas" : "Disciplinas Matriculadas"}
                </h2>

                {role === "professor" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex gap-1 items-center cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        <PlusIcon className="h-6 w-6" />
                        Cadastrar Disciplina
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-8">
                {disciplinas.length > 0 ? (
                    disciplinas.map((disciplina: any) => (
                        <Card
                            key={disciplina._id}
                            nomeDisciplina={disciplina.nome}
                            fotoPerfil={undefined}
                            nomeProfessor={disciplina.professores ? disciplina.professores[0] : "Professor Desconhecido"}
                            buttonBgColor="purple"
                            buttonBgColorHover="purple"
                            onClick={() => irParaAtividades(disciplina.codigo_disciplina)}
                            codigoDisciplina={disciplina.codigo_disciplina}
                        />
                    ))
                ) : (
                    <p>Não há disciplinas disponíveis.</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            &times;
                        </button>

                        <CadastrarDisciplina />
                    </div>
                </div>
            )}
        </>
    );
}
