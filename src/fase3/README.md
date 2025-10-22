# 🫀 CARDIO-IA - Sistema de Monitoramento Cardíaco IoT

![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-ESP32-green.svg)
![Dashboard](https://img.shields.io/badge/Dashboard-2.0-red.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

Sistema completo de monitoramento de sinais vitais com **Edge Computing**, **resiliência offline** e **visualização em tempo real** via MQTT e **Node-RED Dashboard 2.0**.

---

## 🚀 INÍCIO RÁPIDO

**Problemas?** Consulte os guias de troubleshooting:

| Guia | Quando usar |
|------|-------------|
| **[⚡ QUICK_CHECK.md](QUICK_CHECK.md)** | Verificação rápida (3 passos, 1 minuto) |
| **[📋 STATUS_ATUAL.md](STATUS_ATUAL.md)** | Status do projeto e próximos passos |
| **[🔧 MQTT_TROUBLESHOOTING.md](MQTT_TROUBLESHOOTING.md)** | MQTT não conecta |
| **[📊 TROUBLESHOOTING_DASHBOARD_DADOS.md](TROUBLESHOOTING_DASHBOARD_DADOS.md)** | Dashboard mostra zeros |
| **[✅ CHECKLIST_DASHBOARD.md](CHECKLIST_DASHBOARD.md)** | Setup Dashboard 2.0 completo |
| **[📖 NODE_RED_GUIDE.md](NODE_RED_GUIDE.md)** | Instalação e configuração Node-RED |

---

## 🎯 Sobre o Projeto

O **CardioIA** é um protótipo funcional de sistema vestível de monitoramento cardíaco que simula a captura de sinais vitais de pacientes cardiológicos. Desenvolvido como parte do curso de IoT da FIAP, o projeto demonstra conceitos avançados de:

- **Edge Computing** - Processamento local com resiliência offline
- **Fog Computing** - Camada intermediária de processamento (Node-RED)
- **Cloud Computing** - Armazenamento e análise centralizada (MQTT Broker)
- **Visualização de Dados** - Dashboard interativo em tempo real

## ✨ Características Principais

### 📊 Monitoramento de Sinais Vitais

- **Temperatura corporal** (DHT22): 35-40°C
- **Umidade do ar** (DHT22): 0-100%
- **Frequência cardíaca** (Potenciômetro): 50-150 BPM
- **Movimento/Atividade** (MPU6050): Acelerômetro 3 eixos

### 💾 Resiliência Offline (Edge Computing)

- **Buffer circular** de até 1000 amostras (~83 minutos de dados)
- **Armazenamento local** em LittleFS (50KB)
- **Sincronização automática** quando retorna online
- **Estratégia de descarte** inteligente (FIFO)

### 🚨 Sistema de Alertas Automáticos

| Condição | Alerta |
|----------|--------|
| Temperatura < 35°C | 🥶 HIPOTERMIA |
| Temperatura > 38.5°C | 🔥 FEBRE |
| BPM < 50 | ⚠️ BRADICARDIA |
| BPM > 120 | 🚨 TAQUICARDIA |
| Movimento > 2.0g | 🏃 MOVIMENTO BRUSCO |

---

## 🔧 Hardware Utilizado

- **ESP32 DevKit V1** (240MHz, 4MB Flash)
- **DHT22** - Temperatura e umidade (GPIO 4)
- **MPU6050** - Acelerômetro/Giroscópio (I2C: GPIO 21/22)
- **Potenciômetro** - Simulação de BPM (GPIO 34)
- **LED Azul** - Indicador de status (GPIO 2)

## 📦 Bibliotecas

- `Adafruit MPU6050` v2.2.6 - Sensor inercial
- `Adafruit Unified Sensor` v1.1.14 - Framework de sensores
- `DHT sensor library` v1.4.6 - Temp/Umidade
- `ArduinoJson` v7.4.2 - Serialização JSON
- `PubSubClient` v2.8 - Cliente MQTT
- WiFi & WiFiClientSecure (ESP32 core)
- SPIFFS (Wokwi) / LittleFS (hardware físico)

## 🚀 Como usar

### Build e Upload

```powershell
# Compilar (instala deps automaticamente)
python -m platformio run

# Upload para ESP32 conectado
python -m platformio run --target upload

# Monitor serial
python -m platformio device monitor
```

### Simulação Wokwi

1. Abra o projeto no VS Code com extensão Wokwi instalada
2. Build o projeto (PlatformIO: Build)
3. Start Simulation no Wokwi

> ⚠️ **Wokwi usa SPIFFS** enquanto hardware físico pode usar LittleFS (configurado via `board_build.filesystem` no `platformio.ini`)

## 📊 Dados capturados

O sistema coleta e publica via MQTT (formato JSON):

```json
{
  "timestamp": 123456,
  "temp_c": 23.5,
  "humidity_pct": 65.2,
  "bpm": 75,
  "accel": {
    "x": 0.12,
    "y": 0.05,
    "z": 9.78
  },
  "gyro": {
    "x": 0.001,
    "y": -0.002,
    "z": 0.0
  },
  "temp_mpu_c": 24.1
}
```

## ⚙️ Configuração

Edite em `src/cardioia.ino`:

```cpp
// WiFi
const char* WIFI_SSID = "SeuSSID";
const char* WIFI_PASS = "SuaSenha";

// MQTT (HiveMQ Cloud ou outro broker)
const char* MQTT_BROKER = "seu-cluster.hivemq.cloud";
const int   MQTT_PORT = 8883;  // MQTTS
const char* MQTT_USER = "seu_usuario";
const char* MQTT_PASS = "sua_senha";
const char* MQTT_TOPIC = "esp32/health";
```

## 🧠 Arquitetura Edge + Cloud

- **Edge:** Dados salvos localmente em SPIFFS/LittleFS (resiliência offline)
- **Cloud:** Sincronização automática via MQTT quando conectado
- **Retry Logic:** Reconexão WiFi/MQTT com backoff
- **Limite de storage:** 4KB local (configurável via `MAX_STORAGE_BYTES`)

## 📁 Estrutura do projeto

```
cardioIA/
├── src/
│   └── cardioia.ino          # Código principal
├── platformio.ini            # Config PlatformIO
├── partitions.csv            # Tabela de partições custom
├── diagram.json              # Diagrama Wokwi
├── wokwi.toml                # Config Wokwi (paths firmware)
└── README.md
```

## 🔍 Troubleshooting

### Erro: partition "spiffs" not found
- Certifique-se de que `board_build.partitions = partitions.csv` está em `platformio.ini`
- Faça clean build: `python -m platformio run -t clean`

### MPU6050 não detectado
- Verifique conexões I2C (SDA=GPIO21, SCL=GPIO22 por padrão no ESP32)
- No Wokwi, adicione o MPU6050 ao `diagram.json`

### WiFi não conecta
- Confirme SSID/senha corretos
- O código tenta reconectar infinitamente com timeout de 10s

### MQTT falha (rc=-2)
- Broker URL incorreta ou porta errada
- Credenciais inválidas
- Para HiveMQ Free use `wifiClient.setInsecure()`

## 📈 Próximos passos

- [ ] Dashboard web (Node-RED ou Grafana)
- [ ] Alertas em tempo real (frequência cardíaca anormal)
- [ ] ML inference local (TensorFlow Lite Micro)
- [ ] Suporte a múltiplos sensores adicionais
- [ ] OTA (Over-The-Air) updates

## � Atualizações Recentes

**Versão 1.3 - Correções de Compatibilidade Wokwi**

✅ **Temperatura corporal simulada** - DHT22 agora retorna valores corporais (35-40°C) ao invés de ambiente  
✅ **Formatação Serial corrigida** - Cada métrica aparece em linha separada  
✅ **Error handling MPU6050** - Sistema continua funcionando mesmo com falhas I2C  
✅ **SPIFFS graceful degradation** - Modo online direto quando partição não disponível  

📄 Ver detalhes completos em **[CHANGELOG.md](CHANGELOG.md)**

---

## �📄 Licença

Projeto educacional - CardioIA (2025)
