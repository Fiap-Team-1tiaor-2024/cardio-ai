// src/app/pages/pacientes/[id]/editar/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Heart, AlertCircle } from "lucide-react";

type FormData = {
  nome: string;
  idade: string;
  email: string;
  telefone: string;
  condicoes: string[];
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function EditarPacientePage() {
  const router = useRouter();
  const params = useParams();
  const { pacientes, updatePaciente } = useData();
  
  const pacienteId = parseInt(params.id as string);
  const paciente = pacientes.find(p => p.id === pacienteId);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    idade: "",
    email: "",
    telefone: "",
    condicoes: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof FormData]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (paciente) {
      // Converter string de condições separadas por vírgula em array
      const condicoesArray = paciente.condicao.split(",").map(c => c.trim());
      
      setFormData({
        nome: paciente.nome,
        idade: paciente.idade.toString(),
        email: paciente.email,
        telefone: paciente.telefone,
        condicoes: condicoesArray,
      });
    }
  }, [paciente]);

  // Validações (mesmas do cadastro)
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
    const telefoneLimpo = telefone.replace(/\D/g, "");
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return "Telefone deve ter 10 ou 11 dígitos";
    }
    return undefined;
  };

  const validateCondicoes = (condicoes: string[]): string | undefined => {
    if (condicoes.length === 0) return "Selecione pelo menos uma condição";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      nome: validateNome(formData.nome),
      idade: validateIdade(formData.idade),
      email: validateEmail(formData.email),
      telefone: validateTelefone(formData.telefone),
      condicoes: validateCondicoes(formData.condicoes),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const formatTelefone = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    let processedValue = value;

    if (field === "telefone" && typeof value === "string") {
      processedValue = formatTelefone(value);
    } else if (field === "idade" && typeof value === "string") {
      processedValue = value.replace(/\D/g, "");
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    if (touched[field] && field !== "condicoes") {
      const validators = {
        nome: validateNome,
        idade: validateIdade,
        email: validateEmail,
        telefone: validateTelefone,
      };
      if (field in validators && typeof value === "string") {
        const error = validators[field as keyof typeof validators](value);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    } else if (field === "condicoes") {
      const error = validateCondicoes(value as string[]);
      setErrors(prev => ({ ...prev, condicoes: error }));
    }
  };

  const handleCondicaoToggle = (condicao: string) => {
    const newCondicoes = formData.condicoes.includes(condicao)
      ? formData.condicoes.filter(c => c !== condicao)
      : [...formData.condicoes, condicao];
    
    handleChange("condicoes", newCondicoes);
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === "condicoes") {
      const error = validateCondicoes(formData.condicoes);
      setErrors(prev => ({ ...prev, condicoes: error }));
    } else {
      const validators = {
        nome: validateNome,
        idade: validateIdade,
        email: validateEmail,
        telefone: validateTelefone,
      };
      
      if (field in validators) {
        const error = validators[field as keyof typeof validators](formData[field] as string);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      nome: true,
      idade: true,
      email: true,
      telefone: true,
      condicoes: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      updatePaciente(pacienteId, {
        nome: formData.nome,
        idade: parseInt(formData.idade),
        email: formData.email,
        telefone: formData.telefone,
        condicao: formData.condicoes.join(", "),
      });

      router.push("/pages/pacientes");
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/pages/pacientes");
  };

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2">Paciente não encontrado</h2>
            <Button onClick={() => router.push("/pages/pacientes")}>
              Voltar para Pacientes
            </Button>
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
            <h1 className="text-3xl font-bold text-gray-800">Editar Paciente</h1>
            <p className="text-gray-600">Atualize os dados de {paciente.nome}</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Paciente</CardTitle>
              <CardDescription>
                Todos os campos são obrigatórios. Altere conforme necessário.
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
              </div>

              {/* Condições Cardíacas */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Condições Cardíacas * (selecione uma ou mais)
                </label>
                <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                  {[
                    "Hipertensão",
                    "Arritmia",
                    "Insuficiência Cardíaca",
                    "Doença Arterial Coronariana",
                    "Valvopatia",
                    "Miocardite",
                    "Pericardite",
                    "Cardiomiopatia",
                    "Outro"
                  ].map((condicao) => (
                    <label key={condicao} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.condicoes.includes(condicao)}
                        onChange={() => handleCondicaoToggle(condicao)}
                        onBlur={() => handleBlur("condicoes")}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <Heart className="text-red-500" size={16} />
                      <span className="text-sm text-gray-700">{condicao}</span>
                    </label>
                  ))}
                </div>
                {errors.condicoes && touched.condicoes && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.condicoes}</span>
                  </div>
                )}
                {formData.condicoes.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Selecionadas:</strong> {formData.condicoes.join(", ")}
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
                      Salvar Alterações
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
