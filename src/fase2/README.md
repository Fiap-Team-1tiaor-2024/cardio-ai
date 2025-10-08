# CardioIA - Fase 2

Este diretório contém os projetos da Fase 2 do CardioIA.

## 🐳 Docker

Todos os projetos foram configurados para rodar em Docker. Você pode executar cada projeto individualmente ou todos juntos.

### Executar Projetos Individualmente

#### Portal Web (cardio-ai-portal)
```bash
cd cardio-ai-portal

# Opção 1: PowerShell Script (Windows)
.\docker.ps1 up

# Opção 2: Docker Compose
docker-compose up

# Opção 3: NPM
npm run docker:up
```

**Acesse:** http://localhost:3000

Consulte [cardio-ai-portal/DOCKER-QUICKSTART.md](./cardio-ai-portal/DOCKER-QUICKSTART.md) para mais detalhes.

#### Outros projetos
- **cardio-ai-ml**: Machine Learning para análise de sintomas e riscos
- **cardio-ai-mlp**: Perceptron multicamadas para classificação ECG

(Dockerfiles podem ser adicionados conforme necessário)

### Executar Todos os Projetos Juntos (Futuro)

```bash
# Na pasta fase2
docker-compose up
```

Isso iniciará todos os serviços integrados (quando configurado).

## 📁 Estrutura

```
fase2/
├── cardio-ai-portal/      # Portal Web Next.js
│   ├── Dockerfile         # Build otimizado para produção
│   ├── Dockerfile.dev     # Build para desenvolvimento
│   ├── docker-compose.yml # Orquestração
│   ├── docker.ps1         # Script helper para Windows
│   └── DOCKER.md          # Documentação completa
├── cardio-ai-ml/          # Backend ML
└── cardio-ai-mlp/         # Modelo MLP
```

## 🚀 Início Rápido

1. **Instale o Docker**
   - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: Docker Engine

2. **Escolha um projeto**
   ```bash
   cd cardio-ai-portal
   ```

3. **Execute**
   ```bash
   docker-compose up
   ```

4. **Acesse**
   - Portal: http://localhost:3000

## 📚 Documentação

Cada projeto tem sua própria documentação Docker:

- [cardio-ai-portal/DOCKER.md](./cardio-ai-portal/DOCKER.md) - Documentação completa
- [cardio-ai-portal/DOCKER-QUICKSTART.md](./cardio-ai-portal/DOCKER-QUICKSTART.md) - Início rápido

## 🔧 Comandos Úteis

### Ver todos os containers rodando
```bash
docker ps
```

### Ver logs de um container
```bash
docker logs -f <container-name>
```

### Parar todos os containers
```bash
docker stop $(docker ps -q)
```

### Limpar recursos Docker
```bash
docker system prune -a
```

## 💡 Dicas

- Use **modo desenvolvimento** enquanto desenvolve (hot-reload)
- Use **modo produção** para testar o build final
- Mantenha o Docker Desktop aberto
- Verifique os logs se algo não funcionar

## 🆘 Problemas?

1. Verifique se o Docker está rodando
2. Verifique se as portas não estão em uso
3. Consulte a documentação específica do projeto
4. Execute `docker-compose logs -f` para ver logs

## 🎯 Próximos Passos

- [ ] Dockerizar cardio-ai-ml
- [ ] Dockerizar cardio-ai-mlp
- [ ] Criar orquestração completa
- [ ] Adicionar banco de dados
- [ ] Configurar CI/CD
