# Script de Validação Docker - CardioIA Portal
# Verifica se todos os arquivos e configurações necessárias estão presentes

param(
    [switch]$Verbose
)

$ErrorCount = 0
$WarningCount = 0

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    $script:ErrorCount++
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
    $script:WarningCount++
}

function Write-Info {
    param([string]$Message)
    if ($Verbose) {
        Write-Host "ℹ️  $Message" -ForegroundColor Cyan
    }
}

Write-Host "`n🔍 Validando configuração Docker do CardioIA Portal...`n" -ForegroundColor Cyan

# Verificar Docker instalado
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Success "Docker instalado: $dockerVersion"
    } else {
        Write-Error "Docker não encontrado"
    }
} catch {
    Write-Error "Docker não está instalado"
}

try {
    $composeVersion = docker-compose --version 2>$null
    if ($composeVersion) {
        Write-Success "Docker Compose instalado: $composeVersion"
    } else {
        Write-Error "Docker Compose não encontrado"
    }
} catch {
    Write-Error "Docker Compose não está instalado"
}

# Verificar arquivos Docker
Write-Host "`n2. Verificando arquivos Docker..." -ForegroundColor Yellow
$dockerFiles = @(
    "Dockerfile",
    "Dockerfile.dev",
    "docker-compose.yml",
    "docker-compose.dev.yml",
    ".dockerignore"
)

foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Write-Success "Arquivo encontrado: $file"
    } else {
        Write-Error "Arquivo não encontrado: $file"
    }
}

# Verificar documentação
Write-Host "`n3. Verificando documentação..." -ForegroundColor Yellow
$docFiles = @(
    "DOCKER.md",
    "DOCKER-QUICKSTART.md",
    "DOCKER-CHEATSHEET.md",
    "TROUBLESHOOTING.md",
    "DOCKER-SUMMARY.md",
    "DOCKER-INDEX.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Success "Documentação encontrada: $file"
    } else {
        Write-Warning "Documentação não encontrada: $file"
    }
}

# Verificar scripts
Write-Host "`n4. Verificando scripts de automação..." -ForegroundColor Yellow
$scripts = @(
    "docker.ps1",
    "Makefile",
    "healthcheck.sh"
)

foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Success "Script encontrado: $script"
    } else {
        Write-Warning "Script não encontrado: $script"
    }
}

# Verificar package.json
Write-Host "`n5. Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    
    $dockerScripts = @(
        "docker:build",
        "docker:up",
        "docker:down",
        "docker:dev"
    )
    
    foreach ($scriptName in $dockerScripts) {
        if ($package.scripts.PSObject.Properties.Name -contains $scriptName) {
            Write-Success "NPM script encontrado: $scriptName"
        } else {
            Write-Warning "NPM script não encontrado: $scriptName"
        }
    }
} else {
    Write-Error "package.json não encontrado"
}

# Verificar next.config.ts
Write-Host "`n6. Verificando next.config.ts..." -ForegroundColor Yellow
if (Test-Path "next.config.ts") {
    $nextConfig = Get-Content "next.config.ts" -Raw
    if ($nextConfig -match "output.*standalone") {
        Write-Success "next.config.ts configurado com output standalone"
    } else {
        Write-Warning "next.config.ts pode não estar configurado para standalone"
    }
} else {
    Write-Error "next.config.ts não encontrado"
}

# Verificar .env.example
Write-Host "`n7. Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Write-Success ".env.example encontrado"
    
    if (Test-Path ".env") {
        Write-Info ".env encontrado (será usado no Docker)"
    } else {
        Write-Info ".env não encontrado (opcional)"
    }
} else {
    Write-Warning ".env.example não encontrado"
}

# Verificar estrutura de diretórios
Write-Host "`n8. Verificando estrutura de diretórios..." -ForegroundColor Yellow
$dirs = @(
    "src",
    "public",
    "src/app",
    "src/components"
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Success "Diretório encontrado: $dir"
    } else {
        Write-Error "Diretório não encontrado: $dir"
    }
}

# Verificar porta 3000
Write-Host "`n9. Verificando porta 3000..." -ForegroundColor Yellow
try {
    $portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Warning "Porta 3000 já está em uso"
        Write-Info "Execute: Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess"
    } else {
        Write-Success "Porta 3000 está disponível"
    }
} catch {
    Write-Success "Porta 3000 está disponível"
}

# Verificar Docker está rodando
Write-Host "`n10. Verificando se Docker está rodando..." -ForegroundColor Yellow
try {
    $dockerPs = docker ps 2>$null
    if ($dockerPs) {
        Write-Success "Docker está rodando"
        
        # Verificar se já existe container rodando
        $containers = docker ps --filter "name=cardio-ai-portal" --format "{{.Names}}"
        if ($containers) {
            Write-Info "Container já está rodando: $containers"
        }
    } else {
        Write-Warning "Docker não está rodando. Abra o Docker Desktop."
    }
} catch {
    Write-Warning "Docker não está rodando. Abra o Docker Desktop."
}

# Resumo
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "📊 RESUMO DA VALIDAÇÃO" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "`n🎉 Tudo perfeito! Configuração Docker está 100% pronta!" -ForegroundColor Green
    Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
    Write-Host "   1. Execute: .\docker.ps1 up" -ForegroundColor White
    Write-Host "   2. Acesse: http://localhost:3000" -ForegroundColor White
    Write-Host "   3. Consulte: DOCKER-QUICKSTART.md para mais informações`n" -ForegroundColor White
} else {
    if ($ErrorCount -gt 0) {
        Write-Host "`n❌ Encontrados $ErrorCount erro(s) crítico(s)" -ForegroundColor Red
    }
    if ($WarningCount -gt 0) {
        Write-Host "⚠️  Encontrados $WarningCount aviso(s)" -ForegroundColor Yellow
    }
    
    Write-Host "`n📝 Recomendações:" -ForegroundColor Yellow
    if ($ErrorCount -gt 0) {
        Write-Host "   - Corrija os erros críticos antes de continuar" -ForegroundColor Red
        Write-Host "   - Consulte DOCKER.md para instruções de setup" -ForegroundColor White
    }
    if ($WarningCount -gt 0) {
        Write-Host "   - Os avisos não impedem o funcionamento, mas são recomendados" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""

# Retornar código de saída
if ($ErrorCount -gt 0) {
    exit 1
} else {
    exit 0
}
