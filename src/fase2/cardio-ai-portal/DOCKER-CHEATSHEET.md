# 📋 Docker Cheat Sheet - CardioIA Portal

Referência rápida de comandos Docker para o CardioIA Portal.

## 🚀 Comandos Básicos

### Iniciar Aplicação
```bash
# Produção
docker-compose up                    # Foreground
docker-compose up -d                 # Background

# Desenvolvimento
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml up -d
```

### Parar Aplicação
```bash
docker-compose down                  # Parar e remover containers
docker-compose stop                  # Apenas parar containers
docker-compose down -v               # Parar e remover volumes
```

### Construir/Reconstruir
```bash
docker-compose build                 # Construir imagem
docker-compose build --no-cache      # Construir sem cache
docker-compose up --build            # Reconstruir e iniciar
```

---

## 📊 Monitoramento

### Ver Logs
```bash
docker-compose logs                  # Todos os logs
docker-compose logs -f               # Logs em tempo real
docker-compose logs -f --tail=100    # Últimas 100 linhas
docker-compose logs cardio-ai-portal # Logs de serviço específico
```

### Status e Info
```bash
docker-compose ps                    # Status dos containers
docker ps                            # Containers rodando
docker ps -a                         # Todos os containers
docker stats                         # Uso de recursos
docker images                        # Listar imagens
```

---

## 🔧 Gerenciamento

### Reiniciar
```bash
docker-compose restart               # Reiniciar todos
docker-compose restart cardio-ai-portal  # Reiniciar específico
```

### Executar Comandos
```bash
docker-compose exec cardio-ai-portal sh          # Shell interativo
docker-compose exec cardio-ai-portal ls -la      # Executar comando
docker-compose exec cardio-ai-portal env         # Ver variáveis
```

### Inspecionar
```bash
docker inspect cardio-ai-portal      # Detalhes do container
docker port cardio-ai-portal         # Portas expostas
docker top cardio-ai-portal          # Processos rodando
```

---

## 🧹 Limpeza

### Básico
```bash
docker-compose down                  # Remove containers
docker-compose down -v               # Remove containers e volumes
docker-compose down --rmi all        # Remove containers e imagens
```

### Limpeza Completa
```bash
# Remover tudo do projeto
docker-compose down -v --rmi all

# Limpar cache de build
docker builder prune

# Limpar sistema (CUIDADO!)
docker system prune -a --volumes
```

### Seletivo
```bash
docker rm <container-id>             # Remover container
docker rmi <image-id>                # Remover imagem
docker volume rm <volume-name>       # Remover volume
docker network rm <network-name>     # Remover rede
```

---

## 🔍 Debug e Troubleshooting

### Logs Detalhados
```bash
docker-compose logs -f -t            # Com timestamp
docker-compose logs --since 10m      # Últimos 10 minutos
docker-compose build --progress=plain --no-cache  # Build verboso
```

### Acessar Container
```bash
docker exec -it cardio-ai-portal sh  # Shell interativo
docker exec -it cardio-ai-portal /bin/bash  # Se bash disponível
```

### Copiar Arquivos
```bash
# Do container para host
docker cp cardio-ai-portal:/app/file.txt ./local.txt

# Do host para container
docker cp ./local.txt cardio-ai-portal:/app/file.txt
```

### Verificar Saúde
```bash
docker inspect --format='{{json .State.Health}}' cardio-ai-portal
```

---

## 🌐 Rede

### Listar e Inspecionar
```bash
docker network ls                    # Listar redes
docker network inspect <network>     # Detalhes da rede
```

### Conectar/Desconectar
```bash
docker network connect <network> <container>
docker network disconnect <network> <container>
```

---

## 💾 Volumes

### Gerenciar Volumes
```bash
docker volume ls                     # Listar volumes
docker volume inspect <volume>       # Detalhes do volume
docker volume rm <volume>            # Remover volume
docker volume prune                  # Remover volumes não usados
```

---

## 📦 Imagens

### Listar e Remover
```bash
docker images                        # Listar imagens
docker images -a                     # Todas as imagens
docker rmi <image-id>                # Remover imagem
docker rmi $(docker images -q)       # Remover todas
```

### Build Manual
```bash
# Produção
docker build -t cardio-ai-portal .

# Desenvolvimento
docker build -f Dockerfile.dev -t cardio-ai-portal-dev .

# Com argumentos
docker build --build-arg NODE_ENV=production -t cardio-ai-portal .
```

### Pull/Push
```bash
docker pull <image>                  # Baixar imagem
docker push <image>                  # Enviar imagem
docker tag <image> <new-tag>         # Tagear imagem
```

---

## 🎯 Comandos Compostos

### Rebuild Completo
```bash
docker-compose down -v --rmi all && \
docker-compose build --no-cache && \
docker-compose up
```

### Ver Logs de Erro
```bash
docker-compose logs | grep -i error
docker-compose logs | grep -i warning
```

### Backup de Volume
```bash
docker run --rm \
  -v <volume-name>:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data
```

---

## 🔐 Segurança

### Scan de Vulnerabilidades
```bash
docker scan cardio-ai-portal         # Docker scan
docker scout cves cardio-ai-portal   # Docker Scout
```

### Verificar Usuário
```bash
docker exec cardio-ai-portal whoami  # Ver usuário atual
```

---

## 📝 PowerShell (Windows)

### Comandos Específicos Windows
```powershell
# Ver processo usando porta
Get-NetTCPConnection -LocalPort 3000

# Parar processo
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Executar script
.\docker.ps1 up
.\docker.ps1 logs
```

---

## 🎨 NPM Scripts

```bash
# Produção
npm run docker:build
npm run docker:up
npm run docker:up:bg
npm run docker:down
npm run docker:logs

# Desenvolvimento  
npm run docker:dev
npm run docker:dev:bg
npm run docker:dev:down

# Utilidades
npm run docker:clean
```

---

## 🛠️ Makefile (Linux/Mac/WSL)

```bash
make help         # Ver comandos
make up           # Iniciar
make down         # Parar
make logs         # Ver logs
make build        # Construir
make clean        # Limpar
make dev          # Desenvolvimento
```

---

## 📊 Informações Úteis

### Tamanhos
```bash
docker images                        # Tamanho das imagens
docker system df                     # Uso de disco
docker system df -v                  # Detalhado
```

### Performance
```bash
docker stats                         # Uso de recursos
docker stats --no-stream             # Snapshot único
```

### Exportar/Importar
```bash
# Exportar imagem
docker save -o cardio-ai-portal.tar cardio-ai-portal

# Importar imagem
docker load -i cardio-ai-portal.tar

# Exportar container
docker export cardio-ai-portal > cardio-ai-portal.tar

# Importar container
docker import cardio-ai-portal.tar cardio-ai-portal:imported
```

---

## 🔗 Links Úteis

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Multi-stage**: https://docs.docker.com/build/building/multi-stage/

---

## 💡 Dicas Rápidas

1. Use `docker-compose` para orquestração
2. Use `.dockerignore` para otimizar build
3. Use multi-stage builds para produção
4. Sempre especifique versões de imagens
5. Use volumes para dados persistentes
6. Use networks para comunicação entre containers
7. Use healthchecks para monitorar saúde
8. Limite recursos em produção
9. Use Docker Scout para segurança
10. Mantenha logs organizados

---

**Nota:** Substitua `cardio-ai-portal` pelo nome do seu container/serviço quando necessário.
