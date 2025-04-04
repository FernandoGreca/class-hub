'use client';

import {
  HomeIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function NavLinks({ isMobile }: { isMobile: boolean }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Definição dinâmica dos links baseados na role
  const links = role === "professor" ? [
    { name: 'Home', href: '/dashboard-professor', icon: HomeIcon },
    { name: 'Minhas Disciplinas', href: '/dashboard-professor/disciplinas', icon: DocumentDuplicateIcon },
    { name: 'Atividades', href: '/dashboard-professor/disciplinas/atividades', icon: ClipboardDocumentListIcon },
    { name: 'Lançar Notas', href: '/dashboard-professor/disciplinas/atividades/inserir-nota-aluno-atividade', icon: AcademicCapIcon },
    { name: 'Fazer Chamada', href: '/dashboard-professor/disciplinas/presenca', icon: ArrowRightStartOnRectangleIcon },
    { name: 'Relatório de Aunos', href: '/dashboard-professor/disciplinas/desempenho-alunos', icon:ChartBarIcon },
    { name: 'Pessoas', href: '/dashboard-professor/disciplinas/pessoas', icon: UsersIcon }
  ] : [
    { name: 'Home', href: '/dashboard-aluno', icon: HomeIcon },
    { name: 'Disciplinas', href: '/dashboard-aluno/disciplinas', icon: DocumentDuplicateIcon },
    { name: 'Atividades', href: '/dashboard-aluno/disciplinas/atividades', icon: CheckCircleIcon },
    { name: 'Pessoas', href: '/dashboard-aluno/disciplinas/pessoas', icon: UsersIcon }
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className={isMobile ? "block" : "hidden md:block"}>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
