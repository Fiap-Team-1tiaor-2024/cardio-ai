// src/app/pages/pacientes/cadastro/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Heart, AlertCircle, CheckCircle } from "lucide-react";

type FormData = {
  nome: string;
  idade: string;
  email: string;
  telefone: string;
  condicao: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function CadastroPacientePage() {
  const router = useRouter();
  const { addPaciente } = useData();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    idade: "",
    email: "",
    telefone: "",
    condicao: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof FormData]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validações
  const validateNome = (nome: string): string | undefined => {
    if (!nome.trim()) return "Nome é obrigatório";
    if (nome.trim().length < 3) return "Nome deve ter pelo menos 3 caracteres";
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) return "Nome deve conter apenas letras";
    return undefined;
  };

  const validateIdade = (idade: string): string | undefined => {
    if (!idade) return "Idade é obrigatória";
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum)) return "Idade deve ser um número";
    if (idadeNum < 0 || idadeNum > 120) return "Idade deve estar entre 0 e 120";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email inválido";
    return undefined;
  };

  const validateTelefone = (telefone: string): string | undefined => {
    if (!telefone) return "Telefone é obrigatório";
    // Remove caracteres especiais para validação
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return "Telefone deve ter 10 ou 11 dígitos";
    }
    return undefined;
  };

  const validateCondicao = (condicao: string): string | undefined => {
    if (!condicao.trim()) return "Condição é obrigatória";
    return undefined;
  };

  // Função para validar todos os campos
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      nome: validateNome(formData.nome),
      idade: validateIdade(formData.idade),
      email: validateEmail(formData.email),
      telefone: validateTelefone(formData.telefone),
      condicao: validateCondicao(formData.condicao),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // Formatar telefone automaticamente
  const formatTelefone = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Handlers
  const handleChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    // Formatação específica por campo
    if (field === "telefone") {
      processedValue = formatTelefone(value);
    } else if (field === "idade") {
      processedValue = value.replace(/\D/g, "");
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Validar campo se já foi tocado
    if (touched[field]) {
      const validators = {
        nome: validateNome,
        idade: validateIdade,
        email: validateEmail,
        telefone: validateTelefone,
        condicao: validateCondicao,
      };
      const error = validators[field](processedValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const validators = {
      nome: validateNome,
      idade: validateIdade,
      email: validateEmail,
      telefone: validateTelefone,
      condicao: validateCondicao,
    };
    
    const error = validators[field](formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    setTouched({
      nome: true,
      idade: true,
      email: true,
      telefone: true,
      condicao: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const hoje = new Date().toISOString().split("T")[0];

      addPaciente({
        nome: formData.nome,
        idade: parseInt(formData.idade),
        email: formData.email,
        telefone: formData.telefone,
        condicao: formData.condicao,
        dataCadastro: hoje,
        ultimaConsulta: hoje,
      });

      setShowSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/pages/pacientes");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/pages/pacientes");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Paciente Cadastrado!</h2>
              <p className="text-gray-600">
                O paciente <strong>{formData.nome}</strong> foi cadastrado com sucesso.
              </p>
              <p className="text-sm text-gray-500">Redirecionando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Novo Paciente</h1>
            <p className="text-gray-600">Preencha os dados do paciente</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Paciente</CardTitle>
              <CardDescription>
                Todos os campos são obrigatórios. Preencha com atenção.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={formData.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nome", e.target.value)}
                    onBlur={() => handleBlur("nome")}
                    placeholder="Ex: Maria Silva Santos"
                    className={`pl-10 ${errors.nome && touched.nome ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.nome && touched.nome && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.nome}</span>
                  </div>
                )}
              </div>

              {/* Idade */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Idade *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    value={formData.idade}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("idade", e.target.value)}
                    onBlur={() => handleBlur("idade")}
                    placeholder="Ex: 45"
                    className={`pl-10 ${errors.idade && touched.idade ? "border-red-500" : ""}`}
                    maxLength={3}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.idade && touched.idade && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.idade}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="Ex: maria.silva@email.com"
                    className={`pl-10 ${errors.email && touched.email ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("telefone", e.target.value)}
                    onBlur={() => handleBlur("telefone")}
                    placeholder="(11) 98765-4321"
                    className={`pl-10 ${errors.telefone && touched.telefone ? "border-red-500" : ""}`}
                    maxLength={15}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.telefone && touched.telefone && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.telefone}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                </p>
              </div>

              {/* Condição */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Condição Cardíaca *
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={formData.condicao}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("condicao", e.target.value)}
                    onBlur={() => handleBlur("condicao")}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.condicao && touched.condicao ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione uma condição</option>
                    <option value="Hipertensão">Hipertensão</option>
                    <option value="Arritmia">Arritmia</option>
                    <option value="Insuficiência Cardíaca">Insuficiência Cardíaca</option>
                    <option value="Doença Arterial Coronariana">Doença Arterial Coronariana</option>
                    <option value="Valvopatia">Valvopatia</option>
                    <option value="Miocardite">Miocardite</option>
                    <option value="Pericardite">Pericardite</option>
                    <option value="Cardiomiopatia">Cardiomiopatia</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                {errors.condicao && touched.condicao && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.condicao}</span>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Cadastrar Paciente
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
