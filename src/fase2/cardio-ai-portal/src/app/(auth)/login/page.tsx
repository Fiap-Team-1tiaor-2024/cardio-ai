// src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">CardioIA</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <Input value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" placeholder="Senha" />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
