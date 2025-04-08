'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Presenca {
  _id: string;
  data: string;
  presenca: boolean;
  codigo_disciplina: string;
  id_aluno: string;
}

export default function HistoricoFaltaAluno() {
  const searchParams = useSearchParams();
  const codigoDisciplina = searchParams.get('codigo');

  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [datasDisponiveis, setDatasDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Corrige o horário para UTC-3 (Brasília)
  const ajustarParaBrasilia = (data: string | Date): Date => {
    const date = new Date(data);
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
  };

  // ✅ Formata data em 'YYYY-MM-DD' considerando fuso
  const formatarData = (data: string | Date): string => {
    try {
      const dataAjustada = ajustarParaBrasilia(data);
      return dataAjustada.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const idAluno = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    if (!codigoDisciplina || !idAluno || !token) return;

    const buscarPresencas = async () => {
      try {
        const res = await fetch(`http://localhost:3000/presencas/lista-presenca-aluno/${codigoDisciplina}/${idAluno}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dados: Presenca[] = await res.json();

        const datasUnicas = Array.from(new Set(
          dados.map(p => formatarData(p.data)).filter(Boolean)
        )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        setPresencas(dados);
        setDatasDisponiveis(datasUnicas);
        setDataSelecionada(datasUnicas[0] || '');
      } catch (erro) {
        console.error("Erro ao buscar presenças do aluno:", erro);
      } finally {
        setLoading(false);
      }
    };

    buscarPresencas();
  }, [codigoDisciplina]);

  const presencasFiltradas = presencas.filter(
    (p) => formatarData(p.data) === dataSelecionada
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Histórico de Presença</h1>

      {!codigoDisciplina && <p className="text-red-500">Código da disciplina não informado.</p>}
      {loading && <p>Carregando presenças...</p>}

      {!loading && datasDisponiveis.length > 0 && (
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
      )}

      {!loading && dataSelecionada && presencasFiltradas.length > 0 && (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-blue-600 border-2 border-black text-white">
              <th className="p-3 border">Data</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {presencasFiltradas.map((p) => (
              <tr key={p._id}>
                <td className="p-2 border">{ajustarParaBrasilia(p.data).toLocaleDateString('pt-BR')}</td>
                <td className="p-2 border">{p.presenca ? 'Presente' : 'Faltou'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && dataSelecionada && presencasFiltradas.length === 0 && (
        <p className="text-gray-600">Nenhuma presença registrada para essa data.</p>
      )}
    </div>
  );
}
