"use client";

import { useState } from "react";
import axios from "axios";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function IngressarDisciplina() {
  const [showModal, setShowModal] = useState(false);
  const [codigoDisciplina, setCodigoDisciplina] = useState("");
  const [mensagem, setMensagem] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  const handleAdicionar = async () => {
    const id_user = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!id_user || !codigoDisciplina || !token) {
      setMensagem("Preencha o código da disciplina.");
      return;
    }

    try {
      // Adiciona o usuário na disciplina
      await axios.post(
        `${API_BASE_URL}/users/adicionar-usuario-disciplina`,
        {
          id_user,
          codigo_disciplina: codigoDisciplina,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atualiza os dados do usuário no sessionStorage
      const responseUser = await axios.get(`${API_BASE_URL}/users/${id_user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = responseUser.data;
      sessionStorage.setItem("User", JSON.stringify(updatedUser));

      setMensagem("Disciplina adicionada com sucesso!");
      setCodigoDisciplina("");

      // Fecha o modal e atualiza a tela
      setTimeout(() => {
        setShowModal(false);
        setMensagem("");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao ingressar na disciplina:", error);
      setMensagem("Erro ao ingressar na disciplina.");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <PlusIcon className="w-6 h-6" />
        Ingressar em uma disciplina
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">
              Ingressar em uma disciplina
            </h3>

            <label className="block text-sm text-gray-700 mb-1">
              Código da Disciplina
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={codigoDisciplina}
              onChange={(e) => setCodigoDisciplina(e.target.value)}
            />

            {mensagem && (
              <p className="mb-2 text-sm text-center text-blue-600">
                {mensagem}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setMensagem("");
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleAdicionar}
              >
                Ingressar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
