// src/contexts/DataContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import pacientesData from "@/data/pacientes.json";
import agendamentosData from "@/data/agendamentos.json";

export type Paciente = {
  id: number;
  nome: string;
  idade: number;
  email: string;
  telefone: string;
  condicao: string;
  dataCadastro: string;
  ultimaConsulta: string;
};

export type Agendamento = {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  data: string;
  horario: string;
  tipo: string;
  medico: string;
  status: string;
};

type DataContextType = {
  pacientes: Paciente[];
  agendamentos: Agendamento[];
  addAgendamento: (agendamento: Omit<Agendamento, "id">) => void;
  updateAgendamento: (id: number, agendamento: Partial<Agendamento>) => void;
  deleteAgendamento: (id: number) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    // Simula carregamento de dados
    setPacientes(pacientesData as Paciente[]);
    setAgendamentos(agendamentosData as Agendamento[]);
  }, []);

  const addAgendamento = (agendamento: Omit<Agendamento, "id">) => {
    const newId = agendamentos.length > 0 
      ? Math.max(...agendamentos.map(a => a.id)) + 1 
      : 1;
    const newAgendamento = { ...agendamento, id: newId };
    setAgendamentos([...agendamentos, newAgendamento]);
  };

  const updateAgendamento = (id: number, updates: Partial<Agendamento>) => {
    setAgendamentos(agendamentos.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  };

  const deleteAgendamento = (id: number) => {
    setAgendamentos(agendamentos.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider 
      value={{ 
        pacientes, 
        agendamentos, 
        addAgendamento,
        updateAgendamento,
        deleteAgendamento
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
