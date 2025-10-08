"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";

export default function DashboardsPage() {
  const { pacientes, agendamentos } = useData();

  // Calcular métricas
  const metricas = useMemo(() => {
    const totalPacientes = pacientes.length;
    const totalAgendamentos = agendamentos.length;
    const agendamentosConfirmados = agendamentos.filter(a => a.status === "Confirmado").length;
    const agendamentosPendentes = agendamentos.filter(a => a.status === "Pendente").length;
    const agendamentosCancelados = agendamentos.filter(a => a.status === "Cancelado").length;
    
    // Agrupar pacientes por condição
    const condicoes: Record<string, number> = {};
    pacientes.forEach(p => {
      condicoes[p.condicao] = (condicoes[p.condicao] || 0) + 1;
    });

    // Agrupar agendamentos por tipo
    const tiposConsulta: Record<string, number> = {};
    agendamentos.forEach(a => {
      tiposConsulta[a.tipo] = (tiposConsulta[a.tipo] || 0) + 1;
    });

    // Média de idade dos pacientes
    const mediaIdade = pacientes.length > 0
      ? Math.round(pacientes.reduce((sum, p) => sum + p.idade, 0) / pacientes.length)
      : 0;

    // Próximos agendamentos (próximos 7 dias)
    const hoje = new Date();
    const proximosAgendamentos = agendamentos.filter(a => {
      const dataAgendamento = new Date(a.data);
      const diffDias = Math.ceil((dataAgendamento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias <= 7;
    }).length;

    return {
      totalPacientes,
      totalAgendamentos,
      agendamentosConfirmados,
      agendamentosPendentes,
      agendamentosCancelados,
      condicoes,
      tiposConsulta,
      mediaIdade,
      proximosAgendamentos,
    };
  }, [pacientes, agendamentos]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.totalPacientes}</div>
            <p className="text-xs text-gray-500 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.totalAgendamentos}</div>
            <p className="text-xs text-gray-500 mt-1">Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metricas.agendamentosConfirmados}</div>
            <p className="text-xs text-gray-500 mt-1">Agendamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{metricas.agendamentosPendentes}</div>
            <p className="text-xs text-gray-500 mt-1">Aguardando confirmação</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metricas.agendamentosCancelados}</div>
            <p className="text-xs text-gray-500 mt-1">Agendamentos cancelados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Próximos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metricas.proximosAgendamentos}</div>
            <p className="text-xs text-gray-500 mt-1">Agendamentos próximos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Média de Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.mediaIdade}</div>
            <p className="text-xs text-gray-500 mt-1">Anos dos pacientes</p>
          </CardContent>
        </Card>
      </div>      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Condição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metricas.condicoes).map(([condicao, count]) => (
                <div key={condicao} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{condicao}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / metricas.totalPacientes) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metricas.tiposConsulta).map(([tipo, count]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tipo}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / metricas.totalAgendamentos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Média de Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{metricas.mediaIdade} anos</div>
            <p className="text-sm text-gray-500 mt-2">Idade média dos pacientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{metricas.proximosAgendamentos}</div>
            <p className="text-sm text-gray-500 mt-2">Agendamentos na próxima semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Confirmação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {metricas.totalAgendamentos > 0
                ? Math.round((metricas.agendamentosConfirmados / metricas.totalAgendamentos) * 100)
                : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-2">Agendamentos confirmados vs total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

