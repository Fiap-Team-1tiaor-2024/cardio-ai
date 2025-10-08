"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Plus, Search } from "lucide-react";

export default function PacientesPage() {
  const { pacientes } = useData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar pacientes por nome ou condição
  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condicao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNovoPaciente = () => {
    router.push("/pages/pacientes/cadastro");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pacientes Cadastrados</CardTitle>
            <Button
              onClick={handleNovoPaciente}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Novo Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar por nome ou condição..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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

