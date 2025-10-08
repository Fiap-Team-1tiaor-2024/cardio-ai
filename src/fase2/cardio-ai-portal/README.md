# CardioIA Portal

Portal de visualização de dados de pacientes, agendamentos e dashboards para diagnóstico em cardiologia.

## 📋 Descrição

O CardioIA é uma aplicação front-end desenvolvida em React com Next.js que simula a rotina de um portal de diagnóstico em cardiologia. O sistema oferece funcionalidades de gestão de pacientes, agendamento de consultas e visualização de métricas através de dashboards interativos.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces
- **Next.js 15** - Framework React com suporte a SSR e rotas
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **shadcn/ui** - Componentes de UI reutilizáveis

## ✨ Funcionalidades

### Autenticação
- ✅ Login simulado com JWT fake armazenado no localStorage
- ✅ Context API para gerenciamento de estado de autenticação
- ✅ Proteção de rotas (apenas usuários autenticados acessam o portal)

### Gestão de Pacientes
- ✅ Listagem de pacientes com dados simulados (JSON local)
- ✅ Busca/filtro por nome ou condição
- ✅ Visualização de informações detalhadas

### Agendamentos
- ✅ Listagem de agendamentos
- ✅ Formulário de novo agendamento usando `useReducer`
- ✅ Gerenciamento de estado do formulário com hooks avançados
- ✅ Cancelamento de agendamentos

### Dashboard
- ✅ Métricas principais (total de pacientes, agendamentos, etc.)
- ✅ Gráficos de distribuição por condição
- ✅ Estatísticas de tipos de consulta
- ✅ Taxa de confirmação de agendamentos

### Interface
- ✅ Design responsivo (mobile, tablet e desktop)
- ✅ Navegação lateral (sidebar)
- ✅ Componentes reutilizáveis
- ✅ Estilização com Tailwind CSS

## 📁 Estrutura do Projeto

```
cardio-ai-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx          # Página de login
│   │   ├── pages/
│   │   │   ├── agendamentos/
│   │   │   │   └── page.tsx          # Página de agendamentos
│   │   │   ├── dashboards/
│   │   │   │   └── page.tsx          # Dashboard
│   │   │   ├── pacientes/
│   │   │   │   └── page.tsx          # Listagem de pacientes
│   │   │   └── layout.tsx            # Layout protegido
│   │   ├── layout.tsx                # Layout raiz
│   │   ├── page.tsx                  # Página inicial
│   │   └── globals.css               # Estilos globais
│   ├── components/
│   │   ├── ui/                       # Componentes UI (shadcn)
│   │   ├── navbar.tsx                # Barra de navegação
│   │   └── sidebar.tsx               # Menu lateral
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Context de autenticação
│   │   └── DataContext.tsx           # Context de dados
│   ├── data/
│   │   ├── pacientes.json            # Dados simulados de pacientes
│   │   └── agendamentos.json         # Dados simulados de agendamentos
│   ├── hooks/
│   │   └── use-mobile.ts             # Hook para detecção mobile
│   └── lib/
│       └── utils.ts                  # Funções utilitárias
├── public/                           # Arquivos públicos
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd cardio-ai/src/fase2/cardio-ai-portal
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🔐 Como Usar

### Login
1. Acesse a página inicial
2. Clique em "Acessar Portal" ou "Fazer Login"
3. Use **qualquer email e senha** (autenticação simulada)
4. Você será redirecionado para o dashboard

### Navegação
- **Dashboard**: Visualize métricas e estatísticas
- **Pacientes**: Liste e busque pacientes cadastrados
- **Agendamentos**: Visualize e crie novos agendamentos

### Criar Agendamento
1. Vá para "Agendamentos"
2. Clique em "Novo Agendamento"
3. Preencha o formulário:
   - Selecione um paciente
   - Escolha data e horário
   - Selecione o tipo de consulta
   - Escolha o médico
4. Clique em "Agendar Consulta"

## 📊 Dados Simulados

O projeto utiliza dados simulados armazenados em arquivos JSON:

- **8 pacientes** com diferentes condições cardiovasculares
- **6 agendamentos** distribuídos ao longo do tempo
- Condições incluem: Hipertensão, Arritmia, Insuficiência Cardíaca, etc.

## 🎨 Conceitos Aplicados

### Hooks Avançados
- `useState` - Gerenciamento de estado local
- `useEffect` - Efeitos colaterais e ciclo de vida
- `useReducer` - Gerenciamento complexo de estado (formulário de agendamento)
- `useContext` - Compartilhamento de estado global
- `useMemo` - Otimização de cálculos (dashboard)
- `useRouter` - Navegação programática (Next.js)

### Context API
- **AuthContext** - Gerencia autenticação e usuário logado
- **DataContext** - Gerencia dados de pacientes e agendamentos

### Proteção de Rotas
- Layout protegido verifica autenticação
- Redirecionamento automático para login se não autenticado
- Persistência de sessão via localStorage

## 🎯 Objetivos Alcançados

✅ Aplicação React interativa e responsiva  
✅ Autenticação simulada com Context API e JWT fake  
✅ Listagem de dados com filtros  
✅ Formulário complexo com useReducer  
✅ Dashboard com métricas calculadas  
✅ Proteção de rotas  
✅ Componentização adequada  
✅ Estilização moderna com Tailwind CSS  
✅ Boas práticas de código  

## 📝 Notas

- Este é um projeto **educacional** e utiliza dados simulados
- Não há integração com back-end real
- A autenticação é simulada apenas para demonstração de conceitos
- Os dados são armazenados apenas na memória do navegador

## 👥 Contribuidores

Projeto desenvolvido como parte do curso de IA.

## 📄 Licença

Este projeto é de código aberto para fins educacionais.
