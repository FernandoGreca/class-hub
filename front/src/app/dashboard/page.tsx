"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/ui/dashboard/cards";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redireciona para login se não tiver token
    } else {
      setIsLoading(false); // Permite renderizar a página
    }
  }, []);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="">Bem vindo ao dashboard</div>
    </>
  );
}

