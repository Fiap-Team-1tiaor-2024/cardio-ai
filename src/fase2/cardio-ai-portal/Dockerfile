# Estágio 1: Dependências
FROM node:22-alpine AS deps
WORKDIR /app

# Atualizar pacotes de segurança e instalar dependências necessárias
RUN apk update && apk upgrade && apk add --no-cache libc6-compat

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Estágio 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Atualizar pacotes de segurança
RUN apk update && apk upgrade

# Copiar node_modules do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria do Next.js durante o build
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação
RUN npm run build

# Estágio 3: Runner (Produção)
FROM node:22-alpine AS runner
WORKDIR /app

# Atualizar pacotes de segurança
RUN apk update && apk upgrade

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
