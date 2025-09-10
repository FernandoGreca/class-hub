'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CriarAtividade() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const disciplina = searchParams.get("disciplina") || "";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleCreateAtividade = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");

      // Monta o corpo da requisição com nota fixa em 100
      const novaAtividade = {
        nome,
        descricao,
        nota: 100, // fixo
        data_entrega: new Date(dataEntrega).toISOString(), // formata para ISO
        disciplina, // vindo da query
      };

      const response = await fetch(`${API_BASE_URL}/atividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaAtividade),
      });

      if (!response.ok) throw new Error("Erro ao criar atividade");

      alert("Atividade criada com sucesso!");
      router.push(
        "/dashboard-professor/disciplinas/atividades?disciplina=" +
          encodeURIComponent(disciplina)
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Criar Nova Atividade</h2>

      {/* Campo Nome */}
      <div className="mb-4">
        <label htmlFor="nome-atividade" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Atividade
        </label>
        <input
          type="text"
          id="nome-atividade"
          placeholder="Ex: Tarefa de Matemática ou Projeto de História"
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      {/* Campo Descrição */}
      <div className="mb-4">
        <label htmlFor="descricao-atividade" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao-atividade"
          placeholder="Detalhes sobre a atividade, como requisitos e objetivos."
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>
      </div>

      {/* Campo Data de Entrega */}
      <div className="mb-6">
        <label htmlFor="data-entrega" className="block text-sm font-medium text-gray-700 mb-1">
          Data e Hora de Entrega
        </label>
        <input
          type="datetime-local"
          id="data-entrega"
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => router.back()}
          className="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreateAtividade}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Criar Atividade
        </button>
      </div>
    </div>
  );
}
