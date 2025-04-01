"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";

export default function Dashboard() {
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
    console.log("Usuário recuperado:", user);

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Usuário parseado:", parsedUser);

      if (parsedUser && parsedUser.disciplinas) {
        setDisciplinas(parsedUser.disciplinas);
      } else {
        console.log("Nenhuma disciplina encontrada.");
        setDisciplinas([]);
      }
    } else {
      console.log("Não foi possível recuperar o usuário.");
    }

    setIsLoading(false);
  }, []);

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
            />
          ))
        ) : (
          <p>Não há disciplinas disponíveis.</p>
        )}
      </div>
    </>
  );
}
