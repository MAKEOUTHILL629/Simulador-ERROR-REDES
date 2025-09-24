/**
 * Calcula la función de error complementaria (erfc).
 * Utiliza la aproximación del polinomio de Abramowitz y Stegun.
 * @param {number} x - El valor de entrada.
 * @returns {number} - El valor de erfc(x).
 */
function erfc(x) {
    // Constantes para la aproximación
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = (x >= 0) ? 1 : -1;
    const absX = Math.abs(x);

    // Aproximación
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    // erfc(x) = 1 - erf(x)
    return 1 - (sign * y);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const simulateBtn = document.getElementById('simulateBtn');
    const ebn0Input = document.getElementById('ebn0');
    const modulationSelect = document.getElementById('modulation');
    const channelSelect = document.getElementById('channel');
    const fecSelect = document.getElementById('fec');
    const ricianKGroup = document.getElementById('rician-k-group');
    const ricianKInput = document.getElementById('rician-k');
    const ricianKValueSpan = document.getElementById('rician-k-value');
    const berResultSpan = document.getElementById('ber-result');
    const inputSignalPre = document.getElementById('input-signal');
    const outputSignalPre = document.getElementById('output-signal');

    // --- Event Listeners ---
    simulateBtn.addEventListener('click', runSimulation);
    channelSelect.addEventListener('change', () => {
        ricianKGroup.style.display = (channelSelect.value === 'rician') ? 'block' : 'none';
    });
    ricianKInput.addEventListener('input', () => {
        ricianKValueSpan.textContent = `${ricianKInput.value} dB`;
    });

    // --- Constelaciones de Modulación (Normalizadas para Energía de Símbolo Promedio Es=1) ---
    const constellations = {
        'bpsk': { 1: { i: 1, q: 0 }, 0: { i: -1, q: 0 } },
        'qpsk': {
            '11': { i: 1 / Math.sqrt(2), q: 1 / Math.sqrt(2) }, '01': { i: -1 / Math.sqrt(2), q: 1 / Math.sqrt(2) },
            '00': { i: -1 / Math.sqrt(2), q: -1 / Math.sqrt(2) }, '10': { i: 1 / Math.sqrt(2), q: -1 / Math.sqrt(2) }
        },
        '16qam': { /* Generado dinámicamente */ },
        '64qam': { /* Generado dinámicamente */ }
    };

    function generateQAMConstellation(M, k) {
        const points = [];
        const side = Math.sqrt(M);
        for (let i = 0; i < side; i++) {
            for (let j = 0; j < side; j++) {
                points.push({ i: 2 * j - (side - 1), q: 2 * i - (side - 1) });
            }
        }

        // Mapeo Gray (simplificado, para propósitos de simulación, no es un mapeo Gray perfecto)
        // Un mapeo Gray real es más complejo de generar programáticamente.
        let constellation = {};
        for (let i = 0; i < M; i++) {
            const bitString = i.toString(2).padStart(k, '0');
            constellation[bitString] = points[i];
        }

        // Normalizar para energía de símbolo promedio Es=1
        const avgEnergy = points.reduce((sum, p) => sum + p.i * p.i + p.q * p.q, 0) / M;
        const normFactor = Math.sqrt(avgEnergy);
        for (const key in constellation) {
            constellation[key].i /= normFactor;
            constellation[key].q /= normFactor;
        }
        return constellation;
    }

    constellations['16qam'] = generateQAMConstellation(16, 4);
    constellations['64qam'] = generateQAMConstellation(64, 6);

    // --- Lógica de Simulación Realista ---
    function runSimulation() {
        const ebn0_db = parseFloat(ebn0Input.value);
        const modulation = modulationSelect.value;
        const channel = channelSelect.value;
        const fec = fecSelect.value;
        const k_factor_db = parseFloat(ricianKInput.value);

        const numBits = 2000;
        const originalBits = generateRandomBits(numBits);

        // --- Cadena de Simulación ---
        // 1. Codificación FEC (opcional)
        const encodedBits = (fec !== 'none') ? hammingEncode(originalBits) : originalBits;

        // 2. Modulación: Bits a Símbolos Complejos
        const { symbols, k } = modulate(encodedBits, modulation);

        // 3. Canal: Aplicar desvanecimiento y añadir ruido
        const noisySymbols = addNoise(symbols, ebn0_db, k, channel, k_factor_db);

        // 4. Demodulación: Símbolos ruidosos a Bits
        const demodulatedBits = demodulate(noisySymbols, modulation);

        // 5. Decodificación FEC (opcional)
        const decodedBits = (fec !== 'none') ? hammingDecode(demodulatedBits) : demodulatedBits;

        // 6. Comparación y Resultados
        const errors = compareBits(originalBits, decodedBits);
        const simulatedBer = errors / numBits;
        // El BER teórico no tiene en cuenta el FEC, por lo que la comparación será reveladora.
        const theoreticalBer = calculateTheoreticalBer(ebn0_db, modulation, channel);

        displayResults(originalBits, decodedBits, theoreticalBer, simulatedBer);
    }

    function generateRandomBits(length) {
        let bits = '';
        for (let i = 0; i < length; i++) bits += Math.round(Math.random());
        return bits;
    }

    function getBitsPerSymbol(modulation) {
        if (modulation === 'bpsk') return 1;
        if (modulation === 'qpsk') return 2;
        if (modulation === '16qam') return 4;
        if (modulation === '64qam') return 6;
        return 0;
    }

    function modulate(bits, modulation) {
        const k = getBitsPerSymbol(modulation);
        if (k === 0) return { symbols: [], k: 0 };

        const constellation = constellations[modulation];
        let symbols = [];
        for (let i = 0; i < bits.length; i += k) {
            const chunk = bits.substring(i, i + k);
            if (constellation[chunk]) {
                symbols.push(constellation[chunk]);
            }
        }
        return { symbols, k };
    }

    function generateGaussianNoise() {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random(); // Prevenir log(0)
        while (u2 === 0) u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return { z0, z1 };
    }

    function addNoise(symbols, ebn0_db, k, channel, k_factor_db) {
        const ebn0_linear = Math.pow(10, ebn0_db / 10);
        const esn0_linear = ebn0_linear * k;
        const n0 = 1 / esn0_linear; // Asumiendo Es = 1
        const sigma = Math.sqrt(n0 / 2);

        let fadedSymbols = symbols;

        if (channel === 'rayleigh') {
            fadedSymbols = symbols.map(s => {
                const { z0: x, z1: y } = generateGaussianNoise();
                const h_i = x / Math.sqrt(2);
                const h_q = y / Math.sqrt(2);
                return { i: s.i * h_i - s.q * h_q, q: s.i * h_q + s.q * h_i };
            });
        } else if (channel === 'rician') {
            const K = Math.pow(10, k_factor_db / 10);
            // Componente de línea de visión (LOS)
            const mu_i = Math.sqrt(K / (K + 1));
            const mu_q = 0; // Se asume en el eje real sin pérdida de generalidad
            // Varianza del componente disperso (NLOS)
            const sigma_h = Math.sqrt(1 / (2 * (K + 1)));

            fadedSymbols = symbols.map(s => {
                const { z0: x, z1: y } = generateGaussianNoise();
                const h_i = mu_i + x * sigma_h;
                const h_q = mu_q + y * sigma_h;
                return { i: s.i * h_i - s.q * h_q, q: s.i * h_q + s.q * h_i };
            });
        }

        return fadedSymbols.map(s => {
            const { z0, z1 } = generateGaussianNoise();
            return { i: s.i + z0 * sigma, q: s.q + z1 * sigma };
        });
    }

    function demodulate(noisySymbols, modulation) {
        const constellation = constellations[modulation];
        const constellationPoints = Object.entries(constellation);
        let bits = '';

        for (const noisySymbol of noisySymbols) {
            let minDistance = Infinity;
            let bestBits = '';

            for (const [bitString, point] of constellationPoints) {
                const dist = Math.pow(noisySymbol.i - point.i, 2) + Math.pow(noisySymbol.q - point.q, 2);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestBits = bitString;
                }
            }
            bits += bestBits;
        }
        return bits;
    }

    function compareBits(input, output) {
        let errors = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== output[i]) {
                errors++;
            }
        }
        return errors;
    }

    // --- Lógica de Codificación de Canal (FEC) ---
    // Implementación del código de Hamming (7,4) como un ejemplo de FEC real.
    // Matriz generadora G = [I_k | P] donde P es la matriz de paridad.
    // Para Hamming(7,4), P = [[1,1,0],[0,1,1],[1,1,1],[1,0,1]] (transpuesta)
    const hamming_P = [
        [1, 0, 1, 1], // p1 = d1+d3+d4
        [1, 1, 0, 1], // p2 = d1+d2+d4
        [0, 1, 1, 1]  // p3 = d2+d3+d4
    ];

    function hammingEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i += 4) {
            let data = bits.substring(i, i + 4);
            if (data.length < 4) data = data.padEnd(4, '0'); // Rellenar si es necesario

            const d = data.split('').map(Number);
            const p = [
                (d[0] + d[1] + d[3]) % 2,
                (d[0] + d[2] + d[3]) % 2,
                (d[1] + d[2] + d[3]) % 2,
            ];
            const codeword = [p[0],p[1],d[0],p[2],d[1],d[2],d[3]].join('');
            encoded += codeword;
        }
        return encoded;
    }

    function hammingDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 7) {
            let block = bits.substring(i, i + 7);
            if (block.length < 7) continue; // Ignorar bloques incompletos

            const r = block.split('').map(Number);
            const syndrome = [
                (r[0] + r[2] + r[4] + r[6]) % 2,
                (r[1] + r[2] + r[5] + r[6]) % 2,
                (r[3] + r[4] + r[5] + r[6]) % 2
            ];

            const errorPos = parseInt(syndrome.reverse().join(''), 2);
            if (errorPos > 0) {
                r[errorPos - 1] = 1 - r[errorPos - 1]; // Corregir el bit
            }

            // Extraer los bits de datos
            decoded += `${r[2]}${r[4]}${r[5]}${r[6]}`;
        }
        return decoded;
    }

    /**
     * Calcula el BER teórico para diferentes modulaciones en un canal AWGN.
     * @param {number} ebn0_db - Relación Eb/N0 en decibelios.
     * @param {string} modulation - Tipo de modulación (e.g., 'bpsk', 'qpsk').
     * @param {string} channel - Tipo de canal (actualmente solo 'awgn').
     * @returns {number} - La tasa de error de bit (BER) teórica.
     */
    function calculateTheoreticalBer(ebn0_db, modulation, channel) {
        const ebn0_linear = Math.pow(10, ebn0_db / 10);
        let ber = 0;

        if (channel === 'awgn') {
            switch (modulation) {
                case 'bpsk':
                case 'qpsk':
                    ber = 0.5 * erfc(Math.sqrt(ebn0_linear));
                    break;
                case '16qam':
                    const k_16qam = 4;
                    ber = (3 / (2 * k_16qam)) * erfc(Math.sqrt((k_16qam / 5) * ebn0_linear));
                    break;
                case '64qam':
                    console.warn("BER teórico para 64-QAM en AWGN es una aproximación.");
                    const k_64qam = 6;
                    ber = (7 / (4 * k_64qam)) * erfc(Math.sqrt((k_64qam / 21) * ebn0_linear));
                    break;
                default: ber = 0;
            }
        } else if (channel === 'rayleigh') {
            switch (modulation) {
                case 'bpsk':
                    // BER = 0.5 * (1 - sqrt(EbN0 / (1 + EbN0)))
                    ber = 0.5 * (1 - Math.sqrt(ebn0_linear / (1 + ebn0_linear)));
                    break;
                // Las fórmulas para QAM en Rayleigh son más complejas y se pueden añadir después.
                default:
                    console.warn(`BER teórico para ${modulation} en canal ${channel} no implementado.`);
                    ber = NaN; // No hay fórmula simple
            }
        } else {
            console.warn(`El canal ${channel} aún no está implementado.`);
            ber = NaN;
        }

        return ber;
    }

    /**
     * Muestra los resultados en la interfaz de usuario.
     * @param {string} input - Señal de entrada.
     * @param {string} output - Señal de salida.
     * @param {number} theoreticalBer - Tasa de error de bit teórica.
     * @param {number} simulatedBer - Tasa de error de bit de la simulación.
     */
    function displayResults(input, output, theoreticalBer, simulatedBer) {
        inputSignalPre.textContent = formatSignal(input);
        outputSignalPre.textContent = formatSignal(output);

        // Muestra el BER teórico y el simulado para comparación
        const berText = `Teórico: ${theoreticalBer.toExponential(4)}, Simulado: ${simulatedBer.toExponential(4)}`;
        berResultSpan.textContent = berText;
        berResultSpan.style.color = theoreticalBer > 1e-4 ? '#d9534f' : '#5cb85c';
    }

    /**
     * Formatea la cadena de bits para una mejor visualización.
     * @param {string} signal - La cadena de bits.
     * @returns {string} - La cadena de bits formateada.
     */
    function formatSignal(signal) {
        // Agrega espacios cada 8 bits para facilitar la lectura
        return signal.replace(/(.{8})/g, '$1 ').trim();
    }
});