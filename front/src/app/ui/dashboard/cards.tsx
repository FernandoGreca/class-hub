"use client";
import { useRouter } from "next/navigation";
import Dropdown from "./dropdown";
import { useState, useEffect } from "react";

const colorMapping: Record<string, string> = {
  red: "bg-red-800",
  blue: "bg-blue-800",
  green: "bg-green-800",
  yellow: "bg-yellow-500",
  purple: "bg-purple-800",
  orange: "bg-orange-500",
  pink: "bg-pink-800",
  gray: "bg-gray-800",
};

const colorMappingHover: Record<string, string> = {
  red: "hover:bg-red-700",
  blue: "hover:bg-blue-700",
  green: "hover:bg-green-700",
  yellow: "hover:bg-yellow-400",
  purple: "hover:bg-purple-700",
  orange: "hover:bg-orange-400",
  pink: "hover:bg-pink-700",
  gray: "hover:bg-gray-700",
};

interface CardProps {
  nomeDisciplina: string;
  fotoPerfil?: string;
  nomeProfessor: string;
  buttonBgColor?: string;
  buttonBgColorHover?: string;
  onClick?: () => void;
  
}

export default function Card({
  nomeDisciplina,
  fotoPerfil,
  nomeProfessor,
  buttonBgColor = "gray",
  buttonBgColorHover = "gray",
  onClick, // Adicionando o onClick
}: CardProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(sessionStorage.getItem("role") ?? null);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const irParaAtividades = () => {
    const storedRole = sessionStorage.getItem("role");
    if (!storedRole) return;
  
    const basePath =
      storedRole === "professor"
        ? "/dashboard-professor/disciplinas/atividades"
        : "/dashboard-aluno/disciplinas/atividades";
  
    router.push(`${basePath}?disciplina=${encodeURIComponent(nomeDisciplina)}`);
  };
  
 
  return (
    <div className="relative will-change-transform transition-transform duration-300 ease-in-out hover:scale-105">
      <div
        className={`w-72 h-50 bg-white rounded-lg shadow-md border transition-transform transform-gpu flex flex-col justify-between ${isMobile ? "cursor-pointer" : ""}`}
        onClick={isMobile ? onClick : undefined}
      >
       <button
  className={`w-full cursor-pointer rounded-t-lg text-center ${colorMapping[buttonBgColor] || "bg-gray-800"} ${colorMappingHover[buttonBgColorHover] || "hover:bg-gray-700"}`}
  onClick={irParaAtividades} // Chama a função de navegação
>
  <div className="flex justify-center text-white p-4 rounded-t-lg relative">
    <h2 className="text-lg font-semibold truncate max-w-[calc(100%-4.5rem)]">
      {nomeDisciplina}
    </h2>
  </div>
</button>

        <div className="relative p-4 flex-grow">
          <img src={fotoPerfil || "/fotoPerfil.jpeg"} alt="Foto Perfil" className="w-16 h-14 rounded-full absolute -top-7 right-3 shadow" />
          <p className="text-gray-700 font-bold mt-4">{nomeProfessor}</p>
        </div>

        {role === "professor" && (
          <div className="p-4 flex justify-center">
            <button onClick={onClick} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Ver Atividades
            </button>
          </div>
        )}

        <div className="absolute top-2 left-2 z-[9999]">
          <Dropdown nomeDisciplina={nomeDisciplina} userType={"professor"} />
        </div>
      </div>
    </div>
  );
}