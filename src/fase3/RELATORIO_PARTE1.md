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
4. **Simulação de Movimento** - Algoritmo em software para detecção de atividade
   - Detecta movimento e atividade física através de padrões simulados
5. **LED de Status** - Indicador visual de conectividade

#### 2.2 Software e Bibliotecas

- **Sistema de Armazenamento:** Buffer RAM (memória volátil)
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
│ Inicializa      │
│ Buffer RAM      │ ◄── Array circular de 100 posições
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Inicializa      │
│ Sensores        │ ◄── DHT22, Potenciômetro
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
    │ para     │   │ Buffer RAM   │
    │ Nuvem    │   │ (Edge)       │
    └──────────┘   └──────────────┘
```

---

### 4. LÓGICA DE RESILIÊNCIA OFFLINE

A implementação de **Edge Computing** garante que o sistema funcione de forma autônoma, mesmo sem conectividade. Esta é uma característica crítica para dispositivos médicos.

#### 4.1 Estratégia de Buffer Circular

O sistema utiliza um **buffer circular em RAM** com as seguintes características:

- **Capacidade:** 100 amostras (configurável via `MAX_SAMPLES`)
- **Tamanho máximo:** ~5KB (aproximadamente 50 bytes por amostra JSON)
- **Comportamento quando cheio:**
  1. Sobrescreve as amostras mais antigas (FIFO)
  2. Mantém sempre as 100 medições mais recentes
  3. Evita overflow de memória

**Vantagens do Buffer RAM:**
- ✅ Compatível com Wokwi (sem necessidade de filesystem)
- ✅ Acesso rápido (sem I/O de disco)
- ✅ Simplicidade de implementação
- ✅ Menor consumo de energia

**Desvantagens:**
- ⚠️ Dados perdidos em caso de queda de energia
- ⚠️ Capacidade limitada pela RAM disponível

```cpp
// Exemplo de estrutura de dados armazenada:
{
  "timestamp": "00:05:23",
  "uptime_s": 323,
  "sample_id": 65,
  "sensors": {
    "temperature_c": 36.7,
    "humidity_pct": 55.2,
    "bpm": 78
  },
  "status": {
    "wifi": false,
    "mqtt": false,
    "samples_pending": 65
  }
}
```

#### 4.2 Justificativa da Capacidade (100 amostras)

**Modelo de Negócio:**
- **Intervalo de leitura:** 5 segundos
- **100 amostras equivalem a:** ~8 minutos de dados offline
- **Casos de uso:**
  - Paciente em área sem cobertura (ex: elevador, subsolo)
  - Falha temporária de rede
  - Manutenção do servidor MQTT
  - Economia de bateria (modo sleep entre sincronizações)

**Cálculo de Armazenamento:**
```
1 amostra ≈ 50 bytes (JSON)
100 amostras = 5KB
Capacidade do ESP32 (RAM) = 320KB
Uso do buffer = ~1.5% da RAM disponível
```

#### 4.3 Sincronização Inteligente

Quando a conectividade retorna, o sistema:

1. **Detecta conexão MQTT ativa**
2. **Lê buffer RAM circular** (via índices de leitura/escrita)
3. **Envia até 50 amostras por ciclo** (evita saturação)
4. **Atualiza índices** (sincronização progressiva)
5. **Marca buffer como vazio** quando todos os dados forem enviados

**Código de sincronização (resumo):**
```cpp
void handleDataSync() {
  if (!mqttConnected || bufferCount == 0) return;
  
  // Envia até 50 amostras por vez
  int sent = 0;
  for (int i = 0; i < 50 && bufferCount > 0; i++) {
    String data = dataBuffer[bufferReadIndex];
    if (mqttClient.publish(TOPIC, data.c_str())) {
      sent++;
      bufferReadIndex = (bufferReadIndex + 1) % MAX_SAMPLES;
      bufferCount--;
    } else {
      break; // Para em caso de falha
    }
  }
}
```
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
   💾 MODO OFFLINE: Salvando no buffer RAM  
   💾 Salvo no buffer. Total: 65/100  

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

### 7. CONSIDERAÇÕES TÉCNICAS

#### 7.1 Otimizações Implementadas

1. **Leitura Não Bloqueante:** Loop principal nunca trava
2. **Timeout de Conexão:** Wi-Fi e MQTT com limite de tentativas
3. **Buffer Circular RAM:** Sobrescreve automaticamente dados antigos (FIFO)
4. **JSON Otimizado:** Usa ArduinoJson v7 com alocação dinâmica
5. **Delay Inteligente:** Apenas 100ms entre envios MQTT

#### 7.2 Limitações e Melhorias Futuras

**Limitações Atuais:**
- Dados voláteis (perdidos em caso de queda de energia)
- Timestamp relativo (não RTC)
- Capacidade limitada a 100 amostras (~8 minutos)
- Sem compressão de dados

**Melhorias Propostas:**
- Integrar RTC (DS3231) para timestamp real
- Implementar backup em EEPROM para dados críticos
- Adicionar autenticação MQTTS (TLS)
- Modo deep sleep para economia de bateria
- Aumentar buffer se houver RAM disponível

---

### 8. CONCLUSÃO

O sistema **CardioIA** demonstra com sucesso a implementação de **Edge Computing** aplicado à saúde digital. A arquitetura garante:

✅ **Coleta contínua** de sinais vitais (temperatura, umidade, BPM)  
✅ **Resiliência offline** com buffer RAM de 100 amostras (~8 minutos)  
✅ **Sincronização automática** quando retorna à conectividade  
✅ **Alertas em tempo real** para valores críticos  
✅ **Compatibilidade total** com simulador Wokwi  

A estratégia de buffer RAM oferece **simplicidade e confiabilidade** para o ambiente de simulação, garantindo que dados recentes sejam preservados durante falhas temporárias de rede, característica essencial para dispositivos médicos IoT.

---

### 9. REFERÊNCIAS

- **ArduinoJson Library:** https://arduinojson.org/
- **ESP32 Technical Reference:** https://www.espressif.com/en/products/socs/esp32
- **DHT22 Datasheet:** https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf
- **PubSubClient (MQTT):** https://github.com/knolleary/pubsubclient

---

**Desenvolvido por:** Equipe CardioIA  
**Data:** Outubro de 2025  
**Link Wokwi:** [Projeto Wokwi](https://wokwi.com/projects/445451270741656577)