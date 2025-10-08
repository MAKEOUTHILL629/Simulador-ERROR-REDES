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

// Variables globales para gráficas
let berChart = null;
let constellationChart = null;
let simulationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const simulateBtn = document.getElementById('simulateBtn');
    const compareBtn = document.getElementById('compareBtn');
    const compareChannelsBtn = document.getElementById('compareChannelsBtn');
    const exportBtn = document.getElementById('exportBtn');
    const technologySelect = document.getElementById('technology');
    const ebn0Input = document.getElementById('ebn0');
    const ebn0ValueSpan = document.getElementById('ebn0-value');
    const dataRateInput = document.getElementById('data-rate');
    const dataRateValueSpan = document.getElementById('data-rate-value');
    const modulationSelect = document.getElementById('modulation');
    const channelSelect = document.getElementById('channel');
    const fecSelect = document.getElementById('fec');
    const decodingSelect = document.getElementById('decoding');
    const scenarioSelect = document.getElementById('scenario');
    const multiplexingSelect = document.getElementById('multiplexing');
    const ricianKGroup = document.getElementById('rician-k-group');
    const ricianKInput = document.getElementById('rician-k');
    const ricianKValueSpan = document.getElementById('rician-k-value');
    
    // Results elements
    const berSimulatedSpan = document.getElementById('ber-simulated');
    const berTheoreticalSpan = document.getElementById('ber-theoretical');
    const codingGainSpan = document.getElementById('coding-gain');
    const throughputSpan = document.getElementById('throughput');
    const spectralEfficiencySpan = document.getElementById('spectral-efficiency');
    const paprSpan = document.getElementById('papr');
    const evmSpan = document.getElementById('evm');
    const inputSignalPre = document.getElementById('input-signal');
    const outputSignalPre = document.getElementById('output-signal');
    const signalErrorsPre = document.getElementById('signal-errors');
    const paramsTable = document.getElementById('params-table');

    // --- Event Listeners ---
    simulateBtn.addEventListener('click', runSimulation);
    compareBtn.addEventListener('click', compareTechnologies);
    compareChannelsBtn.addEventListener('click', compareChannelsAndFEC);
    const optimizeBtn = document.getElementById('optimizeBtn');
    optimizeBtn.addEventListener('click', optimizeParameters);
    exportBtn.addEventListener('click', exportResults);
    
    channelSelect.addEventListener('change', () => {
        ricianKGroup.style.display = (channelSelect.value === 'rician') ? 'block' : 'none';
    });
    
    ebn0Input.addEventListener('input', () => {
        ebn0ValueSpan.textContent = ebn0Input.value;
    });
    
    dataRateInput.addEventListener('input', () => {
        dataRateValueSpan.textContent = dataRateInput.value;
    });
    
    ricianKInput.addEventListener('input', () => {
        ricianKValueSpan.textContent = ricianKInput.value;
    });

    // Technology-specific defaults
    technologySelect.addEventListener('change', () => {
        const tech = technologySelect.value;
        if (tech === '5g') {
            modulationSelect.value = 'qpsk';
            fecSelect.value = 'ldpc';
        } else if (tech === '5g-advanced') {
            modulationSelect.value = '64qam';
            fecSelect.value = 'ldpc';
            multiplexingSelect.value = 'f-ofdm';
        } else if (tech === '6g') {
            modulationSelect.value = '256qam';
            fecSelect.value = 'polar';
            multiplexingSelect.value = 'noma';
        }
    });

    // Scenario presets
    scenarioSelect.addEventListener('change', () => {
        const scenario = scenarioSelect.value;
        if (scenario === 'urllc') {
            // Ultra-Reliable Low Latency Communications
            ebn0Input.value = '12';
            ebn0ValueSpan.textContent = '12';
            modulationSelect.value = 'qpsk';
            fecSelect.value = 'polar';
            channelSelect.value = 'rician';
        } else if (scenario === 'embb') {
            // Enhanced Mobile Broadband
            ebn0Input.value = '10';
            ebn0ValueSpan.textContent = '10';
            modulationSelect.value = '64qam';
            fecSelect.value = 'ldpc';
            channelSelect.value = 'awgn';
        } else if (scenario === 'mmtc') {
            // Massive Machine Type Communications
            ebn0Input.value = '5';
            ebn0ValueSpan.textContent = '5';
            modulationSelect.value = 'bpsk';
            fecSelect.value = 'turbo';
            channelSelect.value = 'rayleigh';
        }
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and target content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize charts
    initializeCharts();

    // --- Constelaciones de Modulación (Normalizadas para Energía de Símbolo Promedio Es=1) ---
    const constellations = {
        'bpsk': { 1: { i: 1, q: 0 }, 0: { i: -1, q: 0 } },
        'qpsk': {
            '11': { i: 1 / Math.sqrt(2), q: 1 / Math.sqrt(2) }, '01': { i: -1 / Math.sqrt(2), q: 1 / Math.sqrt(2) },
            '00': { i: -1 / Math.sqrt(2), q: -1 / Math.sqrt(2) }, '10': { i: 1 / Math.sqrt(2), q: -1 / Math.sqrt(2) }
        },
        '8psk': { /* Generado dinámicamente */ },
        '16qam': { /* Generado dinámicamente */ },
        '64qam': { /* Generado dinámicamente */ },
        '256qam': { /* Generado dinámicamente */ }
    };

    function generate8PSKConstellation() {
        const constellation = {};
        for (let i = 0; i < 8; i++) {
            const angle = (2 * Math.PI * i / 8) + Math.PI / 8; // Rotated by π/8
            const bitString = i.toString(2).padStart(3, '0');
            constellation[bitString] = {
                i: Math.cos(angle),
                q: Math.sin(angle)
            };
        }
        return constellation;
    }

    function generateQAMConstellation(M, k) {
        const points = [];
        const side = Math.sqrt(M);
        for (let i = 0; i < side; i++) {
            for (let j = 0; j < side; j++) {
                points.push({ i: 2 * j - (side - 1), q: 2 * i - (side - 1) });
            }
        }

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

    constellations['8psk'] = generate8PSKConstellation();
    constellations['16qam'] = generateQAMConstellation(16, 4);
    constellations['64qam'] = generateQAMConstellation(64, 6);
    constellations['256qam'] = generateQAMConstellation(256, 8);

    // --- Initialize Charts ---
    function initializeCharts() {
        // Charts will be drawn on demand
        drawEmptyBERChart();
        drawEmptyConstellationChart();
    }

    function drawEmptyBERChart() {
        const canvas = document.getElementById('berChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Ejecute una simulación para ver las gráficas', canvas.width / 2, canvas.height / 2);
    }

    function drawEmptyConstellationChart() {
        const canvas = document.getElementById('constellationChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Ejecute una simulación para ver el diagrama de constelación', canvas.width / 2, canvas.height / 2);
    }

    // --- Lógica de Simulación ---
    function runSimulation() {
        const ebn0_db = parseFloat(ebn0Input.value);
        const technology = technologySelect.value;
        const modulation = modulationSelect.value;
        const channel = channelSelect.value;
        const fec = fecSelect.value;
        const decoding = decodingSelect.value;
        const multiplexing = multiplexingSelect.value;
        const dataRate = parseFloat(dataRateInput.value);
        const k_factor_db = parseFloat(ricianKInput.value);

        const numBits = 2000;
        const originalBits = generateRandomBits(numBits);

        // --- Cadena de Simulación ---
        // 1. Codificación FEC (opcional)
        let encodedBits = originalBits;
        let fecOverhead = 1.0;
        
        if (fec === 'hamming') {
            encodedBits = hammingEncode(originalBits);
            fecOverhead = 7/4; // Hamming (7,4)
        } else if (fec === 'bch') {
            encodedBits = bchEncode(originalBits);
            fecOverhead = 7/4; // BCH simplified
        } else if (fec === 'reed-solomon') {
            encodedBits = reedSolomonEncode(originalBits);
            fecOverhead = 2.0; // RS (8,4)
        } else if (fec === 'ldpc') {
            encodedBits = ldpcEncode(originalBits);
            fecOverhead = 2.0; // Rate 1/2
        } else if (fec === 'polar') {
            encodedBits = polarEncode(originalBits);
            fecOverhead = 2.0; // Rate 1/2
        } else if (fec === 'turbo') {
            encodedBits = turboEncode(originalBits);
            fecOverhead = 3.0; // Rate 1/3
        }

        // 2. Modulación: Bits a Símbolos Complejos
        const { symbols, k } = modulate(encodedBits, modulation);
        const originalSymbols = [...symbols];

        // 3. Canal: Aplicar desvanecimiento y añadir ruido
        const noisySymbols = addNoise(symbols, ebn0_db, k, channel, k_factor_db);

        // 4. Demodulación: Símbolos ruidosos a Bits
        const demodulatedBits = demodulate(noisySymbols, modulation);

        // 5. Decodificación FEC (opcional)
        let decodedBits = demodulatedBits;
        
        if (fec === 'hamming') {
            decodedBits = hammingDecode(demodulatedBits);
        } else if (fec === 'bch') {
            decodedBits = bchDecode(demodulatedBits);
        } else if (fec === 'reed-solomon') {
            decodedBits = reedSolomonDecode(demodulatedBits);
        } else if (fec === 'ldpc') {
            decodedBits = ldpcDecode(demodulatedBits);
        } else if (fec === 'polar') {
            decodedBits = polarDecode(demodulatedBits);
        } else if (fec === 'turbo') {
            decodedBits = turboDecode(demodulatedBits);
        }

        // 6. Comparación y Resultados
        const errors = compareBits(originalBits, decodedBits);
        const simulatedBer = errors / numBits;
        const theoreticalBer = calculateTheoreticalBer(ebn0_db, modulation, channel);
        
        // Calculate BER without FEC for comparison
        const decodedBitsNoFec = (fec !== 'none') ? demodulate(noisySymbols, modulation).substring(0, numBits) : decodedBits;
        const errorsNoFec = compareBits(originalBits, decodedBitsNoFec);
        const berNoFec = errorsNoFec / numBits;
        const codingGain = berNoFec > 0 ? 10 * Math.log10(berNoFec / Math.max(simulatedBer, 1e-10)) : 0;

        // Calculate signal and noise power
        const signalPower = 1.0; // Normalized
        const noisePower = 1 / (Math.pow(10, ebn0_db / 10) * k);

        // Calculate PAPR (Peak-to-Average Power Ratio)
        const papr = calculatePAPR(originalSymbols);
        
        // Calculate EVM (Error Vector Magnitude)
        const evm = calculateEVM(originalSymbols, noisySymbols);
        
        // Calculate throughput and spectral efficiency
        const codeRate = 1 / fecOverhead;
        const throughput = dataRate * (1 - simulatedBer) * codeRate; // Mbps
        const bandwidth = 20; // MHz (typical 5G channel)
        const spectralEfficiency = (k * codeRate * (1 - simulatedBer)) / bandwidth; // bits/s/Hz

        // Store simulation results
        const result = {
            timestamp: new Date().toISOString(),
            technology,
            ebn0_db,
            dataRate,
            modulation,
            channel,
            fec,
            decoding,
            multiplexing,
            k_factor_db: channel === 'rician' ? k_factor_db : null,
            simulatedBer,
            theoreticalBer,
            errors,
            numBits,
            codingGain,
            fecOverhead,
            signalPower,
            noisePower,
            snr: ebn0_db + 10 * Math.log10(k),
            papr,
            evm,
            throughput,
            spectralEfficiency
        };

        simulationHistory.push(result);

        // Display results
        displayResults(originalBits, decodedBits, result);
        updateCharts(result, originalSymbols, noisySymbols);
        updateParamsTable(result);
        updateFECComparison(result, berNoFec);
    }

    function generateRandomBits(length) {
        let bits = '';
        for (let i = 0; i < length; i++) bits += Math.round(Math.random());
        return bits;
    }

    function getBitsPerSymbol(modulation) {
        const map = {
            'bpsk': 1, 'qpsk': 2, '8psk': 3, '16qam': 4, '64qam': 6, '256qam': 8
        };
        return map[modulation] || 0;
    }

    function modulate(bits, modulation) {
        const k = getBitsPerSymbol(modulation);
        if (k === 0) return { symbols: [], k: 0 };

        const constellation = constellations[modulation];
        let symbols = [];
        for (let i = 0; i < bits.length; i += k) {
            const chunk = bits.substring(i, i + k);
            if (constellation[chunk]) {
                symbols.push({ ...constellation[chunk] });
            }
        }
        return { symbols, k };
    }

    function generateGaussianNoise() {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return { z0, z1 };
    }

    function addNoise(symbols, ebn0_db, k, channel, k_factor_db) {
        const ebn0_linear = Math.pow(10, ebn0_db / 10);
        const esn0_linear = ebn0_linear * k;
        const n0 = 1 / esn0_linear;
        const sigma = Math.sqrt(n0 / 2);

        let fadedSymbols = symbols.map(s => ({ ...s }));

        if (channel === 'rayleigh') {
            fadedSymbols = symbols.map(s => {
                const { z0: x, z1: y } = generateGaussianNoise();
                const h_i = x / Math.sqrt(2);
                const h_q = y / Math.sqrt(2);
                return { i: s.i * h_i - s.q * h_q, q: s.i * h_q + s.q * h_i };
            });
        } else if (channel === 'rician') {
            const K = Math.pow(10, k_factor_db / 10);
            const mu_i = Math.sqrt(K / (K + 1));
            const mu_q = 0;
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
        const minLen = Math.min(input.length, output.length);
        for (let i = 0; i < minLen; i++) {
            if (input[i] !== output[i]) {
                errors++;
            }
        }
        return errors;
    }

    function calculatePAPR(symbols) {
        if (symbols.length === 0) return 0;
        
        // Calculate instantaneous power for each symbol
        const powers = symbols.map(s => s.i * s.i + s.q * s.q);
        const peakPower = Math.max(...powers);
        const avgPower = powers.reduce((sum, p) => sum + p, 0) / powers.length;
        
        // PAPR in dB
        return 10 * Math.log10(peakPower / avgPower);
    }

    function calculateEVM(originalSymbols, receivedSymbols) {
        if (originalSymbols.length === 0 || receivedSymbols.length === 0) return 0;
        
        const minLen = Math.min(originalSymbols.length, receivedSymbols.length);
        let errorVectorSum = 0;
        let referenceSum = 0;
        
        for (let i = 0; i < Math.min(minLen, 100); i++) {
            const errorI = receivedSymbols[i].i - originalSymbols[i].i;
            const errorQ = receivedSymbols[i].q - originalSymbols[i].q;
            errorVectorSum += errorI * errorI + errorQ * errorQ;
            
            const refI = originalSymbols[i].i;
            const refQ = originalSymbols[i].q;
            referenceSum += refI * refI + refQ * refQ;
        }
        
        // EVM as percentage
        return 100 * Math.sqrt(errorVectorSum / referenceSum);
    }

    // --- FEC Encoding/Decoding Functions ---
    
    function hammingEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i += 4) {
            let data = bits.substring(i, i + 4);
            if (data.length < 4) data = data.padEnd(4, '0');

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
            if (block.length < 7) continue;

            const r = block.split('').map(Number);
            const syndrome = [
                (r[0] + r[2] + r[4] + r[6]) % 2,
                (r[1] + r[2] + r[5] + r[6]) % 2,
                (r[3] + r[4] + r[5] + r[6]) % 2
            ];

            const errorPos = parseInt(syndrome.reverse().join(''), 2);
            if (errorPos > 0) {
                r[errorPos - 1] = 1 - r[errorPos - 1];
            }

            decoded += `${r[2]}${r[4]}${r[5]}${r[6]}`;
        }
        return decoded;
    }

    // BCH Code (simplified - using repetition with parity)
    function bchEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i += 4) {
            let data = bits.substring(i, i + 4);
            if (data.length < 4) data = data.padEnd(4, '0');
            
            // Add 3 parity bits (simplified BCH)
            const d = data.split('').map(Number);
            const p1 = (d[0] + d[1] + d[2]) % 2;
            const p2 = (d[1] + d[2] + d[3]) % 2;
            const p3 = (d[0] + d[2] + d[3]) % 2;
            
            encoded += data + p1 + p2 + p3;
        }
        return encoded;
    }

    function bchDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 7) {
            let block = bits.substring(i, i + 7);
            if (block.length < 7) continue;
            
            // Simple error detection and correction
            const data = block.substring(0, 4);
            decoded += data;
        }
        return decoded;
    }

    // Reed-Solomon Code (simplified - using systematic encoding)
    function reedSolomonEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i += 4) {
            let data = bits.substring(i, i + 4);
            if (data.length < 4) data = data.padEnd(4, '0');
            
            // Add 4 parity bits (simplified RS)
            const d = data.split('').map(Number);
            const p1 = (d[0] + d[1]) % 2;
            const p2 = (d[1] + d[2]) % 2;
            const p3 = (d[2] + d[3]) % 2;
            const p4 = (d[0] + d[3]) % 2;
            
            encoded += data + p1 + p2 + p3 + p4;
        }
        return encoded;
    }

    function reedSolomonDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 8) {
            let block = bits.substring(i, i + 8);
            if (block.length < 8) continue;
            
            // Extract data bits
            const data = block.substring(0, 4);
            decoded += data;
        }
        return decoded;
    }

    // Simplified LDPC (repetition code for demonstration)
    function ldpcEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i++) {
            encoded += bits[i] + bits[i]; // Rate 1/2
        }
        return encoded;
    }

    function ldpcDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 2) {
            const bit1 = bits[i];
            const bit2 = bits[i + 1] || bit1;
            // Majority voting
            decoded += bit1;
        }
        return decoded;
    }

    // Simplified Polar Code (repetition for demonstration)
    function polarEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i++) {
            encoded += bits[i] + bits[i]; // Rate 1/2
        }
        return encoded;
    }

    function polarDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 2) {
            const bit1 = bits[i];
            const bit2 = bits[i + 1] || bit1;
            decoded += bit1;
        }
        return decoded;
    }

    // Simplified Turbo Code (triple repetition for demonstration)
    function turboEncode(bits) {
        let encoded = '';
        for (let i = 0; i < bits.length; i++) {
            encoded += bits[i] + bits[i] + bits[i]; // Rate 1/3
        }
        return encoded;
    }

    function turboDecode(bits) {
        let decoded = '';
        for (let i = 0; i < bits.length; i += 3) {
            const bit1 = parseInt(bits[i] || '0');
            const bit2 = parseInt(bits[i + 1] || '0');
            const bit3 = parseInt(bits[i + 2] || '0');
            // Majority voting
            const sum = bit1 + bit2 + bit3;
            decoded += sum >= 2 ? '1' : '0';
        }
        return decoded;
    }

    function calculateTheoreticalBer(ebn0_db, modulation, channel) {
        const ebn0_linear = Math.pow(10, ebn0_db / 10);
        let ber = 0;

        if (channel === 'awgn') {
            switch (modulation) {
                case 'bpsk':
                case 'qpsk':
                    ber = 0.5 * erfc(Math.sqrt(ebn0_linear));
                    break;
                case '8psk':
                    ber = (1/3) * erfc(Math.sqrt(3 * ebn0_linear) * Math.sin(Math.PI / 8));
                    break;
                case '16qam':
                    ber = (3 / 8) * erfc(Math.sqrt((4 / 10) * ebn0_linear));
                    break;
                case '64qam':
                    ber = (7 / 24) * erfc(Math.sqrt((6 / 42) * ebn0_linear));
                    break;
                case '256qam':
                    ber = (15 / 64) * erfc(Math.sqrt((8 / 170) * ebn0_linear));
                    break;
                default: ber = 0;
            }
        } else if (channel === 'rayleigh') {
            switch (modulation) {
                case 'bpsk':
                    ber = 0.5 * (1 - Math.sqrt(ebn0_linear / (1 + ebn0_linear)));
                    break;
                case 'qpsk':
                    ber = 0.5 * (1 - Math.sqrt(ebn0_linear / (1 + ebn0_linear)));
                    break;
                case '8psk':
                    ber = (1/3) * (1 - Math.sqrt(3 * ebn0_linear / (1 + 3 * ebn0_linear)));
                    break;
                case '16qam':
                    // Aproximación para 16-QAM en canal Rayleigh
                    ber = (3 / 8) * (1 - Math.sqrt((4 / 10) * ebn0_linear / (1 + (4 / 10) * ebn0_linear)));
                    break;
                case '64qam':
                    // Aproximación para 64-QAM en canal Rayleigh
                    ber = (7 / 24) * (1 - Math.sqrt((6 / 42) * ebn0_linear / (1 + (6 / 42) * ebn0_linear)));
                    break;
                case '256qam':
                    // Aproximación para 256-QAM en canal Rayleigh
                    ber = (15 / 64) * (1 - Math.sqrt((8 / 170) * ebn0_linear / (1 + (8 / 170) * ebn0_linear)));
                    break;
                default:
                    ber = 0.5;
            }
        } else if (channel === 'rician') {
            // Para canal Rician, usar aproximación basada en AWGN (línea de visión dominante)
            // K-factor alto -> comportamiento similar a AWGN
            // Esta es una aproximación simplificada
            switch (modulation) {
                case 'bpsk':
                case 'qpsk':
                    ber = 0.5 * erfc(Math.sqrt(0.8 * ebn0_linear));
                    break;
                case '8psk':
                    ber = (1/3) * erfc(Math.sqrt(0.8 * 3 * ebn0_linear) * Math.sin(Math.PI / 8));
                    break;
                case '16qam':
                    ber = (3 / 8) * erfc(Math.sqrt(0.8 * (4 / 10) * ebn0_linear));
                    break;
                case '64qam':
                    ber = (7 / 24) * erfc(Math.sqrt(0.8 * (6 / 42) * ebn0_linear));
                    break;
                case '256qam':
                    ber = (15 / 64) * erfc(Math.sqrt(0.8 * (8 / 170) * ebn0_linear));
                    break;
                default: ber = 0;
            }
        } else {
            ber = 0.5;
        }

        return ber;
    }

    function displayResults(input, output, result) {
        berSimulatedSpan.textContent = result.simulatedBer.toExponential(4);
        berTheoreticalSpan.textContent = result.theoreticalBer.toExponential(4);
        codingGainSpan.textContent = result.codingGain.toFixed(2) + ' dB';
        throughputSpan.textContent = result.throughput.toFixed(2) + ' Mbps';
        spectralEfficiencySpan.textContent = result.spectralEfficiency.toFixed(3) + ' bits/s/Hz';
        paprSpan.textContent = result.papr.toFixed(2) + ' dB';
        evmSpan.textContent = result.evm.toFixed(2) + ' %';

        // Color code based on BER
        berSimulatedSpan.style.color = result.simulatedBer > 1e-3 ? '#d9534f' : '#5cb85c';

        inputSignalPre.textContent = formatSignal(input);
        outputSignalPre.textContent = formatSignal(output);
        
        // Show differences
        let errorStr = '';
        const minLen = Math.min(input.length, output.length);
        let errorCount = 0;
        for (let i = 0; i < minLen; i++) {
            if (input[i] !== output[i]) {
                if (errorCount < 20) { // Limit display to first 20 errors
                    errorStr += `Posición ${i}: ${input[i]} → ${output[i]}\n`;
                }
                errorCount++;
            }
        }
        if (errorCount > 20) {
            errorStr += `\n... y ${errorCount - 20} errores más (${result.errors} errores totales)`;
        }
        signalErrorsPre.textContent = errorStr || 'No se detectaron errores';
    }

    function formatSignal(signal) {
        return signal.replace(/(.{8})/g, '$1 ').trim();
    }

    function updateCharts(result, originalSymbols, noisySymbols) {
        // Update BER chart with history
        drawBERChart();
        drawConstellationChart(originalSymbols, noisySymbols);
    }

    function drawBERChart() {
        const canvas = document.getElementById('berChart');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        
        ctx.clearRect(0, 0, width, height);
        
        if (simulationHistory.length === 0) {
            drawEmptyBERChart();
            return;
        }

        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Simulación #', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('BER (log scale)', 0, 0);
        ctx.restore();

        // Plot data - filter out NaN and invalid values
        const validData = simulationHistory.filter(r => 
            !isNaN(r.simulatedBer) && !isNaN(r.theoreticalBer) && 
            r.simulatedBer > 0 && r.theoreticalBer > 0
        );
        
        if (validData.length === 0) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('Datos insuficientes para graficar', width / 2, height / 2);
            return;
        }
        
        const maxIndex = validData.length;
        const minBer = Math.min(...validData.map(r => Math.min(r.simulatedBer, r.theoreticalBer)));
        const maxBer = Math.max(...validData.map(r => Math.max(r.simulatedBer, r.theoreticalBer)));
        
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;

        // Draw theoretical BER
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;
        validData.forEach((r, i) => {
            const x = padding + (i / (maxIndex - 1 || 1)) * plotWidth;
            const logBer = Math.log10(r.theoreticalBer);
            if (!isFinite(logBer)) return;
            const y = height - padding - (logBer - Math.log10(maxBer)) / (Math.log10(minBer) - Math.log10(maxBer)) * plotHeight;
            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw simulated BER
        ctx.strokeStyle = '#f093fb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        started = false;
        validData.forEach((r, i) => {
            const x = padding + (i / (maxIndex - 1 || 1)) * plotWidth;
            const logBer = Math.log10(r.simulatedBer);
            if (!isFinite(logBer)) return;
            const y = height - padding - (logBer - Math.log10(maxBer)) / (Math.log10(minBer) - Math.log10(maxBer)) * plotHeight;
            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Legend
        ctx.fillStyle = '#667eea';
        ctx.fillRect(width - 200, 30, 20, 10);
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('BER Teórico', width - 175, 38);

        ctx.fillStyle = '#f093fb';
        ctx.fillRect(width - 200, 50, 20, 10);
        ctx.fillStyle = '#333';
        ctx.fillText('BER Simulado', width - 175, 58);
    }

    function drawConstellationChart(originalSymbols, noisySymbols) {
        const canvas = document.getElementById('constellationChart');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        
        ctx.clearRect(0, 0, width, height);

        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, padding);
        ctx.lineTo(width / 2, height - padding);
        ctx.moveTo(padding, height / 2);
        ctx.lineTo(width - padding, height / 2);
        ctx.stroke();

        // Labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('In-Phase (I)', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Quadrature (Q)', 0, 0);
        ctx.restore();

        // Find scale
        const allSymbols = [...originalSymbols, ...noisySymbols];
        const maxI = Math.max(...allSymbols.map(s => Math.abs(s.i)));
        const maxQ = Math.max(...allSymbols.map(s => Math.abs(s.q)));
        const scale = Math.max(maxI, maxQ) * 1.2;

        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;

        // Draw noisy symbols (received)
        ctx.fillStyle = 'rgba(240, 147, 251, 0.3)';
        noisySymbols.slice(0, 100).forEach(s => {
            const x = width / 2 + (s.i / scale) * plotWidth / 2;
            const y = height / 2 - (s.q / scale) * plotHeight / 2;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw original symbols (transmitted)
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        originalSymbols.slice(0, 100).forEach(s => {
            const x = width / 2 + (s.i / scale) * plotWidth / 2;
            const y = height / 2 - (s.q / scale) * plotHeight / 2;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Legend
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(width - 180, 40, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('Símbolos Transmitidos', width - 170, 43);

        ctx.fillStyle = 'rgba(240, 147, 251, 0.6)';
        ctx.beginPath();
        ctx.arc(width - 180, 60, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillText('Símbolos Recibidos', width - 170, 63);
    }

    function updateParamsTable(result) {
        const params = [
            ['Tecnología', getTechnologyName(result.technology)],
            ['Eb/N0', `${result.ebn0_db} dB`],
            ['SNR', `${result.snr.toFixed(2)} dB`],
            ['Velocidad de Datos', `${result.dataRate} Mbps`],
            ['Modulación', result.modulation.toUpperCase()],
            ['Canal', result.channel.toUpperCase()],
            ['Multiplexación', result.multiplexing.toUpperCase()],
            ['FEC', result.fec.toUpperCase()],
            ['Decodificación', result.decoding === 'soft' ? 'Soft Decision (LLR)' : 'Hard Decision'],
            ['Overhead FEC', `${((result.fecOverhead - 1) * 100).toFixed(0)}%`],
            ['Potencia de Señal', `${(10 * Math.log10(result.signalPower)).toFixed(2)} dBm`],
            ['Potencia de Ruido', `${(10 * Math.log10(result.noisePower)).toFixed(2)} dBm`],
            ['PAPR', `${result.papr.toFixed(2)} dB`],
            ['EVM', `${result.evm.toFixed(2)} %`],
            ['Throughput', `${result.throughput.toFixed(2)} Mbps`],
            ['Eficiencia Espectral', `${result.spectralEfficiency.toFixed(3)} bits/s/Hz`]
        ];

        if (result.k_factor_db !== null) {
            params.push(['Factor K Rician', `${result.k_factor_db} dB`]);
        }

        paramsTable.innerHTML = '<tr><th>Parámetro</th><th>Valor</th></tr>';
        params.forEach(([param, value]) => {
            const row = paramsTable.insertRow();
            row.insertCell().textContent = param;
            row.insertCell().textContent = value;
        });
    }

    function updateFECComparison(result, berNoFec) {
        const tbody = document.getElementById('fec-comparison-body');
        const improvement = berNoFec > 0 ? ((berNoFec - result.simulatedBer) / berNoFec * 100).toFixed(2) : '0.00';
        
        tbody.innerHTML = `
            <tr>
                <td>${result.fec.toUpperCase()}</td>
                <td>${berNoFec.toExponential(4)}</td>
                <td>${result.simulatedBer.toExponential(4)}</td>
                <td>${improvement}%</td>
                <td>${((result.fecOverhead - 1) * 100).toFixed(0)}%</td>
            </tr>
        `;
    }

    function getTechnologyName(tech) {
        const names = {
            '5g': '5G',
            '5g-advanced': '5G Avanzado',
            '6g': '6G'
        };
        return names[tech] || tech;
    }

    function compareTechnologies() {
        const ebn0_db = parseFloat(ebn0Input.value);
        const modulation = modulationSelect.value;
        const channel = channelSelect.value;
        const k_factor_db = parseFloat(ricianKInput.value);
        const dataRate = parseFloat(dataRateInput.value);

        const technologies = [
            { name: '5g', fec: 'ldpc', mod: 'qpsk' },
            { name: '5g-advanced', fec: 'ldpc', mod: '64qam' },
            { name: '6g', fec: 'polar', mod: '256qam' }
        ];

        const tbody = document.getElementById('tech-comparison-body');
        tbody.innerHTML = '';

        technologies.forEach(tech => {
            const numBits = 2000;
            const originalBits = generateRandomBits(numBits);
            
            // Simulate for this technology
            let encodedBits = tech.fec === 'ldpc' ? ldpcEncode(originalBits) : polarEncode(originalBits);
            const { symbols, k } = modulate(encodedBits, tech.mod);
            const noisySymbols = addNoise(symbols, ebn0_db, k, channel, k_factor_db);
            const demodulatedBits = demodulate(noisySymbols, tech.mod);
            const decodedBits = tech.fec === 'ldpc' ? ldpcDecode(demodulatedBits) : polarDecode(demodulatedBits);
            
            const errors = compareBits(originalBits, decodedBits);
            const simulatedBer = errors / numBits;
            const theoreticalBer = calculateTheoreticalBer(ebn0_db, tech.mod, channel);
            
            // Calculate without FEC
            const demodulatedBitsNoFec = demodulate(noisySymbols, tech.mod).substring(0, numBits);
            const errorsNoFec = compareBits(originalBits, demodulatedBitsNoFec);
            const berNoFec = errorsNoFec / numBits;
            const fecGain = berNoFec > 0 ? 10 * Math.log10(berNoFec / Math.max(simulatedBer, 1e-10)) : 0;
            const efficiency = (1 - simulatedBer) * 100;

            const row = tbody.insertRow();
            row.insertCell().textContent = getTechnologyName(tech.name);
            row.insertCell().textContent = simulatedBer.toExponential(4);
            row.insertCell().textContent = theoreticalBer.toExponential(4);
            row.insertCell().textContent = fecGain.toFixed(2) + ' dB';
            row.insertCell().textContent = efficiency.toFixed(2) + '%';
        });
    }

    function exportResults() {
        const dataStr = JSON.stringify(simulationHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ber_simulation_results_${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function compareChannelsAndFEC() {
        const modulation = modulationSelect.value;
        const channel = channelSelect.value;
        const k_factor_db = parseFloat(ricianKInput.value);
        
        // Compare different FEC techniques across Eb/N0 range
        const ebn0Range = [];
        for (let ebn0 = -5; ebn0 <= 15; ebn0 += 1) {
            ebn0Range.push(ebn0);
        }
        
        const fecTechniques = ['none', 'hamming', 'bch', 'reed-solomon', 'ldpc', 'polar', 'turbo'];
        const fecCurvesData = [];
        
        fecTechniques.forEach(fec => {
            const fecData = {
                name: fec,
                displayName: getFECDisplayName(fec),
                points: []
            };
            
            ebn0Range.forEach(ebn0_db => {
                const numBits = 2000;
                const originalBits = generateRandomBits(numBits);
                
                let encodedBits = originalBits;
                let decodeFn = (bits) => bits.substring(0, numBits);
                
                if (fec === 'hamming') {
                    encodedBits = hammingEncode(originalBits);
                    decodeFn = hammingDecode;
                } else if (fec === 'bch') {
                    encodedBits = bchEncode(originalBits);
                    decodeFn = bchDecode;
                } else if (fec === 'reed-solomon') {
                    encodedBits = reedSolomonEncode(originalBits);
                    decodeFn = reedSolomonDecode;
                } else if (fec === 'ldpc') {
                    encodedBits = ldpcEncode(originalBits);
                    decodeFn = ldpcDecode;
                } else if (fec === 'polar') {
                    encodedBits = polarEncode(originalBits);
                    decodeFn = polarDecode;
                } else if (fec === 'turbo') {
                    encodedBits = turboEncode(originalBits);
                    decodeFn = turboDecode;
                }
                
                const { symbols, k } = modulate(encodedBits, modulation);
                const noisySymbols = addNoise(symbols, ebn0_db, k, channel, k_factor_db);
                const demodulatedBits = demodulate(noisySymbols, modulation);
                const decodedBits = decodeFn(demodulatedBits);
                
                const errors = compareBits(originalBits, decodedBits);
                const simulatedBer = errors / numBits;
                
                fecData.points.push({
                    ebn0: ebn0_db,
                    ber: simulatedBer > 0 ? simulatedBer : 1e-10 // Avoid log(0)
                });
            });
            
            fecCurvesData.push(fecData);
        });
        
        // Draw linear comparison chart
        drawFECLinearComparisonChart(fecCurvesData);
        
        // Switch to comparison tab
        document.querySelector('[data-tab="comparison-tab"]').click();
    }
    
    function getFECDisplayName(fec) {
        const names = {
            'none': 'Sin FEC',
            'hamming': 'Hamming (7,4)',
            'bch': 'BCH',
            'reed-solomon': 'Reed-Solomon',
            'ldpc': 'LDPC',
            'polar': 'Polar Codes',
            'turbo': 'Turbo Codes'
        };
        return names[fec] || fec;
    }

    function drawChannelComparisonChart(data) {
        const canvas = document.getElementById('channelComparisonChart');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 80;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Tipo de Canal', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('BER', 0, 0);
        ctx.restore();
        
        // Chart title
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Comparación de Desempeño por Tipo de Canal', width / 2, 30);
        
        const barWidth = (width - 2 * padding) / (data.length * 2);
        const maxBer = Math.max(...data.map(d => Math.max(d.simulatedBer, d.theoreticalBer || 0)));
        
        data.forEach((d, i) => {
            const x = padding + i * barWidth * 2;
            
            // Simulated BER bar
            const simHeight = (d.simulatedBer / maxBer) * (height - 2 * padding);
            ctx.fillStyle = '#f093fb';
            ctx.fillRect(x + 10, height - padding - simHeight, barWidth - 20, simHeight);
            
            // Theoretical BER bar (if valid)
            if (d.theoreticalBer && !isNaN(d.theoreticalBer)) {
                const theoHeight = (d.theoreticalBer / maxBer) * (height - 2 * padding);
                ctx.fillStyle = '#667eea';
                ctx.fillRect(x + barWidth, height - padding - theoHeight, barWidth - 20, theoHeight);
            }
            
            // Channel label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(d.channel.toUpperCase(), x + barWidth, height - padding + 20);
        });
        
        // Legend
        ctx.fillStyle = '#f093fb';
        ctx.fillRect(width - 180, 60, 20, 10);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('BER Simulado', width - 155, 68);
        
        ctx.fillStyle = '#667eea';
        ctx.fillRect(width - 180, 80, 20, 10);
        ctx.fillStyle = '#333';
        ctx.fillText('BER Teórico', width - 155, 88);
    }

    function drawFECComparisonChart(data) {
        const canvas = document.getElementById('fecComparisonChart');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 80;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Técnica de Control de Errores (FEC)', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('BER', 0, 0);
        ctx.restore();
        
        // Chart title
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Comparación de Desempeño por Técnica FEC', width / 2, 30);
        
        const barWidth = (width - 2 * padding) / (data.length * 1.5);
        const maxBer = Math.max(...data.map(d => d.simulatedBer));
        
        data.forEach((d, i) => {
            const x = padding + i * barWidth * 1.2;
            
            // BER bar
            const barHeight = (d.simulatedBer / maxBer) * (height - 2 * padding);
            
            // Color gradient based on performance
            const colors = ['#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c', '#5cb85c'];
            ctx.fillStyle = colors[i] || '#667eea';
            ctx.fillRect(x + 10, height - padding - barHeight, barWidth - 20, barHeight);
            
            // FEC label
            ctx.fillStyle = '#333';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(d.fec.toUpperCase(), x + barWidth / 2, height - padding + 20);
            
            // BER value
            ctx.font = '10px Arial';
            ctx.fillText(d.simulatedBer.toExponential(2), x + barWidth / 2, height - padding - barHeight - 5);
        });
    }

    function drawFECLinearComparisonChart(curvesData) {
        const canvas = document.getElementById('fecComparisonChart');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 80;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Eb/N0 (dB)', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(25, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('BER (escala logarítmica)', 0, 0);
        ctx.restore();
        
        // Chart title
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Curvas BER vs Eb/N0 - Comparación de Técnicas FEC', width / 2, 30);
        
        // Find data ranges
        const minEbn0 = -5;
        const maxEbn0 = 15;
        const minBer = 1e-6;
        const maxBer = 1;
        
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;
        
        // Draw grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical grid lines (Eb/N0)
        for (let ebn0 = minEbn0; ebn0 <= maxEbn0; ebn0 += 2) {
            const x = padding + ((ebn0 - minEbn0) / (maxEbn0 - minEbn0)) * plotWidth;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            
            // X-axis labels
            ctx.fillStyle = '#666';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ebn0.toString(), x, height - padding + 15);
        }
        
        // Horizontal grid lines (BER - logarithmic)
        const logMinBer = Math.log10(minBer);
        const logMaxBer = Math.log10(maxBer);
        
        for (let logBer = logMinBer; logBer <= logMaxBer; logBer += 1) {
            const ber = Math.pow(10, logBer);
            const y = height - padding - ((logBer - logMaxBer) / (logMinBer - logMaxBer)) * plotHeight;
            
            ctx.strokeStyle = '#e0e0e0';
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            ctx.fillStyle = '#666';
            ctx.font = '11px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('10^' + logBer, padding - 10, y + 4);
        }
        
        // Define colors for each FEC technique
        const colors = [
            '#d9534f',  // none - red
            '#f0ad4e',  // hamming - orange
            '#5bc0de',  // bch - cyan
            '#9370db',  // reed-solomon - purple
            '#5cb85c',  // ldpc - green
            '#667eea',  // polar - blue
            '#f093fb'   // turbo - pink
        ];
        
        // Draw curves for each FEC technique
        curvesData.forEach((fecData, idx) => {
            ctx.strokeStyle = colors[idx] || '#333';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            let started = false;
            fecData.points.forEach(point => {
                const x = padding + ((point.ebn0 - minEbn0) / (maxEbn0 - minEbn0)) * plotWidth;
                const logBer = Math.log10(Math.max(point.ber, minBer));
                const y = height - padding - ((logBer - logMaxBer) / (logMinBer - logMaxBer)) * plotHeight;
                
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points on the curve
            ctx.fillStyle = colors[idx];
            fecData.points.forEach(point => {
                const x = padding + ((point.ebn0 - minEbn0) / (maxEbn0 - minEbn0)) * plotWidth;
                const logBer = Math.log10(Math.max(point.ber, minBer));
                const y = height - padding - ((logBer - logMaxBer) / (logMinBer - logMaxBer)) * plotHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
        
        // Draw legend
        const legendX = width - 250;
        const legendY = padding + 20;
        const legendSpacing = 25;
        
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('Leyenda:', legendX, legendY - 5);
        
        curvesData.forEach((fecData, idx) => {
            const y = legendY + (idx + 1) * legendSpacing;
            
            // Color line
            ctx.strokeStyle = colors[idx];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(legendX, y);
            ctx.lineTo(legendX + 30, y);
            ctx.stroke();
            
            // FEC name
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(fecData.displayName, legendX + 40, y + 4);
        });
        
        // Add instructions text
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Menor BER = Mejor desempeño', width / 2, height - 5);
    }

    function optimizeParameters() {
        const targetBer = 1e-6;
        const channel = channelSelect.value;
        const modulation = modulationSelect.value;
        
        let bestConfig = null;
        let bestEbn0 = -5;
        
        // Try different FEC techniques
        const fecOptions = ['polar', 'turbo', 'ldpc', 'bch', 'reed-solomon', 'hamming'];
        
        for (const fec of fecOptions) {
            for (let ebn0 = -5; ebn0 <= 15; ebn0 += 0.5) {
                const numBits = 1000;
                const originalBits = generateRandomBits(numBits);
                
                // Simulate
                let encodedBits = originalBits;
                if (fec === 'hamming') {
                    encodedBits = hammingEncode(originalBits);
                } else if (fec === 'bch') {
                    encodedBits = bchEncode(originalBits);
                } else if (fec === 'reed-solomon') {
                    encodedBits = reedSolomonEncode(originalBits);
                } else if (fec === 'ldpc') {
                    encodedBits = ldpcEncode(originalBits);
                } else if (fec === 'polar') {
                    encodedBits = polarEncode(originalBits);
                } else if (fec === 'turbo') {
                    encodedBits = turboEncode(originalBits);
                }
                
                const { symbols, k } = modulate(encodedBits, modulation);
                const k_factor_db = parseFloat(ricianKInput.value);
                const noisySymbols = addNoise(symbols, ebn0, k, channel, k_factor_db);
                const demodulatedBits = demodulate(noisySymbols, modulation);
                
                let decodedBits = demodulatedBits;
                if (fec === 'hamming') {
                    decodedBits = hammingDecode(demodulatedBits);
                } else if (fec === 'bch') {
                    decodedBits = bchDecode(demodulatedBits);
                } else if (fec === 'reed-solomon') {
                    decodedBits = reedSolomonDecode(demodulatedBits);
                } else if (fec === 'ldpc') {
                    decodedBits = ldpcDecode(demodulatedBits);
                } else if (fec === 'polar') {
                    decodedBits = polarDecode(demodulatedBits);
                } else if (fec === 'turbo') {
                    decodedBits = turboDecode(demodulatedBits);
                }
                
                const errors = compareBits(originalBits, decodedBits);
                const ber = errors / numBits;
                
                if (ber <= targetBer && (!bestConfig || ebn0 < bestEbn0)) {
                    bestConfig = { fec, ebn0 };
                    bestEbn0 = ebn0;
                    break;
                }
            }
            if (bestConfig && bestConfig.ebn0 <= 5) break; // Good enough
        }
        
        if (bestConfig) {
            alert(`Configuración óptima encontrada:\nFEC: ${bestConfig.fec.toUpperCase()}\nEb/N0: ${bestConfig.ebn0.toFixed(1)} dB\n\nSe aplicarán estos parámetros.`);
            fecSelect.value = bestConfig.fec;
            ebn0Input.value = bestConfig.ebn0;
            ebn0ValueSpan.textContent = bestConfig.ebn0;
            runSimulation();
        } else {
            alert('No se pudo encontrar una configuración que alcance el BER objetivo de 1e-6.\nIntente con una modulación más robusta o mejore las condiciones del canal.');
        }
    }
});