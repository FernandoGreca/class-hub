'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CriarAtividade() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const disciplina = searchParams.get("disciplina") || "";

    const [atividade, setAtividade] = useState({
        nome: "",
        descricao: "",
        nota: 0,
        data_entrega: "",
        disciplina,
    });

    const handleCreateAtividade = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("http://localhost:3000/atividades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(atividade),
            });

            if (!response.ok) throw new Error("Erro ao criar atividade");

            alert("Atividade criada com sucesso!");
            router.push("/dashboard-professor/disciplinas/atividades?disciplina=" + encodeURIComponent(disciplina));
        } catch (error) {
            alert(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-semibold mb-4">Criar Nova Atividade</h2>
            <input 
                type="text" 
                placeholder="Nome" 
                className="w-full mb-2 p-2 border rounded" 
                onChange={(e) => setAtividade({ ...atividade, nome: e.target.value })} 
            />
            <textarea 
                placeholder="Descrição" 
                className="w-full mb-2 p-2 border rounded" 
                onChange={(e) => setAtividade({ ...atividade, descricao: e.target.value })} 
            ></textarea>
            <input 
                type="number" 
                placeholder="Nota" 
                className="w-full mb-2 p-2 border rounded" 
                onChange={(e) => setAtividade({ ...atividade, nota: Number(e.target.value) || 0 })}
            />
            <input 
                type="date" 
                className="w-full mb-2 p-2 border rounded" 
                onChange={(e) => setAtividade({ ...atividade, data_entrega: e.target.value })} 
            />
            <div className="flex justify-end gap-2">
                <button onClick={   () => router.back()} className="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                <button onClick={handleCreateAtividade} className=" cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">Criar</button>
            </div>
        </div>
    );
}
