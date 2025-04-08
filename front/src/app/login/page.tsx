"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        senha,
      });

      const token = response.data.access_token;
      console.log("Token recebido:", response);

      // Salva token no sessionStorage
      sessionStorage.setItem("token", token);

      // Busca os dados do usuário pelo e-mail
      const responseUser = await axios.get(
        `http://localhost:3000/users/encontrar-por-email/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = responseUser.data;
      console.log("Usuário encontrado:", user);

      // Salva o usuário e a role no sessionStorage
      sessionStorage.setItem("User", JSON.stringify(user));
      sessionStorage.setItem("role", user.e_professor ? "professor" : "aluno");

      // Redireciona para o dashboard correto
      if (user.e_professor) {
        router.push("/dashboard-professor");
      } else {
        router.push("/dashboard-aluno");
      }
    } catch (err: any) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Login
        </h2>
        {error && <p className="mt-2 text-center text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
