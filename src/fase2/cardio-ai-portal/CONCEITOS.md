# 📚 Conceitos Técnicos Aplicados - CardioIA Portal

## Índice
1. [Hooks Avançados](#hooks-avançados)
2. [Context API](#context-api)
3. [Proteção de Rotas](#proteção-de-rotas)
4. [Componentização](#componentização)
5. [Estado e Ciclo de Vida](#estado-e-ciclo-de-vida)

---

## Hooks Avançados

### useState
Utilizado para gerenciar estado local em componentes funcionais.

**Exemplo: Busca de Pacientes** (`src/app/pages/pacientes/page.tsx`)
```typescript
const [searchTerm, setSearchTerm] = useState("");

// Filtrar pacientes baseado no termo de busca
const pacientesFiltrados = pacientes.filter(p =>
  p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
  p.condicao.toLowerCase().includes(searchTerm.toLowerCase())
);
```

**Onde aplicamos:**
- Campos de formulário
- Estados de loading
- Controle de modais/popups
- Filtros de busca

---

### useEffect
Hook para gerenciar efeitos colaterais e ciclo de vida dos componentes.

**Exemplo: Verificação de Autenticação** (`src/contexts/AuthContext.tsx`)
```typescript
useEffect(() => {
  // Restaurar usuário do localStorage ao carregar
  const token = localStorage.getItem(JWT_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (token && userStr) {
    setUser(JSON.parse(userStr));
  }
  setLoading(false);
}, []);
```

**Onde aplicamos:**
- Carregar dados iniciais
- Sincronizar com localStorage
- Redirecionamento baseado em autenticação
- Limpeza de recursos

---

### useReducer
Hook para gerenciar estado complexo com múltiplas ações.

**Exemplo: Formulário de Agendamento** (`src/app/pages/agendamentos/page.tsx`)
```typescript
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const [formState, dispatch] = useReducer(formReducer, initialState);
```

**Vantagens sobre useState:**
- ✅ Gerenciamento centralizado de estado complexo
- ✅ Ações bem definidas e tipadas
- ✅ Lógica de atualização separada do componente
- ✅ Fácil teste e manutenção

**Onde aplicamos:**
- Formulários complexos com múltiplos campos
- Estado que depende de várias ações diferentes

---

### useContext
Hook para acessar valores de contexto sem prop drilling.

**Exemplo: Acesso ao Contexto de Autenticação**
```typescript
// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Usar em componentes
const { user, logout } = useAuth();
```

**Onde aplicamos:**
- Autenticação global
- Dados compartilhados entre componentes
- Configurações da aplicação

---

### useMemo
Hook para memorizar valores calculados e evitar recálculos desnecessários.

**Exemplo: Cálculo de Métricas do Dashboard** (`src/app/pages/dashboards/page.tsx`)
```typescript
const metricas = useMemo(() => {
  const totalPacientes = pacientes.length;
  const totalAgendamentos = agendamentos.length;
  
  // Cálculos complexos...
  const condicoes: Record<string, number> = {};
  pacientes.forEach(p => {
    condicoes[p.condicao] = (condicoes[p.condicao] || 0) + 1;
  });
  
  return { totalPacientes, totalAgendamentos, condicoes, ... };
}, [pacientes, agendamentos]);
```

**Benefícios:**
- ✅ Performance otimizada
- ✅ Evita recálculos em cada render
- ✅ Recalcula apenas quando dependências mudam

---

## Context API

### Estrutura de Contextos

#### AuthContext
**Responsabilidade:** Gerenciar autenticação e usuário logado

```typescript
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};
```

**Funcionalidades:**
- Login simulado com JWT fake
- Persistência no localStorage
- Logout e limpeza de sessão
- Estado de loading

#### DataContext
**Responsabilidade:** Gerenciar dados de pacientes e agendamentos

```typescript
type DataContextType = {
  pacientes: Paciente[];
  agendamentos: Agendamento[];
  addAgendamento: (agendamento: Omit<Agendamento, "id">) => void;
  updateAgendamento: (id: number, agendamento: Partial<Agendamento>) => void;
  deleteAgendamento: (id: number) => void;
};
```

**Funcionalidades:**
- CRUD de agendamentos
- Dados simulados de JSON
- Estado compartilhado globalmente

---

## Proteção de Rotas

### Implementação

**Layout Protegido** (`src/app/pages/layout.tsx`)
```typescript
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

**Fluxo de Proteção:**
1. Verifica se há token no localStorage
2. Se autenticado, renderiza conteúdo protegido
3. Se não autenticado, redireciona para `/login`
4. Mostra loading enquanto verifica

---

## Componentização

### Estrutura de Componentes

#### Componentes de UI (shadcn/ui)
- `Button` - Botões reutilizáveis com variantes
- `Card` - Cartões para agrupar conteúdo
- `Input` - Campos de entrada
- `Table` - Tabelas responsivas

#### Componentes de Layout
- `Sidebar` - Menu lateral com navegação
- `Navbar` - Barra superior com usuário e logout

#### Páginas (Pages)
- Cada página é um componente separado
- Uso de componentes de UI para consistência
- Responsivas e acessíveis

### Exemplo de Componentização

**Antes (sem componentização):**
```tsx
<div className="px-4 py-2 bg-blue-500 text-white rounded">
  Clique aqui
</div>
```

**Depois (com componentização):**
```tsx
<Button variant="primary">Clique aqui</Button>
```

**Benefícios:**
- ✅ Reutilização de código
- ✅ Consistência visual
- ✅ Fácil manutenção
- ✅ Tipagem TypeScript

---

## Estado e Ciclo de Vida

### Gerenciamento de Estado

#### Estado Local (useState)
Usado quando o estado é específico de um componente.

**Exemplo:** Campo de busca de pacientes
```typescript
const [searchTerm, setSearchTerm] = useState("");
```

#### Estado Global (Context)
Usado quando o estado precisa ser compartilhado.

**Exemplo:** Usuário autenticado
```typescript
const { user, isAuthenticated } = useAuth();
```

#### Estado Derivado (useMemo)
Calculado a partir de outros estados.

**Exemplo:** Lista filtrada de pacientes
```typescript
const pacientesFiltrados = useMemo(() => 
  pacientes.filter(p => p.nome.includes(searchTerm)),
  [pacientes, searchTerm]
);
```

### Ciclo de Vida

#### Montagem (useEffect com [])
Executado uma vez quando o componente monta.
```typescript
useEffect(() => {
  // Carregar dados iniciais
  loadData();
}, []);
```

#### Atualização (useEffect com dependências)
Executado quando dependências mudam.
```typescript
useEffect(() => {
  if (isAuthenticated) {
    router.push("/dashboard");
  }
}, [isAuthenticated]);
```

#### Desmontagem (useEffect com cleanup)
Executado quando o componente é removido.
```typescript
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => clearInterval(timer); // cleanup
}, []);
```

---

## Boas Práticas Aplicadas

### 1. Tipagem TypeScript
- ✅ Interfaces para dados estruturados
- ✅ Types para união e intersecção
- ✅ Generics onde necessário

### 2. Organização de Código
- ✅ Separação por responsabilidade
- ✅ Hooks customizados
- ✅ Contextos separados

### 3. Performance
- ✅ useMemo para cálculos pesados
- ✅ useCallback para funções (quando necessário)
- ✅ Lazy loading de componentes

### 4. Acessibilidade
- ✅ Labels em formulários
- ✅ Navegação por teclado
- ✅ Contraste adequado

### 5. Responsividade
- ✅ Mobile-first
- ✅ Breakpoints do Tailwind
- ✅ Componentes adaptáveis

---

## Padrões de Design Aplicados

### 1. Provider Pattern
Contextos que fornecem dados para toda a árvore de componentes.

### 2. Custom Hooks Pattern
Hooks reutilizáveis (`useAuth`, `useData`)

### 3. Compound Components Pattern
Componentes que trabalham juntos (`Card`, `CardHeader`, `CardContent`)

### 4. Render Props Pattern (implícito)
Children como função em alguns componentes

---

## Conclusão

Este projeto demonstra a aplicação prática de:
- ✅ Hooks avançados do React
- ✅ Context API para estado global
- ✅ Proteção de rotas
- ✅ Componentização efetiva
- ✅ TypeScript para type safety
- ✅ Boas práticas de desenvolvimento

Todos esses conceitos são fundamentais para o desenvolvimento de aplicações React modernas e escaláveis.
