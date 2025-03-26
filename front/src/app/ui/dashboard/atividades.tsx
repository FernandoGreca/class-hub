'use client';
import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function Atividades() {
    const searchParams = useSearchParams();
    const disciplinaAtual = searchParams.get("disciplina"); // Pega a disciplina da URL
    const [mostrarAtividades, setMostrarAtividades] = useState(true);

    const todasAtividades = [
        {
            titulo: "Avaliação diagnóstica",
            disciplina: "Matemática",
            data: "terça-feira, 11 de fev."
        },
        { 
            titulo: "Trabalho 1", 
            disciplina: "Matemática", 
            data: "Quarta-feira, 12 de fev." 
        },
        { 
            titulo: "Trabalho Final", 
            disciplina: "Matemática", 
            data: "Quinta-feira, 03 de abril" 
        },
        { 
            titulo: "Prova 1", 
            disciplina: "Matemática", 
            data: "Segunda-feira, 01 de abril" 
        },
        { 
            titulo: "Prova 2", 
            disciplina: "Física", 
            data: "Sexta-feira, 15 de março" 
        },
    ];

    // Filtra as atividades apenas da disciplina atual
    const atividades = disciplinaAtual
        ? todasAtividades.filter(a => a.disciplina.toLowerCase() === disciplinaAtual.toLowerCase())
        : todasAtividades; 

    return (
        <div className="w-full mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
            <button onClick={() => setMostrarAtividades(!mostrarAtividades)} className="w-full text-blue-500 cursor-pointer flex items-center">
                <div className="w-full flex justify-between items-center text-gray-700 font-semibold border-b pb-2">
                    <span>Atividades de {disciplinaAtual || "todas as disciplinas"}</span>
                    <span>{atividades.length}</span>
                </div>
            </button>

            {!mostrarAtividades && (
                <ul className="mt-2">
                    {atividades.length > 0 ? (
                        atividades.map((atividade, index) => (
                            <li key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <ClipboardDocumentIcon className="w-5 h-5 text-gray-700" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{atividade.titulo}</p>
                                    <p className="text-gray-600 text-sm">{atividade.disciplina}</p>
                                    <p className="text-gray-500 text-xs">Data de entrega: {atividade.data}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center mt-4">Nenhuma atividade encontrada para {disciplinaAtual}.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
