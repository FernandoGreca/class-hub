// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface Pessoa {
//   id: string;
//   nome: string;
//   fotoPerfil?: string;
// }

// export default function PessoasPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [professores, setProfessores] = useState<Pessoa[]>([]);
//   const [colegas, setColegas] = useState<Pessoa[]>([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     async function fetchData() {
//       try {
//         const resProf = await fetch("/api/professores", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const resCol = await fetch("/api/colegas", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!resProf.ok || !resCol.ok) throw new Error("Erro ao buscar dados");

//         setProfessores(await resProf.json());
//         setColegas(await resCol.json());
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, [router]);

//   if (isLoading) return <p>Carregando...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Professores</h2>
//       <div className="border-b pb-4">
//         {professores.map((prof) => (
//           <div key={prof.id} className="flex items-center space-x-3 mb-2">
//             {prof.fotoPerfil ? (
//               <img
//                 src={prof.fotoPerfil}
//                 alt={prof.nome}
//                 className="w-8 h-8 rounded-full"
//               />
//             ) : (
//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 {prof.nome.charAt(0).toUpperCase()}
//               </div>
//             )}
//             <span>{prof.nome}</span>
//           </div>
//         ))}
//       </div>
      
//       <h2 className="text-2xl font-semibold mt-6 mb-4">Colegas de turma</h2>
//       <div className="border-b pb-4">
//         <p className="text-gray-500 mb-2">{colegas.length} estudantes</p>
//         {colegas.map((colega) => (
//           <div key={colega.id} className="flex items-center space-x-3 mb-2">
//             <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
//               {colega.nome.charAt(0).toUpperCase()}
//             </div>
//             <span>{colega.nome}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// TENTATIVA COM BACK

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Pessoa {
  id: string;
  nome: string;
  fotoPerfil?: string;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [professores, setProfessores] = useState<Pessoa[]>([]);
  const [colegas, setColegas] = useState<Pessoa[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Dados mockados
    const professoresMock: Pessoa[] = [
      { id: "1", nome: "João Silva", fotoPerfil: "" },
      { id: "2", nome: "Maria Oliveira", fotoPerfil: "" },
    ];

    const colegasMock: Pessoa[] = [
      { id: "3", nome: "Carlos Santos" },
      { id: "4", nome: "Ana Souza" },
      { id: "5", nome: "Beatriz Lima" },
    ];

    setProfessores(professoresMock);
    setColegas(colegasMock);
    setIsLoading(false);
  }, [router]);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="p-6 shadow-md bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Seus Professores</h2>
      <div className="border-b pb-4">
      <p className="text-gray-500 mb-2">{professores.length} professores</p>

        {professores.map((prof) => (
          <div key={prof.id} className="flex items-center space-x-3 mb-2">
            {prof.fotoPerfil ? (
              <img
                src={prof.fotoPerfil}
                alt={prof.nome}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {prof.nome.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{prof.nome}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold  mt-6 mb-4">Colegas de suas disciplinas</h2>
      <div className="pb-4">
        <p className="text-gray-500 mb-2">{colegas.length} estudantes</p>
        {colegas.map((colega) => (
          <div key={colega.id} className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              {colega.nome.charAt(0).toUpperCase()}
            </div>
            <span>{colega.nome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

