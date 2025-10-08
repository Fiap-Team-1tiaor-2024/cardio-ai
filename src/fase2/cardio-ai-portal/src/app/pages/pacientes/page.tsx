"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";

export default function PacientesPage() {
  const { pacientes } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar pacientes por nome ou condição
  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condicao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar por nome ou condição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Última Consulta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      Nenhum paciente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pacientesFiltrados.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell>{paciente.id}</TableCell>
                      <TableCell className="font-medium">{paciente.nome}</TableCell>
                      <TableCell>{paciente.idade}</TableCell>
                      <TableCell>{paciente.email}</TableCell>
                      <TableCell>{paciente.telefone}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {paciente.condicao}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total de pacientes: {pacientesFiltrados.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

