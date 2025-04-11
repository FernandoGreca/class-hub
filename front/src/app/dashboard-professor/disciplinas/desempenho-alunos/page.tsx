'use client';
import { useEffect, useState } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function RelatorioAlunos() {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [relatorio, setRelatorio] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("User") || "{}") : null;
  const userId = user?._id || null;

  useEffect(() => {
    if (!userId || !token) return;
  
    fetch(`http://localhost:3000/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async (data) => {
        const disciplinasUser = await Promise.all(
          data.disciplinas.map(async (disciplina: any) => {
            const res = await fetch(`http://localhost:3000/disciplinas/${disciplina.codigo_disciplina}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
          })
        );
  
        // ✅ Removendo duplicadas com base no código da disciplina
        const disciplinasUnicas = disciplinasUser.reduce((acc: any[], curr: any) => {
          const existe = acc.some(d => d.codigo_disciplina === curr.codigo_disciplina);
          if (!existe) acc.push(curr);
          return acc;
        }, []);
  
        setDisciplinas(disciplinasUnicas);
      });
  }, [userId, token]);

  const carregarRelatorio = async (codigo_disciplina: string, alunos: any[]) => {
    const relatorioCompleto = await Promise.all(
      alunos.map(async (aluno: any) => {
        const mediaRes = await fetch(`http://localhost:3000/disciplinas/media-nota-aluno/${codigo_disciplina}/${aluno._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const presencaRes = await fetch(`http://localhost:3000/presencas/lista-presenca-aluno/${codigo_disciplina}/${aluno._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const mediaData = await mediaRes.json();
        const presencaData = await presencaRes.json();
  
        const presencas = Array.isArray(presencaData) ? presencaData : presencaData.presencas || [];
  
        const totalPresencas = presencas.length;
        const totalPresentes = presencas.filter((p: any) => p.presenca === true).length;
        const percentualPresenca = totalPresencas > 0 ? Math.round((totalPresentes / totalPresencas) * 100) : 0;
  
        let situacao = "Aprovado";
        if (mediaData.media < 70 && percentualPresenca >= 75) {
          situacao = "Reprovado por nota";
        } else if (mediaData.media >= 70 && percentualPresenca < 75) {
          situacao = "Reprovado por falta";
        } else if (mediaData.media < 70 && percentualPresenca < 75) {
          situacao = "Reprovado";
        }
  
        return {
          id: aluno._id,
          nome: aluno.nome,
          media: mediaData.media ?? 0,
          presenca: percentualPresenca,
          situacao
        };
      })
    );
  
    setRelatorio(relatorioCompleto);
  };

  const handleDisciplinaChange = async (codigo: string) => {
    setDisciplinaSelecionada(codigo);
    const disciplina = disciplinas.find((d) => d.codigo_disciplina === codigo);
    const alunos = disciplina?.alunos || [];
    setAlunos(alunos);
    await carregarRelatorio(codigo, alunos);
  };

  const alunosFiltrados = relatorio.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-center sm:text-left flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6 text-blue-600" />
        Relatório de Alunos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={disciplinaSelecionada}
          onChange={(e) => handleDisciplinaChange(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.codigo_disciplina} value={disciplina.codigo_disciplina}>
              {disciplina.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 font-bold text-black border-b pb-2 mb-2">
        <span>Aluno</span>
        <span>Média</span>
        <span>Presença</span>
        <span>Situação</span>
      </div>

      {alunosFiltrados.map((aluno) => (
        <div key={aluno.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center mb-3">
          <span>{aluno.nome}</span>
          <span>{aluno.media}</span>
          <span>{aluno.presenca}%</span>
          <span className={aluno.situacao === "Aprovado" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {aluno.situacao}
          </span>
        </div>
      ))}
    </div>
  );
}
