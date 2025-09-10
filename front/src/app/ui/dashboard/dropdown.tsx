"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'; // Importando o ícone

interface DropdownProps {
  codigoDisciplina: string;
  userType: 'professor' | 'aluno'; // Supondo que você tenha o tipo de usuário como 'professor' ou 'aluno'
}

export default function Dropdown({ codigoDisciplina, userType }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const cancelarInscricao = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const userStr = localStorage.getItem("User") || sessionStorage.getItem("User");
      if (!userStr) {
        console.error("Usuário não encontrado no localStorage");
        return;
      }

      const user = JSON.parse(userStr);
      const id_user = user._id;

      const response = await fetch(`${API_BASE_URL}/users/remover-usuario-disciplina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          id_user,
          codigo_disciplina: codigoDisciplina, // ⚠️ aqui precisa ser o código da disciplina, não o nome
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cancelar inscrição");
      }

      const token = sessionStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      const userRole = sessionStorage.getItem("role") || localStorage.getItem("role");
      const baseURL = userRole === 'professor'
      ? '/dashboard-professor'
      : '/dashboard-aluno';

      router.push(`${baseURL}`);
      setOpen(false);
    }
  };


  // Fechar Dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        className="p-2 cursor-pointer rounded-md hover:bg-[rgba(0,0,0,0.5)] duration-300"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
         <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
      </button>

      {open && (
        <ul className="absolute text-sm mt-2 w-45 bg-white border rounded-md shadow-lg z-[9999]">
          <li>
            <button
              className="w-full text-left font-bold px-4 py-2 hover:bg-red-100 rounded-md text-red-500"
              onClick={cancelarInscricao}
            >
              Cancelar Inscrição
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
