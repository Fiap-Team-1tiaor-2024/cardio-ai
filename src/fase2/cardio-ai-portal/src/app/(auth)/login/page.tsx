// src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/pages/dashboards");
    } catch (err) {
      setError("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    router.replace("/pages/dashboards");
    return null;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Heart className="text-blue-600" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">CardioIA</h1>
            <p className="text-gray-600">Portal de Cardiologia</p>
          </div>

          {/* Formulário */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={18} />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Informações de demonstração */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              💡 Sistema de Demonstração
            </p>
            <p className="text-xs text-blue-700">
              Use qualquer email e senha para acessar o portal. Este é um sistema simulado
              para fins educacionais.
            </p>
          </div>

          {/* Link para voltar */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              ← Voltar para página inicial
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          CardioIA &copy; 2025 - Portal Educacional
        </p>
      </div>
    </main>
  );
}

