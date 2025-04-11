"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);

  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [anoCadastro, setAnoCadastro] = useState(1);
  const [mensagemCadastro, setMensagemCadastro] = useState("");

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
      sessionStorage.setItem("token", token);

      const responseUser = await axios.get(
        `http://localhost:3000/users/encontrar-por-email/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = responseUser.data;
      sessionStorage.setItem("User", JSON.stringify(user));
      sessionStorage.setItem("userId", user._id);
      sessionStorage.setItem("role", user.e_professor ? "professor" : "aluno");

      if (user.e_professor) {
        router.push("/dashboard-professor");
      } else {
        router.push("/dashboard-aluno");
      }
    } catch (err: any) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/cadastro-usuario", {
        nome: nomeCadastro,
        email: emailCadastro,
        senha: senhaCadastro,
        ano: Number(anoCadastro),
        e_professor: false,
      });

      setMensagemCadastro("Cadastro realizado com sucesso!");
      setNomeCadastro("");
      setEmailCadastro("");
      setSenhaCadastro("");
      setAnoCadastro(1);

      setTimeout(() => {
        setShowCadastro(false);
        setMensagemCadastro("");
      }, 2000);
    } catch (err) {
      setMensagemCadastro("Erro ao cadastrar. Verifique os dados.");
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
            className=" cursor-pointer w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => setShowCadastro(true)}
          className=" cursor-pointer mt-4 w-full text-blue-600 hover:underline"
        >
          Cadastre-se
        </button>
      </div>

      {showCadastro && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <button
        onClick={() => setShowCadastro(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      <h3 className="text-xl font-semibold mb-4 text-center">Cadastro</h3>
      <form onSubmit={handleCadastro} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nomeCadastro}
            onChange={(e) => setNomeCadastro(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={emailCadastro}
            onChange={(e) => setEmailCadastro(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            placeholder="Digite uma senha"
            value={senhaCadastro}
            onChange={(e) => setSenhaCadastro(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ano de Ingresso</label>
          <input
            type="number"
            placeholder="Ex: 2024"
            value={anoCadastro}
            onChange={(e) => setAnoCadastro(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Cadastrar
        </button>
        {mensagemCadastro && (
          <p className="text-center text-sm mt-2">{mensagemCadastro}</p>
        )}
      </form>
    </div>
  </div>
)}
    </div>
  );
}
