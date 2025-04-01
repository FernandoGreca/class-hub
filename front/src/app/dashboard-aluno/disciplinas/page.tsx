"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redireciona para login se não tiver token
    } else {
      setIsLoading(false); // Permite renderizar a página
    }

    // Recupera a lista de disciplinas da sessionStorage
    const user = sessionStorage.getItem("User");
    console.log("Usuário recuperado:", user); // Log para verificar o conteúdo do usuário

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Usuário parseado:", parsedUser); // Verifique o conteúdo do parsedUser
      if (parsedUser && parsedUser.disciplinas) {
        setDisciplinas(parsedUser.disciplinas); // Atribui as disciplinas se existir
      } else {
        console.log("Nenhuma disciplina encontrada no usuário.");
        setDisciplinas([]); // Caso não tenha disciplinas
      }
    } else {
      console.log("Não foi possível recuperar o usuário.");
    }
  }, []);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-8">
        {disciplinas.length > 0 ? (
          disciplinas.map((disciplina: any) => (
            <Card
              key={disciplina._id} // Chave única para cada cartão
              nomeDisciplina={disciplina.nome}
              fotoPerfil={undefined} // Aqui você pode passar a foto do professor se disponível
              nomeProfessor={disciplina.professores ? disciplina.professores[0] : "Professor Desconhecido"} // Assumindo que o nome do professor esteja dentro de um array
              buttonBgColor="purple" // Ou passe a cor desejada para o botão
              buttonBgColorHover="purple" // Cor do hover
            />
          ))
        ) : (
          <p>Não há disciplinas disponíveis.</p> // Caso não haja disciplinas
        )}
      </div>
    </>
  );
}
