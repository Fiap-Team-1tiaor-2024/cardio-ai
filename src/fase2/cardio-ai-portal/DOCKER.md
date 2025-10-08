# Docker - Cardio AI Portal

Este documento descreve como executar a aplicação Cardio AI Portal usando Docker.

## Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (geralmente vem com o Docker Desktop)

## Modo Produção

### Construir e executar

```bash
# Construir a imagem
docker-compose build

# Executar o container
docker-compose up

# Executar em background
docker-compose up -d

# Parar o container
docker-compose down
```

**Ou usando NPM scripts:**
```bash
npm run docker:up          # Executar
npm run docker:up:bg       # Executar em background
npm run docker:down        # Parar
```

**Ou usando Makefile (se disponível):**
```bash
make up        # Executar
make up-d      # Executar em background
make down      # Parar
make help      # Ver todos os comandos
```

A aplicação estará disponível em: http://localhost:3000

### Comandos úteis

```bash
# Ver logs
docker-compose logs -f

# Reconstruir após mudanças
docker-compose up --build

# Remover volumes e reconstruir
docker-compose down -v
docker-compose up --build
```

## Modo Desenvolvimento

Para desenvolvimento com hot-reload:

```bash
# Executar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Executar em background
docker-compose -f docker-compose.dev.yml up -d

# Parar
docker-compose -f docker-compose.dev.yml down
```

A aplicação estará disponível em: http://localhost:3000

### Vantagens do modo desenvolvimento:
- Hot-reload automático ao alterar arquivos
- Volumes montados para sincronizar código em tempo real
- Não precisa reconstruir a imagem a cada mudança

## Construir apenas a imagem Docker

```bash
# Produção
docker build -t cardio-ai-portal .

# Desenvolvimento
docker build -f Dockerfile.dev -t cardio-ai-portal-dev .
```

## Executar manualmente (sem docker-compose)

```bash
# Produção
docker run -p 3000:3000 cardio-ai-portal

# Desenvolvimento
docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules cardio-ai-portal-dev
```

## Variáveis de Ambiente

Para adicionar variáveis de ambiente, crie um arquivo `.env` na raiz do projeto:

```env
# Exemplo
NEXT_PUBLIC_API_URL=http://api.example.com
```

E atualize o `docker-compose.yml`:

```yaml
services:
  cardio-ai-portal:
    # ... outras configurações
    env_file:
      - .env
```

## Troubleshooting

### Porta 3000 já está em uso

Altere a porta no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Usar porta 3001 no host
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs -f cardio-ai-portal

# Verificar status
docker-compose ps
```

### Limpar tudo e recomeçar

```bash
# Parar e remover containers, volumes e imagens
docker-compose down -v --rmi all

# Reconstruir
docker-compose build --no-cache
docker-compose up
```

## Estrutura dos Dockerfiles

- **Dockerfile**: Build otimizado multi-stage para produção
- **Dockerfile.dev**: Build simples para desenvolvimento com hot-reload
- **.dockerignore**: Arquivos ignorados no build (similar ao .gitignore)
- **docker-compose.yml**: Orquestração para produção
- **docker-compose.dev.yml**: Orquestração para desenvolvimento

## Performance

O Dockerfile de produção usa multi-stage build para:
- Reduzir o tamanho final da imagem
- Separar dependências de build e runtime
- Melhorar segurança com usuário não-root
- Otimizar cache de layers

Tamanho aproximado da imagem final: ~150-200MB
