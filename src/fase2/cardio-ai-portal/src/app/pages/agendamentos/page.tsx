"use client";

import React, { useReducer, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import { Check, X, Trash2 } from "lucide-react";

// Estado do formulário
type FormState = {
  pacienteId: string;
  pacienteNome: string;
  data: string;
  horario: string;
  tipo: string;
  medico: string;
  status: string;
};

// Ações do reducer
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

// Reducer para gerenciar o estado do formulário
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return {
        pacienteId: "",
        pacienteNome: "",
        data: "",
        horario: "",
        tipo: "",
        medico: "",
        status: "Pendente",
      };
    default:
      return state;
  }
}

const initialState: FormState = {
  pacienteId: "",
  pacienteNome: "",
  data: "",
  horario: "",
  tipo: "",
  medico: "",
  status: "Pendente",
};

export default function AgendamentosPage() {
  const { agendamentos, pacientes, addAgendamento, updateAgendamento, deleteAgendamento } = useData();
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações simples
    if (!formState.pacienteId || !formState.data || !formState.horario || !formState.tipo || !formState.medico) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Buscar nome do paciente
    const paciente = pacientes.find(p => p.id === parseInt(formState.pacienteId));
    if (!paciente) {
      alert("Paciente não encontrado!");
      return;
    }

    addAgendamento({
      pacienteId: parseInt(formState.pacienteId),
      pacienteNome: paciente.nome,
      data: formState.data,
      horario: formState.horario,
      tipo: formState.tipo,
      medico: formState.medico,
      status: formState.status,
    });

    dispatch({ type: "RESET" });
    setShowForm(false);
    alert("Agendamento criado com sucesso!");
  };

  const handleConfirm = (id: number) => {
    updateAgendamento(id, { status: "Confirmado" });
  };

  const handleCancel = (id: number) => {
    if (confirm("Deseja realmente cancelar este agendamento?")) {
      updateAgendamento(id, { status: "Cancelado" });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Deseja realmente excluir este agendamento?")) {
      deleteAgendamento(id);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agendamentos</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Novo Agendamento"}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Novo Agendamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Paciente *</label>
                  <select
                    value={formState.pacienteId}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "pacienteId", value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} - {p.condicao}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data *</label>
                  <Input
                    type="date"
                    value={formState.data}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "data", value: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Horário *</label>
                  <Input
                    type="time"
                    value={formState.horario}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "horario", value: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Consulta *</label>
                  <select
                    value={formState.tipo}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "tipo", value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Consulta de Rotina">Consulta de Rotina</option>
                    <option value="Consulta de Retorno">Consulta de Retorno</option>
                    <option value="Ecocardiograma">Ecocardiograma</option>
                    <option value="Teste Ergométrico">Teste Ergométrico</option>
                    <option value="Holter 24h">Holter 24h</option>
                    <option value="Eletrocardiograma">Eletrocardiograma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Médico *</label>
                  <select
                    value={formState.medico}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "medico", value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Selecione o médico</option>
                    <option value="Dr. Fernando Cardoso">Dr. Fernando Cardoso</option>
                    <option value="Dra. Mariana Alves">Dra. Mariana Alves</option>
                    <option value="Dr. Ricardo Santos">Dr. Ricardo Santos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "status", value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Agendar Consulta
              </Button>
            </form>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Paciente</TableHead>
                  <TableHead className="text-center">Data</TableHead>
                  <TableHead className="text-center">Horário</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead className="text-center">Médico</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      Nenhum agendamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  agendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                      <TableCell className="text-center">{agendamento.id}</TableCell>
                      <TableCell className="font-medium text-center">{agendamento.pacienteNome}</TableCell>
                      <TableCell className="text-center">{new Date(agendamento.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-center">{agendamento.horario}</TableCell>
                      <TableCell className="text-center">{agendamento.tipo}</TableCell>
                      <TableCell className="text-center">{agendamento.medico}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            agendamento.status === "Confirmado"
                              ? "bg-green-100 text-green-800"
                              : agendamento.status === "Pendente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {agendamento.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 w-[200px] mx-auto justify-center">
                          <div className="w-[60px]">
                            {agendamento.status === "Pendente" && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleConfirm(agendamento.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full"
                                title="Confirmar"
                              >
                                <Check size={18} />
                              </Button>
                            )}
                          </div>
                          <div className="w-[60px]">
                            {agendamento.status !== "Cancelado" && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCancel(agendamento.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                                title="Cancelar"
                              >
                                <X size={18} />
                              </Button>
                            )}
                          </div>
                          <div className="w-[60px]">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(agendamento.id)}
                              className="w-full"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total de agendamentos: {agendamentos.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

