"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";

export default function DashboardDisicplinaProfessor() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [disciplinas, setDisciplinas] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const storedRole = sessionStorage.getItem("role");

        if (!token) {
            router.push("/login"); // Redireciona para login se não tiver token
            return;
        }

        setRole(storedRole); // Define a role do usuário

        // Recupera a lista de disciplinas do usuário
        const user = sessionStorage.getItem("User");

        if (user) {
            const parsedUser = JSON.parse(user);

            if (parsedUser && parsedUser.disciplinas) {
                setDisciplinas(parsedUser.disciplinas);
            } else {
                setDisciplinas([]);
            }
        }

        setIsLoading(false);
    }, []);

    // Função para direcionar para a página correta de atividades
    const irParaAtividades = (idDisciplina: string) => {
        const storedRole = sessionStorage.getItem("role"); // Obtém a role novamente
        if (!storedRole) return; // Evita redirecionar se a role não estiver carregada
      
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
            <h2 className="text-2xl font-semibold mb-4">
                {role === "professor" ? "Minhas Disciplinas" : "Disciplinas Matriculadas"}
            </h2>
            <div className="flex flex-wrap gap-8">
                {disciplinas.length > 0 ? (
                    disciplinas.map((disciplina: any) => (
                        <Card
                            key={disciplina._id}
                            nomeDisciplina={disciplina.nome}
                            fotoPerfil={undefined}
                            nomeProfessor={
                                disciplina.professores ? disciplina.professores[0] : "Professor Desconhecido"
                            }
                            buttonBgColor="purple"
                            buttonBgColorHover="purple"
                            onClick={() => irParaAtividades(disciplina.nome)}
                        />
                    ))
                ) : (
                    <p>Não há disciplinas disponíveis.</p>
                )}
            </div>
        </>
    );
}
