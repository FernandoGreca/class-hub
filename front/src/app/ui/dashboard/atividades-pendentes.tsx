import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface Atividade {
  disciplina: string;
  descricao: string;
  data_entrega: string;
  nota: number;
  nota_aluno: number | null;
}

interface Props {
  atividades: Atividade[];
}

export default function AtividadesPendentes({ atividades }: Props) {
  // Filtrando apenas as atividades atrasadas e não entregues
  const atividadesPendentes = atividades.filter(
    (atividade) => new Date(atividade.data_entrega) < new Date() && atividade.nota_aluno === null
  );

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Atividades Pendentes</h2>
        <span className="text-sm font-bold">{atividadesPendentes.length}</span>
      </div>

      <ul className="mt-2">
        {atividadesPendentes.length > 0 ? (
          atividadesPendentes.map((atividade, index) => (
            <li
              key={index}
              className="flex items-start mt-3 space-x-3 p-3 rounded-lg shadow hover:bg-gray-300 cursor-pointer transition"
            >
              {/* Ícone */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-700" />
              </div>

              {/* Informações da atividade */}
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{atividade.descricao}</p>
                <p className="text-gray-600 text-sm">Disciplina: {atividade.disciplina}</p>
                <p className="text-gray-500 text-xs">
                  Data de entrega: {new Date(atividade.data_entrega).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-red-600 text-xs font-bold">Não entregue!</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-4">Nenhuma atividade pendente</p>
        )}
      </ul>
    </div>
  );
}
