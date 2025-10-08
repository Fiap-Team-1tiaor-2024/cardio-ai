# CardioIA Portal - Docker Helper Script
# Este script facilita o gerenciamento da aplicação via Docker no Windows

param(
    [Parameter(Position=0)]
    [ValidateSet('up', 'down', 'logs', 'build', 'restart', 'clean', 'dev', 'dev-down', 'status', 'help')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host "`n=== CardioIA Portal - Docker Helper ===" -ForegroundColor Cyan
    Write-Host "`nUso: .\docker.ps1 <comando>" -ForegroundColor Yellow
    Write-Host "`nComandos de Produção:" -ForegroundColor Green
    Write-Host "  up        - Inicia a aplicação em modo produção"
    Write-Host "  down      - Para a aplicação"
    Write-Host "  build     - Constrói a imagem Docker"
    Write-Host "  restart   - Reinicia a aplicação"
    Write-Host "  logs      - Mostra os logs da aplicação"
    Write-Host "  clean     - Remove containers, volumes e imagens"
    Write-Host "`nComandos de Desenvolvimento:" -ForegroundColor Green
    Write-Host "  dev       - Inicia em modo desenvolvimento (hot-reload)"
    Write-Host "  dev-down  - Para o modo desenvolvimento"
    Write-Host "`nUtilitários:" -ForegroundColor Green
    Write-Host "  status    - Mostra status dos containers"
    Write-Host "  help      - Mostra esta mensagem"
    Write-Host "`nExemplos:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 up"
    Write-Host "  .\docker.ps1 dev"
    Write-Host "  .\docker.ps1 logs"
    Write-Host ""
}

function Start-Production {
    Write-Host "`n🚀 Iniciando CardioIA Portal (Produção)..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "`n✅ Aplicação iniciada!" -ForegroundColor Green
    Write-Host "📍 Acesse: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📋 Para ver logs: .\docker.ps1 logs`n" -ForegroundColor Yellow
}

function Stop-Application {
    Write-Host "`n⏹️  Parando CardioIA Portal..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "`n✅ Aplicação parada!`n" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "`n📋 Mostrando logs (Ctrl+C para sair)..." -ForegroundColor Cyan
    docker-compose logs -f
}

function Build-Image {
    Write-Host "`n🔨 Construindo imagem Docker..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "`n✅ Imagem construída!`n" -ForegroundColor Green
}

function Restart-Application {
    Write-Host "`n🔄 Reiniciando CardioIA Portal..." -ForegroundColor Yellow
    docker-compose restart
    Write-Host "`n✅ Aplicação reiniciada!`n" -ForegroundColor Green
}

function Clean-All {
    Write-Host "`n🧹 Removendo containers, volumes e imagens..." -ForegroundColor Red
    $confirm = Read-Host "Tem certeza? (s/N)"
    if ($confirm -eq 's' -or $confirm -eq 'S') {
        docker-compose down -v --rmi all
        Write-Host "`n✅ Limpeza concluída!`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Operação cancelada`n" -ForegroundColor Yellow
    }
}

function Start-Development {
    Write-Host "`n🛠️  Iniciando CardioIA Portal (Desenvolvimento)..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up
}

function Stop-Development {
    Write-Host "`n⏹️  Parando modo desenvolvimento..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down
    Write-Host "`n✅ Modo desenvolvimento parado!`n" -ForegroundColor Green
}

function Show-Status {
    Write-Host "`n📊 Status dos Containers:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
}

# Executar comando
switch ($Command) {
    'up'       { Start-Production }
    'down'     { Stop-Application }
    'logs'     { Show-Logs }
    'build'    { Build-Image }
    'restart'  { Restart-Application }
    'clean'    { Clean-All }
    'dev'      { Start-Development }
    'dev-down' { Stop-Development }
    'status'   { Show-Status }
    'help'     { Show-Help }
    default    { Show-Help }
}
