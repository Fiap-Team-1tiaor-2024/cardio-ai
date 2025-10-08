"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Activity, Calendar, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/pages/dashboards");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Heart,
      title: "Gestão de Pacientes",
      description: "Controle completo dos dados dos seus pacientes cardíacos",
    },
    {
      icon: Calendar,
      title: "Agendamentos",
      description: "Organize consultas e exames de forma eficiente",
    },
    {
      icon: Activity,
      title: "Dashboard Interativo",
      description: "Visualize métricas e estatísticas em tempo real",
    },
    {
      icon: Users,
      title: "Equipe Médica",
      description: "Colaboração entre profissionais de saúde",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">CardioIA</h1>
          </div>
          <Button onClick={() => router.push("/login")}>
            Acessar Portal
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Portal de Cardiologia
            <span className="block text-blue-600 mt-2">Inteligente e Eficiente</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Gerencie pacientes, agendamentos e visualize dados de forma simples e intuitiva.
            Sistema desenvolvido para profissionais de saúde cardiovascular.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/login")}
            className="text-lg px-8 py-6 flex items-center gap-2 mx-auto"
          >
            Começar Agora
            <ArrowRight size={20} />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6">
            Sobre o CardioIA
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-blue-600">
                Autenticação Segura
              </h4>
              <p className="text-gray-600 mb-4">
                Sistema de autenticação com JWT simulado, garantindo acesso seguro ao portal.
              </p>
              
              <h4 className="font-semibold text-lg mb-3 text-blue-600">
                Dados Simulados
              </h4>
              <p className="text-gray-600">
                Utilize dados de exemplo para explorar todas as funcionalidades do sistema
                sem necessidade de configuração adicional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-blue-600">
                Interface Responsiva
              </h4>
              <p className="text-gray-600 mb-4">
                Acesse de qualquer dispositivo - desktop, tablet ou smartphone.
              </p>
              
              <h4 className="font-semibold text-lg mb-3 text-blue-600">
                Tecnologia Moderna
              </h4>
              <p className="text-gray-600">
                Desenvolvido com React, Next.js e Tailwind CSS para melhor performance
                e experiência do usuário.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Pronto para começar?
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/login")}
            className="text-lg px-8 py-6"
          >
            Fazer Login
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={20} />
            <span className="font-semibold">CardioIA</span>
          </div>
          <p className="text-gray-400 text-sm">
            Portal de Diagnóstico em Cardiologia - 2025
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Sistema desenvolvido para fins educacionais
          </p>
        </div>
      </footer>
    </div>
  );
}
