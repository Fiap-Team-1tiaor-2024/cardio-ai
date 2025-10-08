.PHONY: help build up down logs clean dev dev-down dev-logs restart rebuild

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(BLUE)CardioIA Portal - Docker Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos de Produção:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -v "dev" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Comandos de Desenvolvimento:$(NC)"
	@grep -E '^dev.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

# Comandos de Produção
build: ## Constrói a imagem Docker de produção
	docker-compose build

up: ## Inicia a aplicação em modo produção
	docker-compose up

up-d: ## Inicia a aplicação em modo produção (background)
	docker-compose up -d

down: ## Para e remove os containers de produção
	docker-compose down

logs: ## Mostra os logs da aplicação
	docker-compose logs -f

restart: ## Reinicia a aplicação
	docker-compose restart

rebuild: ## Reconstrói e inicia a aplicação
	docker-compose up --build

clean: ## Remove containers, volumes e imagens
	docker-compose down -v --rmi all

# Comandos de Desenvolvimento
dev: ## Inicia a aplicação em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml up

dev-d: ## Inicia a aplicação em modo desenvolvimento (background)
	docker-compose -f docker-compose.dev.yml up -d

dev-down: ## Para e remove os containers de desenvolvimento
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Mostra os logs do modo desenvolvimento
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart: ## Reinicia a aplicação em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml restart

# Utilidades
ps: ## Lista os containers em execução
	docker-compose ps

shell: ## Acessa o shell do container
	docker-compose exec cardio-ai-portal sh

stats: ## Mostra estatísticas de uso dos containers
	docker stats

prune: ## Remove todos os recursos Docker não utilizados
	docker system prune -a --volumes
