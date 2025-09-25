// src/components/navbar.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">CardioIA</div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Olá, {user?.name ?? "Usuário"}</span>
        <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-500 text-white text-sm">
          Sair
        </button>
      </div>
    </header>
  );
}
