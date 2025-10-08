# 🚀 Guia Rápido - CardioIA Portal

## Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

### 3. Acessar a Aplicação
Abra http://localhost:3000 no navegador

### 4. Fazer Login
- Use **qualquer email e senha**
- Exemplo: `admin@cardio.com` / `123456`
- A autenticação é simulada!

---

## 📱 Funcionalidades Principais

### Dashboard
- Visualize métricas gerais
- Gráficos de distribuição
- Estatísticas em tempo real

### Pacientes
- Liste todos os pacientes
- Busque por nome ou condição
- Veja detalhes completos

### Agendamentos
- Visualize agendamentos futuros
- Crie novos agendamentos
- Cancele agendamentos

---

## 🎯 Testando o Sistema

### Cenário 1: Visualizar Dashboard
1. Faça login
2. Você será redirecionado automaticamente para o Dashboard
3. Explore as métricas e gráficos

### Cenário 2: Buscar Paciente
1. Clique em "Pacientes" no menu lateral
2. Use a barra de busca para filtrar
3. Tente buscar por "Maria" ou "Hipertensão"

### Cenário 3: Criar Agendamento
1. Vá para "Agendamentos"
2. Clique em "Novo Agendamento"
3. Preencha o formulário:
   - Paciente: Maria Silva
   - Data: qualquer data futura
   - Horário: 14:00
   - Tipo: Consulta de Rotina
   - Médico: Dr. Fernando Cardoso
4. Clique em "Agendar Consulta"
5. Veja o novo agendamento na lista

### Cenário 4: Testar Responsividade
1. Redimensione a janela do navegador
2. Teste em diferentes tamanhos de tela
3. No mobile, use o menu hambúrguer

---

## 🔑 Credenciais de Teste

**Qualquer email e senha funciona!**

Exemplos:
- `medico@cardio.com` / `senha123`
- `admin@hospital.com` / `admin`
- `teste@teste.com` / `123`

---

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

---

## 📊 Dados Disponíveis

### Pacientes (8 total)
- Maria Silva (45 anos) - Hipertensão
- João Santos (52 anos) - Arritmia
- Ana Paula Costa (38 anos) - Insuficiência Cardíaca
- Pedro Oliveira (67 anos) - Doença Arterial Coronariana
- Carla Mendes (42 anos) - Fibrilação Atrial
- Roberto Lima (55 anos) - Hipertensão
- Fernanda Souza (49 anos) - Miocardite
- Carlos Alberto (61 anos) - Angina

### Agendamentos (6 total)
- Distribuídos entre diferentes datas
- Vários tipos de consultas e exames
- Status: Confirmado ou Pendente

---

## 💡 Dicas

1. **Navegação**: Use o menu lateral para alternar entre páginas
2. **Logout**: Clique no botão "Sair" no canto superior direito
3. **Busca**: A busca de pacientes filtra por nome OU condição
4. **Formulário**: Todos os campos marcados com * são obrigatórios
5. **Mobile**: No mobile, clique no ícone de menu (☰) para abrir o sidebar

---

## ❓ Problemas Comuns

### Erro ao instalar dependências
```bash
# Limpe o cache do npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Porta 3000 já em uso
```bash
# Use outra porta
npm run dev -- -p 3001
```

### Página não carrega após login
- Verifique o console do navegador
- Limpe o localStorage: F12 > Application > Local Storage > Clear

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação no README.md
2. Verifique o console do navegador (F12)
3. Consulte os logs do servidor

---

**Divirta-se explorando o CardioIA! 🏥💙**
