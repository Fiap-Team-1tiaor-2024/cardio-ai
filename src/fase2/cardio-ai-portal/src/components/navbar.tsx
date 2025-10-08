// src/components/navbar.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="w-full bg-white shadow-sm px-4 md:px-6 py-3 flex justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 hidden md:block">
          Portal CardioIA
        </h1>
        <span className="md:hidden text-lg font-semibold text-gray-800">CardioIA</span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
          <User size={18} className="text-gray-600" />
          <span className="text-sm text-gray-700 hidden md:inline">
            {user?.name ?? "Usuário"}
          </span>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
}

