# 🫀 CARDIO-IA - Sistema de Monitoramento Cardíaco IoT

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-ESP32-green.svg)
![Dashboard](https://img.shields.io/badge/Dashboard-Node--RED_2.0-red.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

Sistema completo de monitoramento de sinais vitais com **Edge Computing**, **resiliência offline** e **visualização em tempo real** via MQTT e **Node-RED Dashboard 2.0**.

---

## 🎯 Sobre o Projeto

O **CardioIA** é um protótipo funcional de sistema de monitoramento de sinais vitais que simula a captura de dados de pacientes cardiológicos. Desenvolvido como parte do curso de IoT da FIAP (1TIAOR), o projeto demonstra conceitos avançados de:

- **Edge Computing** - Processamento local com buffer RAM (resiliência offline)
- **Fog Computing** - Camada intermediária de processamento (Node-RED)
- **Cloud Computing** - Transmissão segura via MQTT TLS (HiveMQ Cloud)
- **Visualização de Dados** - Dashboard interativo em tempo real

## ✨ Características Principais

### 📊 Monitoramento de Sinais Vitais

- **Temperatura corporal** (DHT22 + simulação): 35-40°C
- **Umidade do ar** (DHT22): 0-100%
- **Frequência cardíaca** (Potenciômetro): 50-150 BPM
- **Movimento/Atividade** (Simulação algorítmica): 0-3.0g de aceleração

### 💾 Resiliência Offline (Edge Computing)

- **Buffer RAM circular** de até 100 amostras (~8 minutos de dados)
- **Armazenamento em memória** (~50KB de RAM)
- **Sincronização automática** quando retorna online
- **Estratégia de descarte** inteligente (FIFO - First In First Out)

### 🚨 Sistema de Alertas Automáticos

| Condição               | Alerta                | Severidade |
| ---------------------- | --------------------- | ---------- |
| Temperatura < 35°C     | 🥶 HIPOTERMIA         | Critical   |
| Temperatura > 38.5°C   | 🔥 FEBRE              | Warning    |
| BPM < 50               | ⚠️ BRADICARDIA        | Critical   |
| BPM > 120              | 🚨 TAQUICARDIA        | Warning    |
| Movimento > 2.0g       | 🏃 MOVIMENTO BRUSCO   | Info       |
| Umidade < 30% ou > 80% | 💧 UMIDADE INADEQUADA | Info       |

---

## 🔧 Hardware Utilizado

- **ESP32 DevKit V1** (240MHz, 320KB RAM, 4MB Flash)
- **DHT22** - Temperatura e umidade (GPIO 4)
- **Potenciômetro** - Simulação de BPM (GPIO 34)
- **LED Azul** - Indicador de status (GPIO 2)
  - **Fixo ON**: MQTT conectado
  - **Pisca rápido (200ms)**: WiFi OK, MQTT offline
  - **Pisca lento (1s)**: Completamente offline

## 📦 Bibliotecas e Dependências

- `DHT sensor library` v1.4.6 - Sensor de temperatura e umidade
- `Adafruit Unified Sensor` v1.1.14 - Framework base para sensores
- `ArduinoJson` v7.4.2 - Serialização/Deserialização JSON
- `PubSubClient` v2.8 - Cliente MQTT
- WiFi & WiFiClientSecure (ESP32 core) - Conectividade
- LittleFS v2.0.0 - Sistema de arquivos (incluído, mas desabilitado para Wokwi)

> **Nota:** O projeto usa **buffer RAM** ao invés de filesystem para compatibilidade total com Wokwi.

---

## 🚀 Como Usar

### 1. Compilação e Upload

```powershell
# Compilar (instala dependências automaticamente)
platformio run

# Upload para ESP32 físico conectado
platformio run --target upload

# Monitor serial
platformio device monitor
```

### 2. Simulação no Wokwi

1. Abra o projeto no VS Code com extensão Wokwi instalada
2. Execute: `PlatformIO: Build` (Ctrl+Alt+B)
3. Clique em "Start Simulation" no Wokwi
4. Observe os logs no Serial Monitor

### 3. Node-RED Dashboard

1. Importe o arquivo `node-red-flow-dashboard2.json` no Node-RED
2. Instale `@flowfuse/node-red-dashboard` se necessário:

   ```bash
   npm install @flowfuse/node-red-dashboard
   ```

3. Configure o broker MQTT (HiveMQ Cloud):
   - Host: `d5d56acfdf724f63a63b8281697371d1.s1.eu.hivemq.cloud`
   - Port: `8883` (TLS)
   - Usuário: `fiap-123`
   - Senha: `Vaicorinthians123`
4. Deploy e acesse `http://localhost:1880/dashboard`

---

## 📊 Dados Capturados (Formato JSON)

### Tópico: `cardioIA/health/data`

```json
{
  "timestamp": "00:05:23",
  "uptime_s": 323,
  "sample_id": 65,
  "sensors": {
    "temperature_c": 36.8,
    "humidity_pct": 55.3,
    "bpm": 78,
    "movement_g": 0.15
  },
  "status": {
    "wifi": true,
    "mqtt": true,
    "storage_used": 25600,
    "samples_pending": 0,
    "uptime": 323,
    "status": "online"
  }
}
```

### Tópico: `cardioIA/health/status`

```json
{
  "status": "online",
  "uptime": 323,
  "wifi": true,
  "mqtt": true
}
```

### Tópico: `cardioIA/health/alert`

```json
{
  "timestamp": "00:05:23",
  "severity": "warning",
  "message": "FEBRE! Temperatura: 38.7°C",
  "device": "CardioIA_ESP32"
}
```

---

## ⚙️ Configuração

Edite as credenciais em `src/cardioia.ino`:

```cpp
// WiFi
const char* WIFI_SSID = "Wokwi-GUEST";  // Para Wokwi
const char* WIFI_PASS = "";             // Wokwi não precisa senha

// MQTT Broker (HiveMQ Cloud - Configurado)
const char* MQTT_BROKER = "broker.s1.eu.hivemq.cloud";
const int   MQTT_PORT = 8883;           // MQTTS (TLS)
const char* MQTT_USER = "user";
const char* MQTT_PASS = "password";

// Tópicos MQTT
const char* MQTT_TOPIC_DATA = "cardioIA/health/data";
const char* MQTT_TOPIC_ALERT = "cardioIA/health/alert";
const char* MQTT_TOPIC_STATUS = "cardioIA/health/status";
```

> **Para uso próprio:** Altere para suas credenciais WiFi e MQTT broker.

---

## 🧠 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        EDGE LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ESP32 + Sensores                                      │  │
│  │  • DHT22 (Temp/Umidade)                               │  │
│  │  • Potenciômetro (BPM)                                │  │
│  │  • Simulação de movimento                             │  │
│  │                                                       │  │
│  │ Buffer RAM Circular (100 amostras)                    │  │
│  │  └─> Resiliência offline                              │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ MQTT/TLS (8883)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       CLOUD LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ HiveMQ Cloud Broker                                   │  │
│  │  • TLS/SSL encryption                                 │  │
│  │  • Tópicos: data, alert, status                       │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ MQTT Subscribe
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FOG/PROCESSING LAYER                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Node-RED + Dashboard 2.0                              │  │
│  │  • Processamento de dados                             │  │
│  │  • Visualização em tempo real                         │  │
│  │  • Gauges, charts, status                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Coleta**: ESP32 lê sensores a cada 5 segundos
2. **Edge**: Dados salvos em buffer RAM (resiliência offline)
3. **Transmissão**: Se online, envia via MQTT TLS
4. **Sincronização**: Buffer é sincronizado quando retorna online
5. **Processamento**: Node-RED processa e exibe no Dashboard
6. **Alertas**: Condições críticas geram alertas automáticos

---

## 📁 Estrutura do Projeto

```
cardioIA/
├── src/
│   └── cardioia.ino              # Código principal ESP32 (910KB Flash)
├── node-red-flow-dashboard2.json # Flow completo Node-RED Dashboard 2.0
├── platformio.ini                # Configuração PlatformIO
├── partitions.csv                # Tabela de partições (não usado no Wokwi)
├── diagram.json                  # Circuito Wokwi (ESP32 + DHT22 + Pot)
├── wokwi.toml                    # Configuração Wokwi
├── README.md                     # Este arquivo
├── RELATORIO_PARTE1.md          # Relatório Edge Computing
└── RELATORIO_PARTE2.md          # Relatório Cloud + Dashboard
```

---

## 🔍 Troubleshooting

### ❌ WiFi não conecta no Wokwi

✅ **Solução**: Use `WIFI_SSID = "Wokwi-GUEST"` e `WIFI_PASS = ""`

### ❌ MQTT retorna erro -2 (CONNECT_FAILED)

✅ **Solução**: Verifique credenciais HiveMQ e porta 8883

### ❌ Dashboard mostra valores zero

✅ **Solução**:

- Verifique se MQTT está conectado (LED fixo no ESP32)
- Confirme tópicos no Node-RED: `cardioIA/health/data`
- Veja logs no Debug do Node-RED

### ❌ Serial Monitor não mostra dados

✅ **Solução**: Configure baud rate para **115200** no Monitor Serial

### ❌ Erro de compilação "undefined reference"

✅ **Solução**:

```powershell
platformio run -t clean
platformio run
```

### ❌ Node-RED Dashboard não carrega

✅ **Solução**:

```bash
# Instale o Dashboard 2.0
npm install @flowfuse/node-red-dashboard
# Reinicie Node-RED
```

---

## 📈 Recursos Utilizados

### Memória ESP32

- **RAM**: 47.816 bytes (14.6% de 320KB)
- **Flash**: 910.061 bytes (69.4% de 1.3MB)
- **Buffer RAM**: ~50KB para 100 amostras

### Consumo de Energia (Estimado)

- **Modo ativo**: ~240mA (WiFi + sensores)
- **Modo sleep**: Não implementado (futuro)

### Taxa de Dados

- **Leitura**: A cada 5 segundos
- **Sincronização**: A cada 10 segundos (se offline)
- **Throughput MQTT**: ~500 bytes por mensagem

---

## � Relatórios Técnicos

Este projeto possui documentação técnica detalhada dividida em duas partes:

### 📋 [Relatório Parte 1 - Edge Computing](./RELATORIO_PARTE1.md)

Documentação técnica sobre a implementação de **Edge Computing** no ESP32:

- Arquitetura de hardware e software
- Sistema de buffer RAM circular (resiliência offline)
- Estratégias de sincronização de dados
- Processamento local de sinais vitais

### 📋 [Relatório Parte 2 - Cloud & Dashboard](./RELATORIO_PARTE2.md)

Documentação sobre a integração com **Cloud Computing** e visualização:

- Arquitetura Cloud (HiveMQ)
- Implementação MQTT TLS
- Dashboard Node-RED 2.0
- Análise de desempenho e métricas

---

## �👥 Equipe FIAP - 1TIAOR (2025)

Projeto desenvolvido como parte do curso de IoT da FIAP pelos seguintes integrantes:

- **Gabrielle Halasc** — RM560147@fiap.com.br
- **Gabriela da Cunha** — RM561041@fiap.com.br
- **Gustavo Segantini** — RM560111@fiap.com.br
- **Vitor Lopes** — RM559858@fiap.com.br

---

## 📄 Licença

Projeto educacional - CardioIA (2025)  
Desenvolvido para fins acadêmicos - FIAP

Este projeto é licenciado sob a **Licença MIT**.  
Consulte o arquivo [`LICENSE`](../../LICENSE) para mais detalhes.
