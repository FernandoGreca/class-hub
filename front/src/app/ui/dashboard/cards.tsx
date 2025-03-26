"use client";
import { useRouter } from "next/navigation";

// Mapeamento de cores
const colorMapping: Record<string, string> = {
    red: "bg-red-800",
    blue: "bg-blue-800",
    green: "bg-green-800",
    yellow: "bg-yellow-500",
    purple: "bg-purple-800",
    orange: "bg-orange-500",
    pink: "bg-pink-800",
    gray: "bg-gray-800", // Você pode adicionar mais cores aqui
};
const colorMappingHover: Record<string, string> = {
    red: "hover:bg-red-700",
    blue: "hover:bg-blue-700",
    green: "hover:bg-green-700",
    yellow: "hover:bg-yellow-400",
    purple: "hover:bg-purple-700",
    orange: "hover:bg-orange-400",
    pink: "hover:bg-pink-700",
    gray: "hover:bg-gray-700", // Você pode adicionar mais cores aqui
};

interface CardProps {
    nomeDisciplina: string;
    fotoPerfil?: string; // Opcional
    nomeProfessor: string;
    buttonBgColor?: string; // Novo parâmetro para a cor do fundo do botão
    buttonBgColorHover?: string; // Novo parâmetro para a cor do fundo do botão
}

export default function Card({ nomeDisciplina, fotoPerfil, nomeProfessor, buttonBgColor = "gray", buttonBgColorHover = "gray" }: CardProps) {
    const router = useRouter();

    const irParaAtividades = () => {
        router.push(`/dashboard/disciplinas/atividades?disciplina=${encodeURIComponent(nomeDisciplina)}`);
    };

    return (
        <div className="w-72 bg-white rounded-lg shadow-md border transition-transform hover:scale-105" onClick={irParaAtividades}>
            <button className={`w-full cursor-pointer rounded-t-lg text-center bg-gray-800 hover:bg-gray-700`} onClick={irParaAtividades}>
                <div className="flex justify-center text-white p-4 rounded-t-lg relative">
                    <h2 className="text-lg font-semibold truncate max-w-[calc(100%-4.5rem)]">{nomeDisciplina}</h2>
                </div>
            </button>
            <div className="relative p-4">
                <img src={fotoPerfil || "/fotoPerfil.jpeg"} alt="Foto Perfil" className="w-16 h-14 rounded-full absolute -top-7 right-3 shadow" />
                <p className="text-gray-700 font-bold mt-4">{nomeProfessor}</p>
            </div>
            <div className="flex justify-between p-4 border-t">
                <button className="hidden md:block text-gray-500 text-xs text-red-500 border-1 p-1 bg-red-100 hover:text-red-700 cursor-pointer hover:text-gray-700">Cancelar Inscrição</button>
            </div>
        </div>
    );
}
