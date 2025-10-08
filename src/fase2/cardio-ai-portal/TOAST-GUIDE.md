# Sistema de Notificações (Toast)

Sistema customizado de notificações que substitui o `alert()` padrão do navegador com toasts estilizados e reutilizáveis.

## 📦 Instalação

Já instalado: `react-hot-toast`

## 🎯 Uso Básico

### Importar as funções

```typescript
import { showSuccess, showError, showWarning, showInfo, showLoading, showConfirm } from '@/lib/toast';
```

### Exemplos

#### 1. Toast de Sucesso
```typescript
showSuccess('Paciente cadastrado com sucesso!');
showSuccess('Dados salvos!', { duration: 3000 });
```

#### 2. Toast de Erro
```typescript
showError('Erro ao cadastrar paciente');
showError('Falha na conexão', { duration: 6000 });
```

#### 3. Toast de Aviso
```typescript
showWarning('Atenção: Dados incompletos');
showWarning('Verifique os campos obrigatórios');
```

#### 4. Toast de Informação
```typescript
showInfo('Novos recursos disponíveis');
showInfo('Atualize a página para ver mudanças');
```

#### 5. Toast de Carregamento
```typescript
const loadingToast = showLoading('Salvando dados...');

// Após concluir, atualizar o toast
setTimeout(() => {
  updateToast(loadingToast, 'Dados salvos!', 'success');
}, 2000);
```

#### 6. Toast de Confirmação
```typescript
showConfirm(
  'Tem certeza que deseja excluir este paciente?',
  () => {
    // Ação ao confirmar
    deletePaciente(id);
    showSuccess('Paciente excluído!');
  },
  () => {
    // Ação ao cancelar (opcional)
    showInfo('Ação cancelada');
  }
);
```

## 🎨 Tipos de Notificação

| Tipo | Cor | Uso | Ícone |
|------|-----|-----|-------|
| `showSuccess` | Verde | Ações bem-sucedidas | ✓ |
| `showError` | Vermelho | Erros e falhas | ✗ |
| `showWarning` | Laranja | Avisos importantes | ⚠️ |
| `showInfo` | Azul | Informações gerais | ℹ️ |
| `showLoading` | Cinza | Processos em andamento | ⏳ |
| `showConfirm` | Branco | Confirmações | - |

## ⚙️ Opções de Configuração

```typescript
interface ToastOptions {
  duration?: number; // Duração em ms (padrão: 4000)
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// Exemplo
showSuccess('Mensagem', { 
  duration: 5000, 
  position: 'bottom-right' 
});
```

## 🔧 Funções Auxiliares

### Atualizar Toast
```typescript
import { updateToast } from '@/lib/toast';

const toastId = showLoading('Processando...');
updateToast(toastId, 'Concluído!', 'success');
```

### Remover Toast Específico
```typescript
import { dismissToast } from '@/lib/toast';

const toastId = showInfo('Mensagem');
setTimeout(() => dismissToast(toastId), 2000);
```

### Remover Todos os Toasts
```typescript
import { dismissAllToasts } from '@/lib/toast';

dismissAllToasts();
```

## 📝 Exemplos Reais de Uso

### Cadastro de Paciente
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const loadingToast = showLoading('Cadastrando paciente...');
  
  try {
    await addPaciente(formData);
    updateToast(loadingToast, 'Paciente cadastrado com sucesso!', 'success');
    router.push('/pages/pacientes');
  } catch (error) {
    updateToast(loadingToast, 'Erro ao cadastrar paciente', 'error');
  }
};
```

### Exclusão com Confirmação
```typescript
const handleDelete = (id: number) => {
  showConfirm(
    'Tem certeza que deseja excluir este agendamento?',
    () => {
      deleteAgendamento(id);
      showSuccess('Agendamento excluído!');
    }
  );
};
```

### Validação de Formulário
```typescript
const validateForm = () => {
  if (!formData.nome) {
    showWarning('Por favor, preencha o nome');
    return false;
  }
  
  if (!formData.email) {
    showError('Email é obrigatório');
    return false;
  }
  
  return true;
};
```

## 🎯 Migração de `alert()`

### Antes
```typescript
alert('Paciente cadastrado!');
if (confirm('Deseja excluir?')) {
  deletePaciente(id);
}
```

### Depois
```typescript
showSuccess('Paciente cadastrado!');
showConfirm('Deseja excluir?', () => {
  deletePaciente(id);
});
```

## 🌈 Customização

O arquivo `src/components/ToastProvider.tsx` contém as configurações globais dos toasts. Você pode ajustar:
- Posição padrão
- Duração
- Estilos
- Cores
- Animações

## 📚 Recursos Adicionais

- **Múltiplos toasts**: Vários toasts podem ser exibidos simultaneamente
- **Empilhamento**: Toasts são empilhados automaticamente
- **Responsivo**: Funciona em mobile e desktop
- **Acessível**: Suporta leitores de tela
- **Dismissible**: Clique para fechar ou fechamento automático

## 🔗 Documentação Completa

Para mais detalhes, consulte: [react-hot-toast docs](https://react-hot-toast.com/)
