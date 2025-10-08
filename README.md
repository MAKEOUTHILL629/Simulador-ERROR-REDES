# Simulador de Tasa de Error de Bit (BER) - 5G/6G

## Descripción del Proyecto

Este simulador permite analizar y comparar el desempeño de sistemas de comunicación móvil 5G, 5G Avanzado y 6G en términos de la Tasa de Error de Bit (BER - Bit Error Rate). El simulador implementa una cadena completa de comunicación digital que incluye modulación, codificación de canal, transmisión a través de diferentes tipos de canales, y técnicas de control de errores.

## Características Principales

### 1. Simulación por Tecnología
- **5G**: Configuración estándar con LDPC codes
- **5G Avanzado**: Mejoras en modulación y codificación
- **6G**: Tecnología de próxima generación con Polar Codes avanzados

### 2. Parámetros Configurables

#### Parámetros de Señal
- **Eb/N0 (dB)**: Relación entre energía de bit y densidad espectral de ruido (0-30 dB)
- **Potencia de Señal**: Calculada automáticamente basada en la modulación
- **Potencia de Ruido**: Determinada por Eb/N0 y la velocidad de datos

#### Modulación
- **BPSK** (Binary Phase Shift Keying): 1 bit/símbolo
- **QPSK** (Quadrature Phase Shift Keying): 2 bits/símbolo
- **16-QAM**: 4 bits/símbolo
- **64-QAM**: 6 bits/símbolo
- **256-QAM**: 8 bits/símbolo (6G)

#### Tipo de Canal
- **AWGN** (Additive White Gaussian Noise): Canal ideal con solo ruido blanco
- **Rayleigh**: Desvanecimiento sin línea de visión directa (NLOS)
- **Rician**: Desvanecimiento con línea de visión directa (LOS), factor K configurable

#### Técnicas de Control de Errores (FEC)
- **Ninguna**: Sin codificación
- **Hamming (7,4)**: Código de bloque simple
- **LDPC** (Low-Density Parity-Check): Usado en 5G/5G Advanced
- **Polar Codes**: Código de canal usado en 5G NR y 6G
- **Turbo Codes**: Código convolucional avanzado

#### Multiplexación
- **OFDM** (Orthogonal Frequency Division Multiplexing)
- **OFDMA** (OFDM Access)
- **SC-FDMA** (Single Carrier FDMA)
- **NOMA** (Non-Orthogonal Multiple Access)

#### Velocidad de Datos
- Rango configurable: 1 Mbps - 10 Gbps
- Afecta directamente el SNR y BER

### 3. Visualización de Resultados

#### Gráficas en Tiempo Real
- **Gráfica BER vs Eb/N0**: Comparación entre BER teórico y simulado
- **Constelación**: Visualización de símbolos modulados antes y después del canal
- **Comparación de Tecnologías**: Desempeño de 5G, 5G Advanced y 6G
- **Efectividad de FEC**: Comparación del BER con y sin codificación

#### Tablas Comparativas
- **Tabla de Resultados**: Muestra todos los parámetros y resultados de la simulación
- **Comparación de Tecnologías**: Tabla con métricas de cada tecnología
- **Eficiencia de FEC**: Comparación de diferentes técnicas de control de errores

### 4. Análisis de Señales
- Visualización de bits de entrada vs salida
- Conteo de errores de bit
- Tasa de error de bit (simulada y teórica)
- Ganancia de codificación (Coding Gain)

## Fundamentos Teóricos

### Bit Error Rate (BER)
El BER es la relación entre el número de bits erróneos recibidos y el total de bits transmitidos:

```
BER = Número de bits con error / Total de bits transmitidos
```

### Eb/N0 (Energy per Bit to Noise Power Spectral Density)
Representa la relación entre la energía por bit y la densidad espectral de potencia del ruido:

```
Eb/N0 (dB) = 10 * log10(Eb/N0)
```

### Modulación
La modulación convierte bits digitales en símbolos que pueden ser transmitidos:
- **BPSK**: Usa 2 puntos en el espacio de señal
- **QPSK**: Usa 4 puntos (2 bits por símbolo)
- **M-QAM**: Usa M puntos en una cuadrícula (log2(M) bits por símbolo)

### Forward Error Correction (FEC)
Las técnicas FEC añaden redundancia para detectar y corregir errores:
- **Hamming Codes**: Códigos de bloque lineales simples
- **LDPC**: Códigos de verificación de paridad de baja densidad (5G)
- **Polar Codes**: Códigos que alcanzan la capacidad de Shannon (5G NR, 6G)
- **Turbo Codes**: Códigos convolucionales concatenados (4G/5G)

### Tipos de Canal
- **AWGN**: Modelo más simple, solo añade ruido blanco gaussiano
- **Rayleigh**: Modela desvanecimiento en entornos urbanos sin LOS
- **Rician**: Modela desvanecimiento con componente LOS (factor K)

## Cómo Usar el Simulador

### 1. Selección de Tecnología
Seleccione la tecnología que desea simular:
- **5G**: Para estándares actuales
- **5G Advanced**: Para evolución de 5G
- **6G**: Para tecnología futura

### 2. Configuración de Parámetros
Ajuste los parámetros según el escenario que desea simular:
- Comience con Eb/N0 = 10 dB para condiciones normales
- Seleccione la modulación según la capacidad deseada
- Elija el tipo de canal según el entorno de propagación
- Active FEC para mejorar el desempeño

### 3. Ejecutar Simulación
Haga clic en "Simular" para ejecutar la simulación y ver los resultados.

### 4. Analizar Resultados
- Observe las gráficas en tiempo real
- Revise las tablas comparativas
- Compare diferentes configuraciones

### 5. Exportar Datos
Use el botón "Exportar Resultados" para guardar los datos en formato JSON.

## Casos de Uso para Exposición

### Caso 1: Comparación de Desempeño entre 5G y 6G en Canal AWGN
**Objetivo**: Demostrar la mejora en eficiencia espectral de 6G vs 5G en condiciones ideales

**Pasos**:
1. Configurar:
   - Tecnología: 5G
   - Eb/N0: 15 dB
   - Modulación: QPSK
   - Canal: AWGN
   - FEC: LDPC
2. Hacer clic en "Simular"
3. Observar el BER Simulado (esperado: ~1e-5)
4. Cambiar Tecnología a 6G y Modulación a 256-QAM
5. Hacer clic en "Simular" nuevamente
6. Comparar los resultados: 6G ofrece mayor throughput con modulación más alta

**Resultados Esperados**:
- 5G con QPSK: BER ~1e-5, 2 bits/símbolo
- 6G con 256-QAM: BER ~1e-4, 8 bits/símbolo (4x más capacidad)

### Caso 2: Impacto del Tipo de Canal en el Desempeño
**Objetivo**: Mostrar cómo diferentes condiciones de propagación afectan el BER

**Pasos**:
1. Configurar:
   - Tecnología: 5G Advanced
   - Eb/N0: 10 dB
   - Modulación: 64-QAM
   - FEC: LDPC
2. Probar con Canal AWGN → Anotar BER
3. Cambiar a Canal Rayleigh → Anotar BER (mayor degradación)
4. Cambiar a Canal Rician con K=10 dB → Anotar BER (intermedio)
5. Hacer clic en "Comparar Canales y FEC" para ver gráfica comparativa

**Resultados Esperados**:
- AWGN: Mejor desempeño (BER más bajo)
- Rician: Desempeño medio (depende del factor K)
- Rayleigh: Peor desempeño (mayor BER debido a desvanecimiento)

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
