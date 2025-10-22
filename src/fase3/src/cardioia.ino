/*
 * ====================================================================
 * PROJETO CARDIO-IA - Sistema de Monitoramento Cardíaco IoT
 * ====================================================================
 * Descrição: Sistema completo de monitoramento de sinais vitais com
 *            Edge Computing, resiliência offline e transmissão MQTT
 * 
 * PARTE 1: Armazenamento Local e Processamento Edge
 * PARTE 2: Transmissão Cloud e Visualização em Dashboard
 * 
 * Sensores Utilizados:
 *   1. DHT22 - Temperatura e Umidade (obrigatório)
 *   2. Potenciômetro - Simulador de BPM/Frequência Cardíaca
 *   3. MPU6050 - Acelerômetro/Giroscópio (detecção de movimento)
 * 
 * Plataforma: ESP32 DevKit V1
 * Sistema de Arquivos: LittleFS (Edge Storage)
 * Protocolo: MQTT/MQTTS (HiveMQ Cloud)
 * Dashboard: Node-RED / Grafana
 * 
 * Características:
 *   - Resiliência offline com buffer circular de 1000 amostras
 *   - Sincronização automática quando retorna online
 *   - Indicadores visuais (LED de status)
 *   - Alertas para valores críticos
 *   - Timestamp com precisão de milissegundos
 * ====================================================================
 */

// --- Inclusão Obrigatória para PlatformIO ---
#include <Arduino.h> 

// --- Bibliotecas de Conexão ---
#include <WiFi.h>
#include <WiFiClientSecure.h> // Para MQTTS (porta 8883)
#include <PubSubClient.h>      // Para MQTT

// --- Bibliotecas de Sensores e Armazenamento ---
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// Define para compatibilidade (usar SPIFFS ao invés de LittleFS)
#define LittleFS SPIFFS

// ====================================================================
// CONFIGURAÇÕES - PREENCHA COM SEUS DADOS!
// ====================================================================

// --- Wi-Fi ---
const char* WIFI_SSID = "Wokwi-GUEST";  // Para Wokwi usar "Wokwi-GUEST"
const char* WIFI_PASS = "";              // Wokwi não precisa de senha

// --- MQTT Broker ---
const char* MQTT_BROKER = "d5d56acfdf724f63a63b8281697371d1.s1.eu.hivemq.cloud";
const int   MQTT_PORT = 8883;
const char* MQTT_USER = "fiap-123";
const char* MQTT_PASS = "Vaicorinthians123"; 

// --- Tópicos MQTT ---
const char* MQTT_TOPIC_DATA = "cardioIA/health/data";      // Dados dos sensores
const char* MQTT_TOPIC_ALERT = "cardioIA/health/alert";    // Alertas críticos
const char* MQTT_TOPIC_STATUS = "cardioIA/health/status";  // Status do sistema

// ====================================================================
// CONFIGURAÇÕES DOS SENSORES
// ====================================================================

// --- Sensor DHT22 (Temperatura e Umidade) ---
#define DHT_PIN 4
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// --- Potenciômetro (Simulador de BPM) ---
#define BPM_PIN 34  // Pino analógico ADC1

// --- MPU6050 (Acelerômetro/Giroscópio) ---
Adafruit_MPU6050 mpu;

// --- LED de Status ---
#define STATUS_LED 2  // LED interno do ESP32

// ====================================================================
// CONFIGURAÇÕES DO SISTEMA DE ARMAZENAMENTO (EDGE COMPUTING)
// ====================================================================

const char* DATA_FILE = "/sensor_data.log";
const char* METADATA_FILE = "/metadata.json";

// --- Estratégia de Resiliência ---
const int MAX_SAMPLES = 1000;           // Máximo de 1000 amostras no buffer
const int READ_INTERVAL = 500;         // Leitura a cada 5 segundos (5s)
const int SYNC_INTERVAL = 10000;        // Tentativa de sync a cada 10s
const size_t MAX_STORAGE_BYTES = 51200; // 50KB (~1000 amostras JSON)

// --- Contadores e Flags ---
unsigned long lastReadTime = 0;
unsigned long lastSyncTime = 0;
unsigned long systemStartTime = 0;
int sampleCount = 0;
int totalSamplesCollected = 0;
int totalSamplesSent = 0;
bool wifiConnected = false;
bool mqttConnected = false;
bool spiffsReady = false;  // Flag para indicar se SPIFFS está disponível

// ====================================================================
// LIMIARES DE ALERTA (Valores Críticos)
// ====================================================================

const float TEMP_MIN = 35.0;      // Hipotermia
const float TEMP_MAX = 38.5;      // Febre
const float HUMIDITY_MIN = 30.0;  // Ar muito seco
const float HUMIDITY_MAX = 80.0;  // Ar muito úmido
const int BPM_MIN = 50;           // Bradicardia
const int BPM_MAX = 120;          // Taquicardia
const float MOVEMENT_THRESHOLD = 2.0; // Movimento significativo (g)

// ====================================================================
// CLIENTES DE REDE
// ====================================================================

WiFiClientSecure wifiClient;        // Cliente Wi-Fi seguro (para TLS/SSL)
PubSubClient mqttClient(wifiClient); // Cliente MQTT

// ====================================================================
// PROTÓTIPOS DAS FUNÇÕES
// ====================================================================

// Setup e Conexões
void setup_wifi();
void reconnect_mqtt();
void setup_sensors();
void setup_storage();

// Leitura de Sensores
void handleSensorReadings();
float readTemperature();
float readHumidity();
int readBPM();
float readMovement();

// Armazenamento e Sincronização
void saveDataToFile(JsonDocument& doc);
void handleDataSync();
void updateMetadata();
void loadMetadata();

// Alertas e Indicadores
void checkAlerts(float temp, float humidity, int bpm, float movement);
void publishAlert(String message, String severity);
void updateStatusLED();

// Utilitários
String getTimestamp();
void printSystemStatus();
// ====================================================================
// SETUP - Inicialização do Sistema
// ====================================================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n====================================================================");
  Serial.println("         CARDIO-IA - Sistema de Monitoramento Cardíaco IoT        ");
  Serial.println("====================================================================");
  Serial.println("Versão: 2.0");
  Serial.println("Edge Computing + Cloud Integration + Resiliência Offline");
  Serial.println("====================================================================\n");

  // Configura LED de status
  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(STATUS_LED, LOW);

  // Inicializa sistema de arquivos (Edge Storage)
  setup_storage();

  // Inicializa sensores
  setup_sensors();

  // Conecta ao Wi-Fi
  setup_wifi();

  // Configura cliente MQTT
  Serial.println("🔧 Configurando cliente MQTT...");
  Serial.printf("   Broker: %s:%d\n", MQTT_BROKER, MQTT_PORT);
  
  // Configura WiFiClientSecure para aceitar qualquer certificado (sem validação)
  wifiClient.setInsecure();
  Serial.println("   🔓 Modo inseguro ativado (sem validação de certificado)");
  
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setKeepAlive(60);
  mqttClient.setSocketTimeout(30);
  mqttClient.setBufferSize(512);  // Aumenta buffer se necessário

  // Carrega metadados do sistema
  loadMetadata();

  systemStartTime = millis();
  
  Serial.println("\n====================================================================");
  Serial.println("Sistema inicializado com sucesso!");
  Serial.println("====================================================================\n");
  
  // Publica status inicial
  if (mqttClient.connected()) {
    publishAlert("Sistema CardioIA inicializado", "info");
  }
}

// ====================================================================
// LOOP PRINCIPAL
// ====================================================================

void loop() {
  // 1. Atualiza status de conectividade
  wifiConnected = (WiFi.status() == WL_CONNECTED);
  mqttConnected = mqttClient.connected();
  
  // 2. Atualiza LED de status
  updateStatusLED();

  // 3. Mantém conexão Wi-Fi
  if (!wifiConnected) {
    Serial.println("⚠️  Wi-Fi desconectado. Modo offline ativado.");
    setup_wifi(); // Tenta reconectar
  }

  // 4. Mantém conexão MQTT
  if (wifiConnected && !mqttConnected) {
    reconnect_mqtt();
  }
  
  // 5. Mantém o cliente MQTT ativo
  if (mqttConnected) {
    mqttClient.loop();
  }

  // 6. Lê sensores periodicamente (e salva localmente - Edge Computing)
  handleSensorReadings();

  // 7. Sincroniza dados locais com a nuvem (quando online)
  if (millis() - lastSyncTime >= SYNC_INTERVAL) {
    lastSyncTime = millis();
    handleDataSync();
  }

  // 8. Imprime status do sistema a cada 30s
  static unsigned long lastStatusPrint = 0;
  if (millis() - lastStatusPrint >= 30000) {
    lastStatusPrint = millis();
    printSystemStatus();
  }
}

// ====================================================================
// SISTEMA DE ALERTAS
// ====================================================================

/**
 * @brief Verifica se os valores dos sensores estão em níveis críticos
 */
void checkAlerts(float temp, float humidity, int bpm, float movement) {
  bool alertTriggered = false;
  String alertMsg = "";
  
  // Alerta de temperatura
  if (temp < TEMP_MIN) {
    alertMsg = "HIPOTERMIA! Temperatura: " + String(temp) + "°C";
    publishAlert(alertMsg, "critical");
    alertTriggered = true;
  } else if (temp > TEMP_MAX) {
    alertMsg = "FEBRE! Temperatura: " + String(temp) + "°C";
    publishAlert(alertMsg, "warning");
    alertTriggered = true;
  }
  
  // Alerta de BPM
  if (bpm < BPM_MIN) {
    alertMsg = "BRADICARDIA! BPM: " + String(bpm);
    publishAlert(alertMsg, "critical");
    alertTriggered = true;
  } else if (bpm > BPM_MAX) {
    alertMsg = "TAQUICARDIA! BPM: " + String(bpm);
    publishAlert(alertMsg, "warning");
    alertTriggered = true;
  }
  
  // Alerta de movimento brusco
  if (movement > MOVEMENT_THRESHOLD) {
    alertMsg = "MOVIMENTO BRUSCO DETECTADO! Magnitude: " + String(movement) + "g";
    publishAlert(alertMsg, "info");
    alertTriggered = true;
  }
  
  // Alerta de umidade
  if (humidity < HUMIDITY_MIN || humidity > HUMIDITY_MAX) {
    alertMsg = "Umidade fora do ideal: " + String(humidity) + "%";
    publishAlert(alertMsg, "info");
    alertTriggered = true;
  }
  
  if (alertTriggered) {
    Serial.println("   🚨 ALERTA ACIONADO!");
  }
}

/**
 * @brief Publica alerta no tópico MQTT de alertas
 */
void publishAlert(String message, String severity) {
  if (!mqttConnected) return;
  
  JsonDocument alertDoc;
  alertDoc["timestamp"] = getTimestamp();
  alertDoc["severity"] = severity;
  alertDoc["message"] = message;
  alertDoc["device"] = "CardioIA_ESP32";
  
  String payload;
  serializeJson(alertDoc, payload);
  
  mqttClient.publish(MQTT_TOPIC_ALERT, payload.c_str());
  
  Serial.printf("   🚨 Alerta [%s]: %s\n", severity.c_str(), message.c_str());
}

/**
 * @brief Atualiza LED de status (pisca conforme estado)
 */
void updateStatusLED() {
  static unsigned long lastBlink = 0;
  static bool ledState = false;
  unsigned long blinkInterval;
  
  if (mqttConnected) {
    // Online e conectado: LED fixo ligado
    digitalWrite(STATUS_LED, HIGH);
    return;
  } else if (wifiConnected) {
    // Wi-Fi OK mas MQTT offline: pisca rápido
    blinkInterval = 200;
  } else {
    // Totalmente offline: pisca lento
    blinkInterval = 1000;
  }
  
  if (millis() - lastBlink >= blinkInterval) {
    lastBlink = millis();
    ledState = !ledState;
    digitalWrite(STATUS_LED, ledState);
  }
}

// ====================================================================
// GERENCIAMENTO DE METADADOS
// ====================================================================

/**
 * @brief Salva metadados do sistema (contadores, estatísticas)
 */
void updateMetadata() {
  if (!spiffsReady) return; // Não salva se SPIFFS não está disponível
  
  JsonDocument meta;
  
  meta["sample_count"] = sampleCount;
  meta["total_collected"] = totalSamplesCollected;
  meta["total_sent"] = totalSamplesSent;
  meta["last_update"] = millis();
  
  File file = SPIFFS.open(METADATA_FILE, FILE_WRITE);
  if (file) {
    serializeJson(meta, file);
    file.close();
  }
}

/**
 * @brief Carrega metadados do sistema
 */
void loadMetadata() {
  if (!spiffsReady) {
    Serial.println("📋 SPIFFS não disponível. Iniciando sem metadados.");
    return;
  }
  
  File file = SPIFFS.open(METADATA_FILE, FILE_READ);
  if (!file) {
    Serial.println("📋 Nenhum metadado anterior encontrado. Iniciando do zero.");
    return;
  }
  
  JsonDocument meta;
  DeserializationError error = deserializeJson(meta, file);
  file.close();
  
  if (!error) {
    sampleCount = meta["sample_count"] | 0;
    totalSamplesCollected = meta["total_collected"] | 0;
    totalSamplesSent = meta["total_sent"] | 0;
    
    Serial.println("📋 Metadados carregados:");
    Serial.printf("   Amostras pendentes: %d\n", sampleCount);
    Serial.printf("   Total coletado: %d\n", totalSamplesCollected);
    Serial.printf("   Total enviado: %d\n", totalSamplesSent);
  }
}

// ====================================================================
// FUNÇÕES UTILITÁRIAS
// ====================================================================

/**
 * @brief Retorna timestamp formatado (ISO 8601 simplificado)
 */
String getTimestamp() {
  unsigned long uptime = (millis() - systemStartTime) / 1000;
  
  unsigned long hours = uptime / 3600;
  unsigned long minutes = (uptime % 3600) / 60;
  unsigned long seconds = uptime % 60;
  
  char buffer[32];
  sprintf(buffer, "%02lu:%02lu:%02lu", hours, minutes, seconds);
  
  return String(buffer);
}

/**
 * @brief Imprime status completo do sistema
 */
void printSystemStatus() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════════════╗");
  Serial.println("║                    STATUS DO SISTEMA CARDIO-IA                    ║");
  Serial.println("╠═══════════════════════════════════════════════════════════════════╣");
  
  // Conectividade
  Serial.printf("║ 🌐 Wi-Fi: %-10s | 📡 MQTT: %-10s                     ║\n", 
                wifiConnected ? "CONECTADO" : "OFFLINE",
                mqttConnected ? "CONECTADO" : "OFFLINE");
  
  // Armazenamento
  if (spiffsReady) {
    size_t usedBytes = SPIFFS.usedBytes();
    size_t totalBytes = SPIFFS.totalBytes();
    float usagePercent = (usedBytes * 100.0) / totalBytes;
    
    Serial.printf("║ 💾 Armazenamento: %d/%d bytes (%.1f%%)                         ║\n",
                  usedBytes, totalBytes, usagePercent);
  } else {
    Serial.println("║ 💾 Armazenamento: INDISPONÍVEL (SPIFFS não montado)            ║");
  }
  
  // Amostras
  Serial.printf("║ 📊 Buffer: %d/%d amostras                                      ║\n",
                sampleCount, MAX_SAMPLES);
  Serial.printf("║ 📈 Total coletado: %d | Total enviado: %d                     ║\n",
                totalSamplesCollected, totalSamplesSent);
  
  // Uptime
  unsigned long uptime = (millis() - systemStartTime) / 1000;
  Serial.printf("║ ⏱️  Uptime: %s                                                 ║\n",
                getTimestamp().c_str());
  
  Serial.println("╚═══════════════════════════════════════════════════════════════════╝\n");
}

// ====================================================================
// CONFIGURAÇÕES INICIAIS
// ====================================================================

/**
 * @brief Inicializa o sistema de arquivos SPIFFS (compatível com Wokwi)
 */
void setup_storage() {
  Serial.println("🔧 Inicializando sistema de arquivos (SPIFFS)...");
  
  // Tenta montar o SPIFFS (formatFormatIfFailed = true)
  if (!SPIFFS.begin(true)) {
    Serial.println("⚠️  Primeira tentativa falhou. Tentando formatar...");
    
    // Se falhar, tenta formatar explicitamente
    if (SPIFFS.format()) {
      Serial.println("✅ SPIFFS formatado!");
      
      // Tenta montar novamente após formatar
      if (!SPIFFS.begin(false)) {
        Serial.println("❌ ERRO: Falha ao montar o SPIFFS mesmo após formatação!");
        Serial.println("   Verifique a configuração de partições.");
        Serial.println("   Continuando sem armazenamento local...");
        return; // Continua sem SPIFFS
      }
    } else {
      Serial.println("❌ ERRO: Não foi possível formatar o SPIFFS!");
      Serial.println("   Continuando sem armazenamento local...");
      return; // Continua sem SPIFFS
    }
  }
  
  Serial.println("✅ SPIFFS montado com sucesso!");
  spiffsReady = true;  // Marca SPIFFS como disponível
  
  // Mostra informações do sistema de arquivos
  size_t totalBytes = SPIFFS.totalBytes();
  size_t usedBytes = SPIFFS.usedBytes();
  Serial.printf("   Total: %d bytes | Usado: %d bytes | Livre: %d bytes\n", 
                totalBytes, usedBytes, totalBytes - usedBytes);
}

/**
 * @brief Inicializa todos os sensores
 */
void setup_sensors() {
  Serial.println("\n🔧 Inicializando sensores...");
  
  // DHT22
  dht.begin();
  Serial.println("   ✅ DHT22 (Temperatura/Umidade) inicializado");
  
  // Potenciômetro BPM
  pinMode(BPM_PIN, INPUT);
  Serial.println("   ✅ Potenciômetro BPM configurado");
  
  // MPU6050 - DESABILITADO NO WOKWI (causa erros I2C)
  Serial.println("   ⚠️  MPU6050 desabilitado (não suportado no Wokwi)");
  // Wire.begin();
  // if (mpu.begin()) {
  //   Serial.println("   ✅ MPU6050 (Acelerômetro) conectado");
  //   mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  //   mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  //   mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  // } else {
  //   Serial.println("   ⚠️  MPU6050 não detectado (opcional)");
  // }
  
  Serial.println("✅ Sensores inicializados!\n");
}

/**
 * @brief Conecta ao Wi-Fi com lógica de timeout
 */
void setup_wifi() {
  Serial.println("🌐 Conectando ao Wi-Fi...");
  Serial.printf("   SSID: %s\n", WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 20) {
    delay(500);
    Serial.print(".");
    attempt++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi conectado!");
    Serial.printf("   IP: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   Sinal: %d dBm\n", WiFi.RSSI());
    wifiConnected = true;
  } else {
    Serial.println("\n⚠️  Falha ao conectar ao Wi-Fi.");
    Serial.println("   Sistema operará em modo OFFLINE.");
    wifiConnected = false;
  }
}

/**
 * @brief (Re)conecta ao broker MQTT
 */
void reconnect_mqtt() {
  if (!wifiConnected) {
    Serial.println("📡 Wi-Fi não conectado. Impossível conectar ao MQTT.");
    return;
  }
  
  // Tenta reconectar apenas uma vez (não bloqueia)
  if (!mqttClient.connected()) {
    Serial.println("📡 Conectando ao MQTT Broker...");
    Serial.printf("   Broker: %s:%d\n", MQTT_BROKER, MQTT_PORT);
    
    String clientId = "CardioIA_ESP32_" + String(random(0xffff), HEX);
    Serial.printf("   Client ID: %s\n", clientId.c_str());
    
    bool connected;
    if (strlen(MQTT_USER) > 0) {
      Serial.printf("   Autenticação: %s\n", MQTT_USER);
      connected = mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS);
    } else {
      Serial.println("   Autenticação: Sem credenciais");
      connected = mqttClient.connect(clientId.c_str());
    }
    
    if (connected) {
      Serial.println(" ✅ MQTT Conectado!");
      mqttConnected = true;
      
      // Publica status de conexão
      String statusMsg = "{\"status\":\"online\",\"uptime\":" + 
                         String((millis() - systemStartTime) / 1000) + "}";
      mqttClient.publish(MQTT_TOPIC_STATUS, statusMsg.c_str(), true);
    } else {
      int state = mqttClient.state();
      Serial.printf(" ❌ Falha ao conectar! Código: %d\n", state);
      
      // Decodifica o erro
      switch(state) {
        case -4: Serial.println("   Erro: MQTT_CONNECTION_TIMEOUT - Timeout na conexão"); break;
        case -3: Serial.println("   Erro: MQTT_CONNECTION_LOST - Conexão perdida"); break;
        case -2: Serial.println("   Erro: MQTT_CONNECT_FAILED - Falha ao conectar"); break;
        case -1: Serial.println("   Erro: MQTT_DISCONNECTED - Desconectado"); break;
        case  1: Serial.println("   Erro: MQTT_CONNECT_BAD_PROTOCOL - Protocolo inválido"); break;
        case  2: Serial.println("   Erro: MQTT_CONNECT_BAD_CLIENT_ID - Client ID rejeitado"); break;
        case  3: Serial.println("   Erro: MQTT_CONNECT_UNAVAILABLE - Servidor indisponível"); break;
        case  4: Serial.println("   Erro: MQTT_CONNECT_BAD_CREDENTIALS - Credenciais inválidas"); break;
        case  5: Serial.println("   Erro: MQTT_CONNECT_UNAUTHORIZED - Não autorizado"); break;
        default: Serial.println("   Erro: Código desconhecido"); break;
      }
      
      mqttConnected = false;
    }
  }
}

// ====================================================================
// LEITURA DE SENSORES
// ====================================================================

/**
 * @brief Lê temperatura do DHT22 e simula temperatura corporal
 *        O DHT22 lê temperatura ambiente, então adicionamos offset
 */
float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    Serial.println("⚠️  Erro ao ler temperatura do DHT22");
    return 36.5; // Valor padrão (normal)
  }
  
  // Simula temperatura corporal baseada na ambiente
  // Se ambiente está em 24-26°C, corpo está ~36-37°C
  float bodyTemp = 36.5 + (temp - 25.0) * 0.2; // Offset simulado
  
  // Limita entre valores realistas
  if (bodyTemp < 35.0) bodyTemp = 35.5;
  if (bodyTemp > 40.0) bodyTemp = 39.5;
  
  return bodyTemp;
}

/**
 * @brief Lê umidade do DHT22
 */
float readHumidity() {
  float humidity = dht.readHumidity();
  if (isnan(humidity)) {
    Serial.println("⚠️  Erro ao ler umidade do DHT22");
    return 50.0; // Valor padrão
  }
  return humidity;
}

/**
 * @brief Lê BPM do potenciômetro
 */
int readBPM() {
  int rawValue = analogRead(BPM_PIN);
  // Mapeia de 0-4095 para 50-150 BPM (faixa realista)
  int bpm = map(rawValue, 0, 4095, 50, 150);
  return bpm;
}

/**
 * @brief Simula movimento/aceleração (MPU6050 desabilitado no Wokwi)
 */
float readMovement() {
  // MPU6050 causa erros I2C no Wokwi, então retornamos valor simulado
  // Simula repouso com pequenas variações aleatórias
  float baseMovement = 0.05; // Repouso (baixo)
  float variation = (random(0, 20) - 10) / 100.0; // -0.1 a +0.1
  
  return baseMovement + variation;
  
  // CÓDIGO ORIGINAL COMENTADO (para uso em ESP32 físico):
  // sensors_event_t a, g, temp;
  // if (!mpu.getEvent(&a, &g, &temp)) {
  //   return 0.05;
  // }
  // float axG = a.acceleration.x / 9.81;
  // float ayG = a.acceleration.y / 9.81;
  // float azG = a.acceleration.z / 9.81;
  // float magnitude = sqrt(axG*axG + ayG*ayG + (azG-1)*(azG-1));
  // return magnitude;
}

/**
 * @brief Função principal de leitura de sensores
 *        Coleta dados e salva localmente (Edge Computing)
 */
void handleSensorReadings() {
  if (millis() - lastReadTime < READ_INTERVAL) {
    return; // Ainda não é hora de ler
  }
  
  lastReadTime = millis();

  Serial.println("\n📊 Coletando dados dos sensores...");

  // Lê todos os sensores
  float temperature = readTemperature();
  float humidity = readHumidity();
  int bpm = readBPM();
  float movement = readMovement();

  // Cria documento JSON com os dados
  JsonDocument doc;
  
  doc["timestamp"] = getTimestamp();
  doc["uptime_s"] = (millis() - systemStartTime) / 1000;
  doc["sample_id"] = totalSamplesCollected + 1;
  
  // Dados dos sensores
  JsonObject sensors = doc["sensors"].to<JsonObject>();
  sensors["temperature_c"] = round(temperature * 10) / 10.0;
  sensors["humidity_pct"] = round(humidity * 10) / 10.0;
  sensors["bpm"] = bpm;
  sensors["movement_g"] = round(movement * 100) / 100.0;
  
  // Status do sistema
  JsonObject status = doc["status"].to<JsonObject>();
  status["wifi"] = wifiConnected;
  status["mqtt"] = mqttConnected;
  status["storage_used"] = spiffsReady ? SPIFFS.usedBytes() : 0;
  status["samples_pending"] = sampleCount;
  status["uptime"] = (millis() - systemStartTime) / 1000;
  status["status"] = "online";

  // Imprime dados coletados (força flush após cada linha)
  Serial.print("   🌡️  Temperatura: ");
  Serial.print(temperature, 1);
  Serial.println("°C");
  
  Serial.print("   💧 Umidade: ");
  Serial.print(humidity, 1);
  Serial.println("%");
  
  Serial.print("   ❤️  BPM: ");
  Serial.println(bpm);
  
  Serial.print("   🏃 Movimento: ");
  Serial.print(movement, 2);
  Serial.println("g");

  // Verifica alertas críticos
  checkAlerts(temperature, humidity, bpm, movement);

  // Se estiver online E conectado ao MQTT, envia direto
  if (wifiConnected && mqttConnected) {
    String payload;
    serializeJson(doc, payload);
    
    // DEBUG: Mostra JSON que será enviado
    Serial.println("   📤 JSON enviado:");
    Serial.println("   " + payload);
    
    if (mqttClient.publish(MQTT_TOPIC_DATA, payload.c_str())) {
      Serial.println("   ✅ Enviado para a nuvem (MQTT)");
      totalSamplesSent++;
      totalSamplesCollected++;
      
      // Publica status separadamente
      JsonDocument statusDoc;
      statusDoc["status"] = "online";
      statusDoc["uptime"] = (millis() - systemStartTime) / 1000;
      statusDoc["wifi"] = wifiConnected;
      statusDoc["mqtt"] = mqttConnected;
      
      String statusPayload;
      serializeJson(statusDoc, statusPayload);
      mqttClient.publish(MQTT_TOPIC_STATUS, statusPayload.c_str());
      
    } else {
      Serial.println("   ⚠️  Falha ao enviar. Salvando localmente...");
      saveDataToFile(doc);
    }
  } else {
    // Modo offline: salva localmente (Edge Storage)
    Serial.println("   💾 MODO OFFLINE: Salvando localmente (Edge)");
    saveDataToFile(doc);
  }
}

// ====================================================================
// ARMAZENAMENTO LOCAL (EDGE COMPUTING)
// ====================================================================

/**
 * @brief Salva dados no SPIFFS com controle de limite
 *        Implementa buffer circular de 1000 amostras
 */
void saveDataToFile(JsonDocument& doc) {
  // Verifica se SPIFFS está disponível
  if (!spiffsReady) {
    return; // Não tenta salvar se SPIFFS não está montado
  }
  
  // Verifica se já atingiu o limite de amostras
  if (sampleCount >= MAX_SAMPLES) {
    Serial.println("⚠️  BUFFER CHEIO! Descartando amostra mais antiga...");
    
    // Estratégia: Remove as primeiras 100 amostras para liberar espaço
    File fileOld = SPIFFS.open(DATA_FILE, FILE_READ);
    File fileNew = SPIFFS.open("/temp.log", FILE_WRITE);
    
    if (fileOld && fileNew) {
      int linesToSkip = 100;
      int currentLine = 0;
      
      while (fileOld.available()) {
        String line = fileOld.readStringUntil('\n');
        currentLine++;
        if (currentLine > linesToSkip) {
          fileNew.println(line);
        }
      }
      
      fileOld.close();
      fileNew.close();
      
      SPIFFS.remove(DATA_FILE);
      SPIFFS.rename("/temp.log", DATA_FILE);
      
      sampleCount -= linesToSkip;
      Serial.printf("   ♻️  Buffer otimizado. Amostras: %d\n", sampleCount);
    }
  }

  // Abre arquivo para adicionar dados
  File file = SPIFFS.open(DATA_FILE, FILE_APPEND);
  if (!file) {
    Serial.println("❌ Erro ao abrir arquivo para escrita!");
    return;
  }
  
  // Serializa JSON e salva
  String jsonString;
  serializeJson(doc, jsonString);
  file.println(jsonString);
  file.close();
  
  sampleCount++;
  totalSamplesCollected++;
  
  Serial.printf("   💾 Salvo localmente. Total no buffer: %d/%d\n", 
                sampleCount, MAX_SAMPLES);
  
  updateMetadata();
}

/**
 * @brief Sincroniza dados locais com a nuvem via MQTT
 *        Chamado periodicamente quando há conexão
 */
void handleDataSync() {
  // Só sincroniza se SPIFFS estiver disponível, MQTT conectado e houver dados
  if (!spiffsReady || !mqttConnected || sampleCount == 0) {
    return;
  }

  File file = SPIFFS.open(DATA_FILE, FILE_READ);
  
  if (!file || file.size() == 0) {
    if (file) file.close();
    return;
  }

  Serial.println("\n🔄 ========== SINCRONIZAÇÃO COM NUVEM ==========");
  Serial.printf("   Amostras pendentes: %d\n", sampleCount);
  
  int sent = 0;
  int failed = 0;
  
  // Lê e envia linha por linha
  while (file.available() && sent < 50) { // Limita a 50 por vez
    String line = file.readStringUntil('\n');
    line.trim();
    
    if (line.length() == 0) continue;

    // Publica no MQTT
    if (mqttClient.publish(MQTT_TOPIC_DATA, line.c_str(), false)) {
      sent++;
      totalSamplesSent++;
      Serial.printf("   ✅ Enviado %d/%d\n", sent, sampleCount);
      delay(100); // Evita sobrecarga
    } else {
      failed++;
      Serial.println("   ❌ Falha ao publicar!");
      break; // Para a sincronização
    }
  }
  
  file.close();
  
  // Se enviou todas as amostras, limpa o arquivo
  if (sent > 0 && failed == 0 && !file.available()) {
    SPIFFS.remove(DATA_FILE);
    sampleCount = 0;
    Serial.println("   🎉 SINCRONIZAÇÃO COMPLETA! Buffer limpo.");
    updateMetadata();
  } else if (sent > 0) {
    // Remove apenas as linhas enviadas
    File fileOld = SPIFFS.open(DATA_FILE, FILE_READ);
    File fileNew = SPIFFS.open("/temp.log", FILE_WRITE);
    
    if (fileOld && fileNew) {
      int skipped = 0;
      while (fileOld.available()) {
        String line = fileOld.readStringUntil('\n');
        if (skipped < sent) {
          skipped++;
        } else {
          fileNew.println(line);
        }
      }
      fileOld.close();
      fileNew.close();
      
      SPIFFS.remove(DATA_FILE);
      SPIFFS.rename("/temp.log", DATA_FILE);
      
      sampleCount -= sent;
      Serial.printf("   ⏳ Sincronização parcial. Restam %d amostras.\n", sampleCount);
      updateMetadata();
    }
  }
  
  Serial.println("🔄 ==============================================\n");
}