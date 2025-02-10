#include <WiFi.h>
#include <HTTPClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Credenciales WiFi
#define WIFI_SSID "Suda"
#define WIFI_PASSWORD ""

// URL del backend NestJS
#define BACKEND_URL "http://10.0.1.241:3000/stats/spaces"

// Pines para los sensores HCSR04
#define TRIG1 14
#define ECHO1 12
#define TRIG2 25
#define ECHO2 26
#define TRIG3 27
#define ECHO3 32

// Pines para los LEDs
#define LED_GREEN1 4
#define LED_RED1 5
#define LED_GREEN2 16
#define LED_RED2 17
#define LED_GREEN3 18
#define LED_RED3 19

// Umbral de distancia para considerar espacio ocupado
#define THRESHOLD_DISTANCE 5 // Ajusta este valor según sea necesario

// Variables para medir ocupación
bool space1Occupied = false;
bool space2Occupied = false;
bool space3Occupied = false;

unsigned long startTime1 = 0;
unsigned long startTime2 = 0;
unsigned long startTime3 = 0;

// Configuración de NTP para obtener la hora
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// Función para medir distancia
long measureDistance(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    return duration * 0.034 / 2; // Convertir a cm
}

// Función para medir distancia promedio
long measureAverageDistance(int trigPin, int echoPin, int samples = 5) {
    long sum = 0;
    for (int i = 0; i < samples; i++) {
        sum += measureDistance(trigPin, echoPin);
        delay(50); // Pequeño retardo entre mediciones
    }
    return sum / samples; // Retorna el promedio
}

// Configuración inicial
void setup() {
    // Inicializar Serial
    Serial.begin(115200);

    // Configurar pines de los sensores
    pinMode(TRIG1, OUTPUT);
    pinMode(ECHO1, INPUT);
    pinMode(TRIG2, OUTPUT);
    pinMode(ECHO2, INPUT);
    pinMode(TRIG3, OUTPUT);
    pinMode(ECHO3, INPUT);

    // Configurar pines de los LEDs
    pinMode(LED_GREEN1, OUTPUT);
    pinMode(LED_RED1, OUTPUT);
    pinMode(LED_GREEN2, OUTPUT);
    pinMode(LED_RED2, OUTPUT);
    pinMode(LED_GREEN3, OUTPUT);
    pinMode(LED_RED3, OUTPUT);

    // Configurar conexión WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConectado al WiFi");

    // Inicializar NTP
    timeClient.begin();
    timeClient.setTimeOffset(-18000); // Ajustar según tu zona horaria (ejemplo: -18000 para GMT-5)

    // Esperar a que el NTPClient obtenga la hora actual
    while (!timeClient.update()) {
        Serial.println("Esperando sincronización con el servidor NTP...");
        delay(1000);
    }
    Serial.println("Hora sincronizada con el servidor NTP");
}

// Obtener la fecha y hora actual en formato ISO 8601
String getFormattedDateTime() {
    if (!timeClient.update()) {
        Serial.println("Error al obtener la hora del servidor NTP");
        return "1970-01-01T00:00:00.000Z"; // Fecha por defecto en caso de error
    }

    unsigned long epochTime = timeClient.getEpochTime();
    struct tm *ptm = gmtime((time_t *)&epochTime);

    char dateTime[30];
    sprintf(dateTime, "%04d-%02d-%02dT%02d:%02d:%02d.000Z",
            ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday,
            ptm->tm_hour, ptm->tm_min, ptm->tm_sec);

    return String(dateTime);
}

// Función para enviar datos al backend
void sendDataToBackend(int spaceId, bool occupied, unsigned long startTime, unsigned long endTime) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(BACKEND_URL);
        http.addHeader("Content-Type", "application/json");

        // Crear el payload JSON
        String jsonPayload = "{\"spaceId\":\"" + String(spaceId) + "\",\"occupied\":" + (occupied ? "true" : "false") + ",\"startTime\":" + String(startTime) + ",\"endTime\":" + String(endTime) + ",\"duration\":" + String((endTime - startTime) / 1000) + ",\"dateTime\":\"" + getFormattedDateTime() + "\"}";
        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println(httpResponseCode);
            Serial.println(response);
        } else {
            Serial.print("Error on sending POST: ");
            Serial.println(httpResponseCode);
        }

        http.end();
    } else {
        Serial.println("WiFi Disconnected");
    }
}

// Lógica para manejar ocupación de espacios
bool updateSpaceStatus(int spaceId, long distance, bool &occupied, unsigned long &startTime, int ledGreen, int ledRed) {
    bool changed = false;

    if (distance < THRESHOLD_DISTANCE) { // Ocupado
        if (!occupied) {
            startTime = millis();
            occupied = true;
            digitalWrite(ledGreen, LOW);
            digitalWrite(ledRed, HIGH);
            changed = true;
        }
    } else { // Desocupado
        if (occupied) {
            occupied = false;
            digitalWrite(ledGreen, HIGH);
            digitalWrite(ledRed, LOW);
            changed = true;
        }
    }

    return changed;
}

void loop() {
    // Medir distancias
    long distance1 = measureAverageDistance(TRIG1, ECHO1);
    long distance2 = measureAverageDistance(TRIG2, ECHO2);
    long distance3 = measureAverageDistance(TRIG3, ECHO3);

    // Actualizar estado de cada espacio
    bool space1Changed = updateSpaceStatus(1, distance1, space1Occupied, startTime1, LED_GREEN1, LED_RED1);
    bool space2Changed = updateSpaceStatus(2, distance2, space2Occupied, startTime2, LED_GREEN2, LED_RED2);
    bool space3Changed = updateSpaceStatus(3, distance3, space3Occupied, startTime3, LED_GREEN3, LED_RED3);

    // Enviar datos solo si hubo cambios
    if (space1Changed) {
        sendDataToBackend(1, space1Occupied, startTime1, space1Occupied ? 0 : millis());
    }
    if (space2Changed) {
        sendDataToBackend(2, space2Occupied, startTime2, space2Occupied ? 0 : millis());
    }
    if (space3Changed) {
        sendDataToBackend(3, space3Occupied, startTime3, space3Occupied ? 0 : millis());
    }

    delay(1000); // Esperar 1 segundo antes de la siguiente medición
}
