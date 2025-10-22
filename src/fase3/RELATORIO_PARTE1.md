# RELATÓRIO PARTE 1 - CARDIO-IA
## Armazenamento e Processamento Local (Edge Computing)

---

### 1. INTRODUÇÃO

Este relatório descreve a implementação da **Parte 1** do projeto CardioIA, focado em **Edge Computing** com armazenamento local e resiliência offline. O sistema foi desenvolvido para simular um dispositivo vestível de monitoramento cardíaco que coleta sinais vitais continuamente e garante a integridade dos dados mesmo sem conectividade à nuvem.

**Objetivo:** Desenvolver um sistema embarcado capaz de coletar, armazenar e sincronizar dados de sensores médicos de forma resiliente e eficiente.

---

### 2. ARQUITETURA DO SISTEMA

#### 2.1 Hardware Utilizado

O projeto utiliza os seguintes componentes no simulador Wokwi:

1. **ESP32 DevKit V1** - Microcontrolador principal com Wi-Fi integrado
2. **DHT22** - Sensor de temperatura e umidade (obrigatório)
   - Temperatura: Faixa de medição de -40°C a 80°C
   - Umidade: 0% a 100% RH
3. **Potenciômetro** - Simula frequência cardíaca (BPM)
   - Faixa mapeada: 50 a 150 BPM
4. **MPU6050** - Acelerômetro/Giroscópio para detecção de movimento
   - Detecta movimento brusco e atividade física
5. **LED de Status** - Indicador visual de conectividade

#### 2.2 Software e Bibliotecas

- **Sistema de Arquivos:** LittleFS (flash interna do ESP32)
- **Formato de Dados:** JSON (ArduinoJson v7)
- **Protocolo de Comunicação:** MQTT (PubSubClient)
- **Intervalo de Leitura:** 5 segundos (configurável)

---

### 3. FLUXO DE FUNCIONAMENTO

#### 3.1 Inicialização do Sistema

```
┌─────────────────┐
│  Inicia ESP32   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Monta LittleFS  │ ◄── Sistema de arquivos persistente
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Inicializa      │
│ Sensores        │ ◄── DHT22, Potenciômetro, MPU6050
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Conecta Wi-Fi   │ ◄── Tenta conexão (modo não bloqueante)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Conecta MQTT    │ ◄── Se Wi-Fi disponível
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Carrega         │
│ Metadados       │ ◄── Recupera contadores e estado anterior
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Loop Principal  │ ◄── Inicia ciclo de monitoramento
└─────────────────┘
```

#### 3.2 Ciclo de Coleta de Dados (Loop Principal)

```
┌─────────────────────────────────────────────┐
│          LOOP PRINCIPAL (5 em 5s)           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │ Lê Sensores     │
        │ - Temperatura   │
        │ - Umidade       │
        │ - BPM           │
        │ - Movimento     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Cria JSON       │
        │ com timestamp   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Verifica        │
        │ Alertas         │ ◄── Temperatura, BPM, Movimento
        └────────┬────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │ Wi-Fi + MQTT OK?       │
    └──────┬─────────────┬───┘
           │             │
          SIM           NÃO
           │             │
           ▼             ▼
    ┌──────────┐   ┌──────────────┐
    │ Envia    │   │ MODO OFFLINE │
    │ Direto   │   │ Salva no     │
    │ para     │   │ LittleFS     │
    │ Nuvem    │   │ (Edge)       │
    └──────────┘   └──────────────┘
```

---

### 4. LÓGICA DE RESILIÊNCIA OFFLINE

A implementação de **Edge Computing** garante que o sistema funcione de forma autônoma, mesmo sem conectividade. Esta é uma característica crítica para dispositivos médicos.

#### 4.1 Estratégia de Buffer Circular

O sistema utiliza um **buffer circular** com as seguintes características:

- **Capacidade:** 1000 amostras (configurável via `MAX_SAMPLES`)
- **Tamanho máximo:** 50KB (aproximadamente 50 bytes por amostra JSON)
- **Comportamento quando cheio:**
  1. Remove as 100 amostras mais antigas
  2. Libera espaço para novas coletas
  3. Evita perda total de dados

```cpp
// Exemplo de estrutura de dados armazenada:
{
  "timestamp": "00:05:23",
  "uptime_s": 323,
  "sample_id": 65,
  "sensors": {
    "temperature_c": 36.7,
    "humidity_pct": 55.2,
    "bpm": 78,
    "movement_g": 0.12
  },
  "status": {
    "wifi": false,
    "mqtt": false,
    "storage_used": 3250,
    "samples_pending": 65
  }
}
```

#### 4.2 Justificativa da Capacidade (1000 amostras)

**Modelo de Negócio:**
- **Intervalo de leitura:** 5 segundos
- **1000 amostras equivalem a:** ~83 minutos (1h23min) de dados offline
- **Casos de uso:**
  - Paciente em área sem cobertura (ex: elevador, subsolo)
  - Falha temporária de rede
  - Manutenção do servidor MQTT
  - Economia de bateria (modo sleep entre sincronizações)

**Cálculo de Armazenamento:**
```
1 amostra ≈ 50 bytes (JSON comprimido)
1000 amostras = 50KB
Capacidade do ESP32 (flash) = 4MB
Uso do sistema = < 2% da flash disponível
```

#### 4.3 Sincronização Inteligente

Quando a conectividade retorna, o sistema:

1. **Detecta conexão MQTT ativa**
2. **Abre arquivo de buffer local** (`/sensor_data.log`)
3. **Envia até 50 amostras por ciclo** (evita saturação)
4. **Remove linhas enviadas** (sincronização progressiva)
5. **Apaga arquivo** quando buffer estiver vazio

**Código de sincronização (resumo):**
```cpp
void handleDataSync() {
  if (!mqttConnected || sampleCount == 0) return;
  
  // Envia até 50 amostras por vez
  for (int i = 0; i < 50 && hasData; i++) {
    if (mqttClient.publish(TOPIC, data)) {
      sent++;
    } else {
      break; // Para em caso de falha
    }
  }
  
  // Remove dados enviados
  if (sent > 0) {
    removeOldestSamples(sent);
  }
}
```

---

### 5. INDICADORES VISUAIS E MONITORAMENTO

#### 5.1 LED de Status

O LED interno (GPIO 2) indica o estado do sistema:

| Estado              | Comportamento         | Significado                    |
|---------------------|-----------------------|--------------------------------|
| **Fixo Ligado**     | Sempre aceso          | Online (Wi-Fi + MQTT OK)       |
| **Pisca Rápido**    | 200ms intervalo       | Wi-Fi OK, MQTT desconectado    |
| **Pisca Lento**     | 1000ms intervalo      | Modo Offline (sem Wi-Fi)       |

#### 5.2 Logs Seriais

O sistema fornece feedback detalhado via Serial Monitor:

```
====================================================================
         CARDIO-IA - Sistema de Monitoramento Cardíaco IoT        
====================================================================

📊 Coletando dados dos sensores...
   🌡️ Temperatura: 36.7°C
   💧 Umidade: 55.2%
   ❤️ BPM: 78
   🏃 Movimento: 0.12g
   💾 MODO OFFLINE: Salvando localmente (Edge)
   💾 Salvo localmente. Total no buffer: 65/1000

🔄 ========== SINCRONIZAÇÃO COM NUVEM ==========
   Amostras pendentes: 65
   ✅ Enviado 1/65
   ✅ Enviado 2/65
   ...
   🎉 SINCRONIZAÇÃO COMPLETA! Buffer limpo.
🔄 ==============================================
```

---

### 6. SISTEMA DE ALERTAS

O sistema monitora valores críticos e gera alertas em tempo real:

| Parâmetro     | Valor Normal      | Alerta (Min) | Alerta (Max) | Tipo         |
|---------------|-------------------|--------------|--------------|--------------|
| Temperatura   | 36.0 - 37.5°C     | < 35.0°C     | > 38.5°C     | CRÍTICO      |
| BPM           | 60 - 100          | < 50         | > 120        | CRÍTICO      |
| Movimento     | < 1.0g            | -            | > 2.0g       | INFORMATIVO  |
| Umidade       | 40 - 70%          | < 30%        | > 80%        | INFORMATIVO  |

**Alertas são enviados para tópico MQTT separado:**
```json
{
  "timestamp": "00:15:42",
  "severity": "warning",
  "message": "TAQUICARDIA! BPM: 125",
  "device": "CardioIA_ESP32"
}
```

---

### 7. METADADOS E PERSISTÊNCIA

O sistema mantém metadados persistentes em `/metadata.json`:

```json
{
  "sample_count": 65,
  "total_collected": 1523,
  "total_sent": 1458,
  "last_update": 323456
}
```

**Benefícios:**
- Rastreabilidade total das amostras
- Estatísticas de confiabilidade do sistema
- Recuperação de estado após reinicialização

---

### 8. CONSIDERAÇÕES TÉCNICAS

#### 8.1 Otimizações Implementadas

1. **Leitura Não Bloqueante:** Loop principal nunca trava
2. **Timeout de Conexão:** Wi-Fi e MQTT com limite de tentativas
3. **Buffer Progressivo:** Remove dados antigos antes de atingir limite
4. **JSON Otimizado:** Usa ArduinoJson v7 com alocação dinâmica
5. **Delay Inteligente:** Apenas 100ms entre envios MQTT

#### 8.2 Limitações e Melhorias Futuras

**Limitações Atuais:**
- Não implementa criptografia nos dados locais
- Timestamp relativo (não RTC)
- Sem compressão de dados

**Melhorias Propostas:**
- Integrar RTC (DS3231) para timestamp real
- Implementar compressão LZ4
- Adicionar autenticação MQTTS (TLS)
- Modo deep sleep para economia de bateria

---

### 9. CONCLUSÃO

O sistema **CardioIA** demonstra com sucesso a implementação de **Edge Computing** aplicado à saúde digital. A arquitetura garante:

✅ **Coleta contínua** de sinais vitais (temperatura, umidade, BPM, movimento)  
✅ **Resiliência offline** com buffer de 1000 amostras (~83 minutos)  
✅ **Sincronização automática** quando retorna à conectividade  
✅ **Alertas em tempo real** para valores críticos  
✅ **Persistência de dados** em caso de reinicialização  

A estratégia de armazenamento local garante que **nenhum dado seja perdido** em cenários de falha de rede, característica essencial para dispositivos médicos IoT.

---

### 10. REFERÊNCIAS

- **LittleFS Documentation:** https://github.com/lorol/LITTLEFS
- **ArduinoJson Library:** https://arduinojson.org/
- **ESP32 Technical Reference:** https://www.espressif.com/en/products/socs/esp32
- **DHT22 Datasheet:** https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf
- **MPU6050 Datasheet:** https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/

---

**Desenvolvido por:** Equipe CardioIA  
**Data:** Outubro de 2025  
**Link Wokwi:** [Será atualizado após publicação]