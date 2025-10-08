# Simulador de Tasa de Error de Bit (BER) - 5G/6G

## Descripción del Proyecto

Este simulador permite analizar y comparar el desempeño de sistemas de comunicación móvil 5G, 5G Avanzado y 6G en términos de la Tasa de Error de Bit (BER - Bit Error Rate). El simulador implementa una cadena completa de comunicación digital que incluye modulación, codificación de canal, transmisión a través de diferentes tipos de canales, y técnicas avanzadas de control de errores basadas en investigaciones recientes IEEE 2024 y 2022.

### Características Destacadas del Simulador

- **Técnicas FEC Modernas**: Implementación de 7 técnicas incluyendo Polar Codes, Turbo, LDPC, BCH, Reed-Solomon y Hamming
- **Métricas Avanzadas**: PAPR, EVM, Throughput Efectivo y Eficiencia Espectral
- **Escenarios 5G/6G**: Perfiles predefinidos para URLLC, eMBB y mMTC
- **Optimización Automática**: Motor inteligente que encuentra la configuración óptima FEC + Eb/N0
- **Rango Extendido**: Eb/N0 desde -5 hasta 15 dB para análisis completo
- **Visualizaciones Interactivas**: Gráficas en tiempo real de BER, constelación y comparativas

## Características Principales

### 1. Simulación por Tecnología
- **5G**: Configuración estándar con LDPC codes y QPSK
- **5G Avanzado**: Mejoras con F-OFDM, 64-QAM y LDPC optimizado
- **6G**: Tecnología de próxima generación con Polar Codes, 256-QAM y NOMA

### 2. Parámetros Configurables

#### Parámetros de Señal
- **Eb/N0 (dB)**: Rango extendido de **-5 a 15 dB** (según especificaciones IEEE)
- **Velocidad de Datos**: 1 Mbps a 10 Gbps
- **Potencia de Señal**: Calculada automáticamente basada en la modulación
- **Potencia de Ruido**: Determinada por Eb/N0 y la velocidad de datos

#### Modulación (6 esquemas)
- **BPSK** (Binary Phase Shift Keying): 1 bit/símbolo - Máxima robustez
- **QPSK** (Quadrature Phase Shift Keying): 2 bits/símbolo - Balance robustez/eficiencia
- **8-PSK**: 3 bits/símbolo - **Nuevo**, intermedio entre QPSK y 16-QAM
- **16-QAM**: 4 bits/símbolo - Alta eficiencia
- **64-QAM**: 6 bits/símbolo - 5G estándar
- **256-QAM**: 8 bits/símbolo - 6G, máxima eficiencia espectral

#### Tipo de Canal
- **AWGN** (Additive White Gaussian Noise): Canal ideal con solo ruido blanco
- **Rayleigh**: Desvanecimiento sin línea de visión directa (NLOS) - Peor caso
- **Rician**: Desvanecimiento con línea de visión directa (LOS), factor K configurable

#### Técnicas de Control de Errores (FEC) - 7 técnicas
- **Ninguna**: Sin codificación (baseline)
- **Hamming (7,4)**: Código de bloque simple, PAPR bajo (6.524 dB)
- **BCH**: Códigos cíclicos, **nuevo**, buenos para ráfagas de errores
- **Reed-Solomon**: Códigos no binarios, **nuevo**, corrección de ráfagas
- **LDPC** (Low-Density Parity-Check): Usado en 5G/5G Advanced, con LLR
- **Polar Codes**: Código de canal usado en 5G NR y 6G, óptimo para bloques cortos
- **Turbo Codes**: Código convolucional avanzado, compatibilidad 4G/5G

#### Algoritmo de Decodificación - **Nuevo**
- **Hard Decision**: Decisiones binarias, menor complejidad
- **Soft Decision (LLR)**: Usa información de confiabilidad, ~2-3 dB mejor rendimiento

#### Multiplexación
- **OFDM** (Orthogonal Frequency Division Multiplexing): Estándar 4G/5G
- **OFDMA** (OFDM Access): Acceso múltiple basado en OFDM
- **F-OFDM** (Filtered OFDM): **5G Advanced**, mejor aislamiento entre subportadoras
- **SC-FDMA** (Single Carrier FDMA): Menor PAPR para uplink
- **NOMA** (Non-Orthogonal Multiple Access): **6G**, multiplexación no ortogonal

#### Velocidad de Datos
- Rango configurable: 1 Mbps - 10 Gbps
- Afecta directamente el SNR y BER
- Calcula throughput efectivo considerando BER y FEC overhead

#### Escenarios Predefinidos - **Nuevo**
- **URLLC** (Ultra-Reliable Low Latency): Eb/N0=12 dB, QPSK, Polar, Rician
- **eMBB** (Enhanced Mobile Broadband): Eb/N0=10 dB, 64-QAM, LDPC, AWGN
- **mMTC** (Massive Machine Type Communications): Eb/N0=5 dB, BPSK, Turbo, Rayleigh

### 3. Visualización de Resultados

#### Métricas en Tiempo Real - **Ampliadas**
- **BER Simulado**: Tasa de error de bit medida
- **BER Teórico**: Basado en fórmulas analíticas
- **Ganancia de Codificación**: Mejora en dB gracias a FEC
- **Throughput Efectivo**: **Nuevo** - Tasa de bits real (Mbps)
- **Eficiencia Espectral**: **Nuevo** - bits/s/Hz
- **PAPR**: **Nuevo** - Relación potencia pico/promedio (dB)
- **EVM**: **Nuevo** - Error Vector Magnitude (%)

#### Gráficas en Tiempo Real
- **Gráfica BER vs Eb/N0**: Comparación entre BER teórico y simulado con historial
- **Constelación con EVM**: Visualización de símbolos modulados antes y después del canal
- **PAPR por Técnica**: **Planeada** - Comparación de eficiencia energética
- **Análisis Espectral (FFT)**: **Planeada** - Densidad espectral de potencia
- **Throughput y Eficiencia**: **Planeada** - Rendimiento en tiempo real

#### Tablas Comparativas
- **Tabla de Resultados**: Todos los parámetros y resultados de la simulación
- **Comparación de Tecnologías**: 5G, 5G Advanced y 6G lado a lado
- **Efectividad de FEC**: Todas las técnicas comparadas con porcentaje de mejora
- **Comparación de Canales**: AWGN, Rayleigh y Rician

### 4. Herramientas Avanzadas - **Nuevas**

#### Motor de Optimización Automática
- Encuentra la configuración óptima de FEC + Eb/N0
- Objetivo: BER < 10⁻⁶ con mínimo consumo de potencia
- Prueba todas las técnicas FEC disponibles
- Recomienda la mejor opción para el canal seleccionado

#### Análisis de Señales
- Visualización de bits de entrada vs salida
- Conteo detallado de errores de bit
- Detección de patrones de error
- Comparación visual con colores

#### Sistema de Exportación
- Exportar resultados en formato JSON
- Histórico de simulaciones guardado
- **Planeado**: Exportación de gráficas en SVG para documentos

## Fundamentos Teóricos Basados en Investigaciones IEEE

### Análisis de Documentos de Investigación

Este simulador está basado en dos estudios críticos sobre técnicas de codificación de canal para sistemas 5G y más allá:

#### Documento IEEE 2024: "Employing Efficient Decoding Algorithms"

Este estudio compara diferentes técnicas de corrección de errores mediante simulaciones MATLAB, evaluando el rendimiento de códigos BCH, Reed-Solomon, LDPC, Turbo y Polar en términos de BER vs Eb/N0.

**Hallazgos Clave**:
- **Códigos Polar con CA-SCL**: Mejor rendimiento para 5G/6G, convergen a BER ≈ 0 para Eb/N0 ≥ 1 dB
- **Códigos Turbo**: Excelente rendimiento competitivo con LDPC, BER casi nulo para Eb/N0 ≥ 1 dB
- **LDPC con LLR**: Rendimiento mejorado significativamente comparado con BCH y Reed-Solomon
- **BCH y Reed-Solomon**: Convergencia más lenta y mayores tasas BER comparados con técnicas modernas

#### Documento IEEE 2022: "Performance Analysis on Channel Encoding Techniques"

Realiza un análisis comparativo entre códigos Hamming y códigos Turbo, evaluando tanto BER como PAPR (Peak-to-Average Power Ratio) en sistemas con canales Rayleigh fading y AWGN.

**Hallazgos Clave**:
- **Códigos Hamming**: Eficientes con BER de 1.923% y PAPR más bajo (6.524 dB)
- **Códigos Turbo**: Mayor PAPR (8.062 dB) pero mejor corrección de errores
- **PAPR**: Indicador crítico de eficiencia de potencia del sistema

### Aplicabilidad por Escenario (Según Investigaciones)

| Escenario | Técnica FEC Óptima | Justificación |
|-----------|-------------------|---------------|
| **Bloques Largos** | LDPC Codes | Superiores para datos largos |
| **Bloques Cortos** | Polar Codes | Más adecuados según IEEE 2024 |
| **Altas Tasas de Datos** | Polar Codes | Superan a Turbo en throughput |
| **Eficiencia Energética** | Hamming | Menor PAPR según IEEE 2022 |
| **Ultra-Confiabilidad (URLLC)** | Polar Codes | Mejor BER con baja latencia |
| **Compatibilidad 3G/4G** | Turbo Codes | Soporte legado |

### Bit Error Rate (BER)
El BER es la relación entre el número de bits erróneos recibidos y el total de bits transmitidos:

```
BER = Número de bits con error / Total de bits transmitidos
```

**Objetivos de BER por Aplicación**:
- **Voz**: BER < 10⁻³
- **Video HD**: BER < 10⁻⁶  
- **URLLC (vehículos autónomos)**: BER < 10⁻⁹
- **eMBB (streaming 4K/8K)**: BER < 10⁻⁶

### Eb/N0 (Energy per Bit to Noise Power Spectral Density)
Representa la relación entre la energía por bit y la densidad espectral de potencia del ruido:

```
Eb/N0 (dB) = 10 * log10(Eb/N0)
```

### Modulación
La modulación convierte bits digitales en símbolos que pueden ser transmitidos:
- **BPSK**: Usa 2 puntos en el espacio de señal (1 bit/símbolo)
- **QPSK**: Usa 4 puntos (2 bits/símbolo)
- **8-PSK**: Usa 8 puntos (3 bits/símbolo) - Nuevo en este simulador
- **M-QAM**: Usa M puntos en una cuadrícula (log₂(M) bits/símbolo)

**Eficiencia Espectral vs Robustez**:
- Mayor orden de modulación = Mayor eficiencia espectral = Menor robustez
- BPSK: Más robusto, menor capacidad
- 256-QAM: Mayor capacidad, requiere mejor SNR

### Forward Error Correction (FEC)
Las técnicas FEC añaden redundancia para detectar y corregir errores:

#### Códigos Implementados (Por Generación)

**Códigos Clásicos**:
- **Hamming (7,4)**: Código de bloque lineal simple, rate 4/7, bajo PAPR (6.524 dB según IEEE 2022)
- **BCH**: Códigos cíclicos capaces de corregir múltiples errores, buenos para ráfagas
- **Reed-Solomon**: Códigos de bloque no binarios, excelentes para corrección de ráfagas de errores

**Códigos Modernos (4G/5G)**:
- **Turbo Codes**: Códigos convolucionales concatenados (4G/5G), rate 1/3, PAPR 8.062 dB
- **LDPC** (Low-Density Parity-Check): Usado en 5G/5G Advanced, rate 1/2, excelente rendimiento con LLR

**Códigos de Próxima Generación (5G NR/6G)**:
- **Polar Codes**: Alcanzan la capacidad de Shannon, rate 1/2, óptimos para bloques cortos y altas tasas

#### Comparativa de Rendimiento (Según IEEE 2024)

| Técnica FEC | Code Rate | Ganancia Codificación | Complejidad | Aplicación Ideal |
|-------------|-----------|----------------------|-------------|------------------|
| Hamming | 4/7 | ~2 dB | Muy Baja | IoT, sensores |
| BCH | 4/7 | ~3 dB | Baja | Almacenamiento |
| Reed-Solomon | 1/2 | ~4 dB | Media | Transmisión multimedia |
| Turbo | 1/3 | ~5 dB | Alta | 4G LTE, compatibilidad |
| LDPC | 1/2 | ~5 dB | Media-Alta | 5G eMBB, WiFi 6 |
| Polar | 1/2 | ~6 dB | Media | 5G NR, 6G, URLLC |

#### Decodificación Hard vs Soft Decision

**Hard Decision**:
- Toma decisiones binarias (0 o 1) inmediatas
- Menor complejidad computacional
- Pierde información de confiabilidad

**Soft Decision (LLR - Log-Likelihood Ratio)**:
- Usa información de confiabilidad de cada bit
- Mejora la ganancia de codificación ~2-3 dB
- Mayor complejidad pero mejor rendimiento
- Recomendado para LDPC y Turbo codes

### Métricas Avanzadas de Rendimiento

#### PAPR (Peak-to-Average Power Ratio)
El PAPR es un indicador crítico de eficiencia energética en sistemas OFDM:

```
PAPR (dB) = 10 * log₁₀(Potencia Pico / Potencia Promedio)
```

**Importancia**:
- PAPR alto → Requiere amplificadores con mayor rango dinámico → Mayor consumo
- PAPR bajo → Amplificadores más eficientes → Menor consumo energético
- Hamming: 6.524 dB (mejor)
- Turbo: 8.062 dB (según IEEE 2022)

**Aplicaciones**:
- Diseño de amplificadores de potencia
- Optimización de eficiencia energética en dispositivos móviles
- Evaluación de técnicas de reducción de PAPR

#### EVM (Error Vector Magnitude)
El EVM cuantifica la calidad de la modulación midiendo la desviación entre símbolos ideales y recibidos:

```
EVM (%) = 100 * √(Σ|error|² / Σ|referencia|²)
```

**Interpretación**:
- EVM < 5%: Excelente calidad de señal
- EVM 5-10%: Buena calidad
- EVM 10-20%: Calidad aceptable
- EVM > 20%: Calidad degradada

**Estándares 5G NR**:
- QPSK: EVM < 17.5%
- 16-QAM: EVM < 12.5%
- 64-QAM: EVM < 8%
- 256-QAM: EVM < 3.5%

#### Throughput Efectivo
Tasa de bits real considerando errores y overhead de FEC:

```
Throughput = DataRate * (1 - BER) * CodeRate
```

Donde:
- DataRate: Velocidad de datos configurada
- BER: Tasa de error de bit
- CodeRate: 1 / FECOverhead

#### Eficiencia Espectral
Medida de cuántos bits se transmiten por Hz de ancho de banda:

```
Eficiencia Espectral = (k * CodeRate * (1 - BER)) / Bandwidth
```

Donde:
- k: Bits por símbolo de la modulación
- Bandwidth: Ancho de banda del canal (típicamente 20 MHz para 5G)

**Objetivos 5G/6G**:
- 5G: 30 bits/s/Hz (pico), 7.8 bits/s/Hz (promedio)
- 6G: > 100 bits/s/Hz (objetivo)

### Tipos de Canal

#### AWGN (Additive White Gaussian Noise)
- Modelo más simple, solo añade ruido blanco gaussiano
- Representa canal ideal sin desvanecimiento
- Útil para establecer límites de rendimiento teóricos

#### Rayleigh Fading
- Modela desvanecimiento en entornos urbanos densos sin línea de visión (NLOS)
- Representa el peor caso de propagación
- Típico en interiores y áreas urbanas congestionadas
- BER significativamente mayor que AWGN para mismo Eb/N0

#### Rician Fading
- Modela desvanecimiento con línea de visión directa (LOS) presente
- Factor K indica la relación entre potencia LOS y potencia dispersada
- K alto (>10 dB) → Comportamiento similar a AWGN
- K bajo (<5 dB) → Comportamiento similar a Rayleigh
- Típico en áreas suburbanas y rurales

**Comparativa de BER para QPSK a Eb/N0 = 10 dB**:
- AWGN: ~10⁻⁵
- Rician (K=10 dB): ~10⁻⁴
- Rayleigh: ~10⁻²

## Cómo Usar el Simulador

### Inicio Rápido

1. Abra `index.html` en un navegador moderno (Chrome, Firefox, Edge)
2. Seleccione un escenario predefinido o configure manualmente
3. Haga clic en "Simular" para ver resultados instantáneos
4. Explore las diferentes pestañas: Resultados, Gráficas, Comparación, Señales

### Guía Detallada

#### 1. Selección de Tecnología
Seleccione la tecnología que desea simular:
- **5G**: Para estándares actuales (LDPC + QPSK por defecto)
- **5G Advanced**: Para evolución de 5G (F-OFDM + 64-QAM + LDPC)
- **6G**: Para tecnología futura (NOMA + 256-QAM + Polar)

**Nota**: Seleccionar una tecnología ajusta automáticamente modulación, FEC y multiplexación óptimas.

#### 2. Uso de Escenarios Predefinidos - **Recomendado para Principiantes**

El simulador incluye 3 escenarios optimizados según especificaciones 3GPP:

**URLLC (Ultra-Reliable Low Latency Communications)**:
- **Aplicaciones**: Vehículos autónomos, cirugía remota, control industrial
- **Configuración**: Eb/N0=12 dB, QPSK, Polar Codes, Canal Rician
- **Objetivo**: BER < 10⁻⁹, latencia < 1ms
- **Por qué**: Máxima confiabilidad, modulación robusta, canal típico de vehicular

**eMBB (Enhanced Mobile Broadband)**:
- **Aplicaciones**: Streaming 4K/8K, realidad virtual/aumentada, descarga masiva
- **Configuración**: Eb/N0=10 dB, 64-QAM, LDPC, Canal AWGN
- **Objetivo**: Máximo throughput, BER < 10⁻⁶
- **Por qué**: Alta eficiencia espectral, condiciones de canal ideales

**mMTC (Massive Machine Type Communications)**:
- **Aplicaciones**: IoT, sensores, smart cities, agricultura inteligente
- **Configuración**: Eb/N0=5 dB, BPSK, Turbo Codes, Canal Rayleigh
- **Objetivo**: Bajo consumo energético, cobertura amplia
- **Por qué**: Modulación simple, canal hostil típico de IoT, FEC robusto

#### 3. Configuración Manual de Parámetros

**Paso a Paso**:

a) **Ajustar Eb/N0** (-5 a 15 dB):
   - Valores bajos (-5 a 0 dB): Condiciones muy hostiles, alto BER
   - Valores medios (5 a 10 dB): Condiciones típicas de operación
   - Valores altos (10 a 15 dB): Condiciones ideales, BER muy bajo

b) **Seleccionar Modulación**:
   - Mayor orden → Mayor throughput → Requiere mayor Eb/N0
   - Use el selector de escenarios como guía
   - Experimente aumentando gradualmente el orden

c) **Elegir Tipo de Canal**:
   - AWGN: Para análisis teórico y límites superiores
   - Rayleigh: Para entornos urbanos densos (NLOS)
   - Rician: Para áreas suburbanas/rurales (LOS)
   - Ajuste Factor K (solo Rician): K alto → Mejor rendimiento

d) **Seleccionar Técnica FEC**:
   - Ninguna: Para establecer baseline
   - Hamming: Baja complejidad, IoT
   - BCH/Reed-Solomon: Corrección de ráfagas
   - LDPC: Estándar 5G, buen balance
   - Polar: Mejor rendimiento, 5G NR/6G
   - Turbo: Compatibilidad 4G/5G

e) **Algoritmo de Decodificación**:
   - Hard Decision: Rápido, menor rendimiento
   - Soft Decision (LLR): Más lento, ~2-3 dB mejor

f) **Velocidad de Datos**:
   - Ajuste según aplicación
   - Afecta throughput efectivo y eficiencia espectral

#### 4. Ejecutar Simulación

Haga clic en **"Simular"** para:
- Generar 2000 bits aleatorios
- Aplicar FEC seleccionado
- Modular según esquema elegido
- Transmitir a través del canal
- Demodular y decodificar
- Calcular métricas (BER, PAPR, EVM, Throughput, Eficiencia Espectral)

**Tiempo de ejecución**: < 1 segundo

#### 5. Analizar Resultados

**Pestaña Resultados**:
- **Métricas Principales**: 7 tarjetas con valores clave
  - BER Simulado (verde si < 10⁻³, rojo si mayor)
  - BER Teórico (referencia analítica)
  - Ganancia de Codificación (beneficio del FEC en dB)
  - Throughput Efectivo (Mbps reales)
  - Eficiencia Espectral (bits/s/Hz)
  - PAPR (eficiencia energética)
  - EVM (calidad de modulación)
- **Tabla de Parámetros**: Configuración completa de la simulación

**Pestaña Gráficas**:
- **BER vs Eb/N0**: Historial de simulaciones, compare teórico vs práctico
- **Diagrama de Constelación**: Observe degradación por canal
  - Puntos azules: Símbolos transmitidos (ideales)
  - Puntos rosados: Símbolos recibidos (con ruido)
  - Dispersión indica calidad del canal

**Pestaña Comparación**:
- **Comparar Tecnologías**: Click botón para ver 5G vs 5G-A vs 6G
- **Comparar Canales y FEC**: Click botón para matriz completa
- **Gráficas de Barras**: Visualización comparativa

**Pestaña Señales**:
- **Bits de Entrada**: Secuencia original
- **Bits de Salida**: Secuencia decodificada
- **Errores Detectados**: Lista de posiciones con error

#### 6. Funciones Avanzadas

**Optimización Automática**:
1. Configure modulación y canal deseados
2. Click en **"Optimización Automática"**
3. El simulador prueba todas las FEC y encuentra:
   - FEC óptimo para BER < 10⁻⁶
   - Eb/N0 mínimo necesario
4. Aplica configuración automáticamente
5. Ejecuta simulación con parámetros óptimos

**Comparar Tecnologías**:
- Compara 5G, 5G Advanced y 6G con sus configuraciones óptimas
- Mantiene mismos Eb/N0 y canal para comparación justa
- Muestra tabla con métricas de cada tecnología

**Comparar Canales y FEC**:
- Matriz completa de todas las combinaciones
- Gráficas de barras comparativas
- Identifica mejor FEC para cada canal

#### 7. Exportar Datos

Click en **"Exportar Resultados (JSON)"** para:
- Guardar historial completo de simulaciones
- Incluye todos los parámetros y métricas
- Formato JSON para análisis posterior en Python, MATLAB, Excel
- Timestamp para identificación

**Campos exportados**:
```json
{
  "timestamp": "2024-01-XX...",
  "technology": "5g",
  "ebn0_db": 10,
  "modulation": "qpsk",
  "channel": "awgn",
  "fec": "ldpc",
  "simulatedBer": 0.0001,
  "theoreticalBer": 0.00012,
  "codingGain": 5.2,
  "papr": 6.8,
  "evm": 8.5,
  "throughput": 95.5,
  "spectralEfficiency": 0.048
}
```

### Tips de Uso

**Para Demostraciones**:
1. Comience con escenario URLLC para mostrar confiabilidad
2. Cambie a eMBB para mostrar alta capacidad
3. Use "Comparar Tecnologías" para mostrar evolución

**Para Investigación**:
1. Use "Personalizado" con configuración específica
2. Varíe sistemáticamente un parámetro a la vez
3. Exporte resultados para análisis estadístico

**Para Aprendizaje**:
1. Comience con BPSK + AWGN + Sin FEC (más simple)
2. Agregue FEC y observe ganancia de codificación
3. Cambie a canal Rayleigh y vea degradación
4. Aumente orden de modulación y observe trade-off

## Casos de Uso Detallados para Exposición y Análisis

### Caso 1: Evolución Tecnológica - Comparación 5G/5G-A/6G
**Objetivo**: Demostrar la evolución de las tecnologías móviles y sus mejoras

**Escenario**: Streaming de video 4K en tiempo real

**Pasos**:
1. Configurar condiciones base:
   - Eb/N0: 10 dB (condiciones urbanas típicas)
   - Canal: AWGN (línea de visión)
   - Velocidad: 100 Mbps
2. Hacer clic en **"Comparar Tecnologías"**
3. Observar la tabla comparativa automática

**Resultados Esperados**:
- **5G (LDPC + QPSK)**:
  - BER: ~10⁻⁵
  - Throughput: ~95 Mbps
  - Eficiencia Espectral: 0.095 bits/s/Hz
  - PAPR: ~7.5 dB
  
- **5G Advanced (LDPC + 64-QAM + F-OFDM)**:
  - BER: ~10⁻⁴ (mayor pero aceptable)
  - Throughput: ~280 Mbps (3x más)
  - Eficiencia Espectral: 0.28 bits/s/Hz
  - PAPR: ~8.2 dB
  
- **6G (Polar + 256-QAM + NOMA)**:
  - BER: ~10⁻³ (requiere mayor Eb/N0 para mejor BER)
  - Throughput: ~750 Mbps (7.5x más que 5G)
  - Eficiencia Espectral: 0.75 bits/s/Hz
  - PAPR: ~9.1 dB

**Análisis**:
- Cada generación incrementa throughput ~3x
- Trade-off: Mayor capacidad requiere mejor SNR o tolera mayor BER
- 6G ofrece máxima eficiencia espectral para aplicaciones de ultra-ancho de banda
- PAPR aumenta con orden de modulación → Requiere amplificadores más eficientes

**Aplicaciones Prácticas**:
- 5G: Streaming HD, videollamadas, juegos en la nube
- 5G-A: Streaming 4K, múltiples dispositivos simultáneos, AR/VR
- 6G: Streaming 8K, hologramas, gemelos digitales, metaverso

### Caso 2: Impacto del Tipo de Canal en el Desempeño
**Objetivo**: Mostrar cómo diferentes condiciones de propagación afectan dramáticamente el BER

**Escenario**: Dispositivo móvil moviéndose entre diferentes entornos

**Pasos**:
1. Configurar base común:
   - Tecnología: 5G Advanced
   - Eb/N0: 8 dB (condición moderada)
   - Modulación: 16-QAM
   - FEC: LDPC
   - Velocidad: 500 Mbps
2. Simular con Canal **AWGN** → Anotar todos los resultados
3. Simular con Canal **Rician** (K=10 dB) → Anotar cambios
4. Simular con Canal **Rayleigh** → Anotar degradación
5. Hacer clic en **"Comparar Canales y FEC"** para visualización completa

**Resultados Esperados**:
- **AWGN** (Línea de visión perfecta, sin obstáculos):
  - BER: ~10⁻⁵
  - EVM: ~5%
  - Throughput: 490 Mbps
  - **Interpretación**: Condiciones ideales, máximo rendimiento
  
- **Rician K=10 dB** (Área suburbana, edificios bajos):
  - BER: ~10⁻⁴ (10x peor)
  - EVM: ~12%
  - Throughput: 480 Mbps
  - **Interpretación**: Degradación moderada, aún aceptable
  
- **Rayleigh** (Urbano denso, sin línea de visión):
  - BER: ~10⁻² (1000x peor que AWGN!)
  - EVM: ~25%
  - Throughput: 450 Mbps
  - **Interpretación**: Degradación severa, requiere adaptación

**Análisis Profundo**:
- El canal es el factor más crítico después de SNR
- Rayleigh puede degradar BER hasta 1000x vs AWGN
- EVM refleja la degradación de la constelación
- Throughput efectivo cae debido a retransmisiones

**Observaciones en Gráfica de Constelación**:
- AWGN: Puntos bien agrupados, círculos definidos
- Rician: Dispersión moderada, aún distinguibles
- Rayleigh: Dispersión severa, símbolos se solapan

**Soluciones Prácticas**:
1. **Aumentar Eb/N0**: Compensar con más potencia
2. **FEC más robusto**: Cambiar a Polar o Turbo
3. **Modulación adaptativa**: Bajar a QPSK en canales hostiles
4. **Diversidad**: MIMO, beamforming (futuro)

### Caso 3: Efectividad de Técnicas de Control de Errores (FEC)
**Objetivo**: Demostrar la ganancia de codificación con diferentes técnicas FEC

**Pasos**:
1. Configurar:
   - Tecnología: 5G
   - Eb/N0: 8 dB (SNR bajo para ver el efecto FEC)
   - Modulación: QPSK
   - Canal: Rayleigh (canal hostil)
2. Probar con FEC: Ninguna → Anotar BER (~0.1 o más)
3. Cambiar FEC a Hamming (7,4) → Anotar mejora
4. Cambiar FEC a LDPC → Anotar mejora significativa
5. Cambiar FEC a Polar Codes → Anotar mejor desempeño
6. Hacer clic en "Comparar Canales y FEC" para visualizar
7. Observar la tabla "Efectividad de Técnicas FEC" con porcentaje de mejora

**Resultados Esperados**:
- Sin FEC: BER ~0.1 (10% de errores)
- Hamming: BER ~0.05 (50% de mejora)
- LDPC: BER ~0.01 (90% de mejora)
- Polar: BER ~0.005 (95% de mejora)

### Caso 4: Análisis de Constelación bajo Ruido
**Objetivo**: Visualizar el impacto del ruido en símbolos modulados

**Pasos**:
1. Configurar:
   - Modulación: 16-QAM
   - Eb/N0: 20 dB (alto SNR)
   - Canal: AWGN
2. Hacer clic en "Simular"
3. Ir a pestaña "Gráficas"
4. Observar el Diagrama de Constelación (símbolos bien definidos)
5. Reducir Eb/N0 a 5 dB (bajo SNR)
6. Hacer clic en "Simular"
7. Observar mayor dispersión en la constelación

**Observaciones**:
- Alto SNR: Símbolos claros y separados
- Bajo SNR: Símbolos dispersos, mayor probabilidad de error

### Caso 5: Evolución Tecnológica - Comparación 5G/5G-Advanced/6G
**Objetivo**: Mostrar la evolución de las tecnologías móviles

**Pasos**:
1. Configurar:
   - Eb/N0: 12 dB
   - Canal: AWGN
2. Hacer clic en "Comparar Tecnologías"
3. Observar la tabla comparativa con:
   - 5G: LDPC + QPSK
   - 5G Advanced: LDPC + 64-QAM
   - 6G: Polar Codes + 256-QAM
4. Analizar métricas:
   - BER Simulado vs Teórico
   - Ganancia FEC
   - Eficiencia (%)

**Análisis**:
- 5G: Base sólida con buena relación eficiencia/complejidad
- 5G Advanced: Mayor throughput manteniendo robustez
- 6G: Máxima eficiencia espectral para aplicaciones futuras

### Caso 6: Optimización de Parámetros para Streaming de Video 4K
**Objetivo**: Encontrar configuración óptima para alta velocidad de datos

**Pasos**:
1. Configurar:
   - Velocidad de Datos: 1000 Mbps (1 Gbps para 4K)
   - Canal: Rician (entorno urbano con LOS)
   - Factor K: 10 dB
2. Probar diferentes combinaciones:
   - Tecnología: 5G Advanced, Modulación: 64-QAM, FEC: LDPC
   - Incrementar Eb/N0 hasta conseguir BER < 1e-6
3. Anotar Eb/N0 mínimo necesario
4. Repetir con 6G y 256-QAM
5. Comparar requisitos de potencia

**Criterio de Éxito**:
- BER < 1e-6 (para garantizar calidad de video)
- Menor Eb/N0 posible (menor consumo de potencia)

### Caso 7: Simulación de Entorno Urbano Denso (NLOS)
**Objetivo**: Evaluar desempeño en condiciones adversas típicas de ciudad

**Pasos**:
1. Configurar:
   - Canal: Rayleigh (NLOS, sin línea de visión)
   - Eb/N0: Comenzar en 15 dB
   - Modulación: Adaptar según calidad del canal
   - FEC: Activar para compensar
2. Probar 5G con QPSK + LDPC
3. Incrementar Eb/N0 si BER > 1e-3
4. Intentar con modulaciones más altas
5. Documentar la modulación máxima viable

**Conclusiones**:
- Canales hostiles requieren mayor Eb/N0
- FEC es crucial en entornos NLOS
- Modulación adaptativa es necesaria

## Tips para Presentación Efectiva

1. **Comience con lo simple**: Empiece con BPSK en AWGN para explicar conceptos básicos
2. **Contraste escenarios**: Muestre AWGN vs Rayleigh para ilustrar impacto del canal
3. **Demuestre FEC**: Compare con/sin FEC para mostrar beneficios
4. **Use gráficas**: Las visualizaciones son más impactantes que tablas
5. **Relate con casos reales**: Conecte con aplicaciones (streaming, IoT, vehículos autónomos)
6. **Muestre tradeoffs**: Discuta balance entre throughput, BER y complejidad

## Estructura del Proyecto

```
.
├── index.html          # Interfaz de usuario principal
├── script.js           # Lógica de simulación y procesamiento
├── style.css           # Estilos y diseño
└── README.md          # Este archivo
```

## Implementación Técnica

### Cadena de Simulación

1. **Generación de Bits**: Genera una secuencia aleatoria de bits
2. **Codificación FEC**: Aplica codificación de canal (opcional)
3. **Modulación**: Convierte bits en símbolos complejos
4. **Canal**: Aplica desvanecimiento y añade ruido AWGN
5. **Demodulación**: Convierte símbolos recibidos en bits
6. **Decodificación FEC**: Corrige errores (opcional)
7. **Comparación**: Compara bits transmitidos vs recibidos

### Algoritmos Implementados

#### Generación de Ruido Gaussiano
Usa el método Box-Muller para generar ruido gaussiano:
```javascript
z0 = sqrt(-2 * ln(u1)) * cos(2π * u2)
z1 = sqrt(-2 * ln(u1)) * sin(2π * u2)
```

#### Desvanecimiento Rayleigh
```javascript
h = (x + jy) / sqrt(2)
donde x, y ~ N(0,1)
```

#### Desvanecimiento Rician
```javascript
h = sqrt(K/(K+1)) + sqrt(1/(2(K+1))) * (x + jy)
donde x, y ~ N(0,1), K es el factor Rician
```

#### BER Teórico (AWGN)
- **BPSK/QPSK**: BER = 0.5 * erfc(sqrt(Eb/N0))
- **M-QAM**: Fórmulas más complejas basadas en la constelación

## Referencias

### Artículos Científicos
1. **"Employing efficient decoding algorithms to reduce bit error rates in 5G applications and beyond"** - IEEE 2024
   - Presenta algoritmos de decodificación optimizados para 5G
   - Analiza el impacto en el BER de diferentes técnicas

2. **"A performance analysis on channel encoding techniques to be used in digital communication system"** - IEEE 2022
   - Compara diferentes técnicas de codificación de canal
   - Evalúa el desempeño en términos de BER y complejidad

### Estándares
- **3GPP TS 38.211**: Especificación de la capa física de 5G NR
- **3GPP TS 38.212**: Codificación de canal y control de tasas para 5G NR

### Recursos Adicionales
- Digital Communications (Proakis & Salehi)
- Wireless Communications (Andrea Goldsmith)
- 5G NR: The Next Generation Wireless Access Technology (Erik Dahlman et al.)

## Tecnologías Utilizadas

- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos y diseño responsivo
- **JavaScript (ES6+)**: Lógica de simulación
- **Chart.js**: Visualización de gráficas interactivas

## Mejoras Futuras

- [ ] Implementación de MIMO (Multiple Input Multiple Output)
- [ ] Simulación de handover entre celdas
- [ ] Análisis de espectro de frecuencia
- [ ] Simulación de múltiples usuarios
- [ ] Comparación con datos reales de campo
- [ ] Optimización del algoritmo de simulación para mayor velocidad
- [ ] API REST para acceso programático

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

Desarrollado para análisis de sistemas de comunicación móvil avanzados.

## Contacto

Para preguntas, sugerencias o reportar problemas, por favor abra un issue en el repositorio de GitHub.
