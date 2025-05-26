"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarDisciplina() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(0);
  const [codigoDisciplina, setCodigoDisciplina] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  const handleCadastrarDisciplina = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("User") || "{}");

      if (!token || !user?._id) throw new Error("Usuário não autenticado.");

      const novaDisciplina = {
        nome,
        descricao,
        carga_horaria: Number(cargaHoraria),
        codigo_disciplina: codigoDisciplina,
        professores: [user._id], // Atrelando ao professor
      };

      // 1. Cria a nova disciplina
      const response = await fetch(`${API_BASE_URL}/disciplinas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaDisciplina),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar disciplina");

      // 2. Associa a disciplina ao usuário (professor)
      const associar = await fetch(
        `${API_BASE_URL}/users/adicionar-usuario-disciplina`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_user: user._id,
            codigo_disciplina: codigoDisciplina,
          }),
        }
      );

      if (!associar.ok)
        throw new Error("Erro ao associar disciplina ao professor");

      // 3. Atualiza os dados do professor no sessionStorage
      const usuarioAtualizado = await fetch(
        `${API_BASE_URL}/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!usuarioAtualizado.ok)
        throw new Error("Erro ao buscar usuário atualizado");

      const dadosAtualizados = await usuarioAtualizado.json();
      sessionStorage.setItem("User", JSON.stringify(dadosAtualizados));

      alert("Disciplina cadastrada e associada com sucesso!");
      router.push("/dashboard-professor");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro desconhecido.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Cadastrar Nova Disciplina</h2>

      <input
        type="text"
        placeholder="Nome da Disciplina"
        className="w-full mb-2 p-2 border rounded"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        className="w-full mb-2 p-2 border rounded"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      ></textarea>

      <input
        type="number"
        placeholder="Carga Horária"
        className="w-full mb-2 p-2 border rounded"
        value={cargaHoraria}
        onChange={(e) => setCargaHoraria(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="Código da Disciplina. Ex: aux-039"
        className="w-full mb-4 p-2 border rounded"
        value={codigoDisciplina}
        onChange={(e) => setCodigoDisciplina(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => router.back()}
          className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleCadastrarDisciplina}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
