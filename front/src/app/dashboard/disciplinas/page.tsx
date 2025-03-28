"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redireciona para login se não tiver token
    } else {
      setIsLoading(false); // Permite renderizar a página
    }
  }, []);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-8">
      {/* {disciplinas.length > 0 ? (
                    disciplinas.map((disciplina) => (<Card nomeDisciplina={disciplina.nome} fotoPerfil={undefined} nomeProfessor={disciplina.professores[0]} buttonBgColor="purple" buttonBgColorHover="purple" />)} */}
        
        <Card nomeDisciplina={"aux-039"} fotoPerfil={undefined} nomeProfessor={"Bruna Sozzo"} buttonBgColor="purple" buttonBgColorHover="purple"  />
        <Card nomeDisciplina={"Física"} fotoPerfil={undefined} nomeProfessor={"Mario Akihita"}  />
        <Card nomeDisciplina={"Sociologia"} fotoPerfil={undefined} nomeProfessor={"Wilson Sanches"} buttonBgColor="blue" buttonBgColorHover="blue" />
        <Card nomeDisciplina={"Ciências"} fotoPerfil={undefined} nomeProfessor={"Luiz Nunes"} buttonBgColor="green" buttonBgColorHover="green" />
        <Card nomeDisciplina={"Português"} fotoPerfil={undefined} nomeProfessor={"Felipe Akryghti"} buttonBgColor="red" buttonBgColorHover="red" />
        <Card nomeDisciplina={"Geografia"} fotoPerfil={undefined} nomeProfessor={"Fernando Greca"} buttonBgColor="orange" buttonBgColorHover="orange" />
      </div>
    </>
  );
}

