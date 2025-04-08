'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Presenca {
  _id: string;
  data: string;
  presenca: boolean;
  codigo_disciplina: string;
  id_aluno: string;
  nome_aluno?: string;
}

interface Aluno {
  _id: string;
  nome: string;
}

export default function PresencasRegistradas() {
  const searchParams = useSearchParams();
  const codigoDisciplina = searchParams.get('codigo');

  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [datasDisponiveis, setDatasDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Função que ajusta para o fuso de Brasília (UTC-3)
  const ajustarParaBrasilia = (data: string | Date): Date => {
    const date = new Date(data);
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
  };

  // ✅ Retorna a data formatada como 'YYYY-MM-DD'
  const formatarData = (data: string | Date): string => {
    try {
      const dataAjustada = ajustarParaBrasilia(data);
      return dataAjustada.toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (!codigoDisciplina) return;

    const fetchPresencasEAlunos = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const resPresencas = await fetch(`http://localhost:3000/presencas/lista-presenca-disciplina/${codigoDisciplina}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dadosPresencas = await resPresencas.json();

        const presencasArray: Presenca[] = Array.isArray(dadosPresencas) ? dadosPresencas : [];

        if (presencasArray.length === 0) {
          setDatasDisponiveis([]);
          setPresencas([]);
          setDataSelecionada('');
          return;
        }

        const resDisciplina = await fetch(`http://localhost:3000/disciplinas/${codigoDisciplina}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dadosDisciplina = await resDisciplina.json();
        const alunos: Aluno[] = dadosDisciplina.alunos || [];

        const presencasComNome = presencasArray.map((p) => {
          const aluno = alunos.find((a) => a._id === p.id_aluno);
          return {
            ...p,
            nome_aluno: aluno?.nome || p.id_aluno,
          };
        });

        const datasUnicas = Array.from(new Set(
          presencasComNome
            .map(p => formatarData(p.data))
            .filter((d): d is string => d !== '')
        )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        setPresencas(presencasComNome);
        setDatasDisponiveis(datasUnicas);
        setDataSelecionada(datasUnicas[0] || '');
      } catch (error) {
        console.error("❌ Erro ao buscar presenças:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresencasEAlunos();
  }, [codigoDisciplina]);

  const presencasFiltradas = (() => {
    const porData = presencas.filter(
      (p) => formatarData(p.data) === dataSelecionada
    );

    const porAluno: Record<string, Presenca> = {};
    for (const p of porData) {
      const atual = porAluno[p.id_aluno];
      if (!atual || new Date(p.data) > new Date(atual.data)) {
        porAluno[p.id_aluno] = p;
      }
    }

    return Object.values(porAluno);
  })();

  if (!codigoDisciplina) return <p className="text-red-500">Código da disciplina não informado.</p>;
  if (loading) return <p>Carregando presenças...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Presenças Registradas</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Selecione uma data:</label>
        <select
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          {datasDisponiveis.map((dataIso) => (
            <option key={dataIso} value={dataIso}>
              {ajustarParaBrasilia(dataIso).toLocaleDateString('pt-BR')}
            </option>
          ))}
        </select>
      </div>

      {presencasFiltradas.length > 0 ? (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-blue-600 text-white border-2 border-black">
              <th className="p-3 border">Aluno</th>
              <th className="p-3 border">Data</th>
              <th className="p-3 border">Presença</th>
            </tr>
          </thead>
          <tbody>
            {presencasFiltradas.map((p) => (
              <tr key={p._id}>
                <td className="p-2 border">{p.nome_aluno}</td>
                <td className="p-2 border">{ajustarParaBrasilia(p.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-2 border">{p.presenca ? 'Presente' : 'Faltou'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Nenhuma presença registrada para essa data.</p>
      )}
    </div>
  );
}
