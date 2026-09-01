/**
 * ZAYYAN SHAIKH - EMBEDDED SYSTEMS & DIGITAL TWINS PORTFOLIO INTERACTIVITY
 * Controls navigation, digital twin simulations, image fallback component, and interactive diagrams.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initImageFallbackComponent();
    initImageModal();
    initHeroDiagramAnimation();
    initAirPurifierTwin();
    initFuelGuardTwin();
    initGreenBoreTwin();
});

/* --- STICKY NAVIGATION & MOBILE MENU --- */
function initNavigation() {
    const navbar = document.querySelector('.site-nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
            const isOpen = mobileDrawer.classList.contains('open');
            mobileBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close drawer when clicking a link
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
            });
        });
    }
}

/* --- REUSABLE IMAGE PLACEHOLDER COMPONENT SYSTEM --- */
function initImageFallbackComponent() {
    const placeholderContainers = document.querySelectorAll('.image-placeholder-container');
    
    placeholderContainers.forEach(container => {
        const img = container.querySelector('img');
        const fallback = container.querySelector('.placeholder-fallback');
        
        if (img && fallback) {
            // Check if image loads successfully
            img.onload = () => {
                img.style.display = 'block';
                fallback.style.display = 'none';
            };
            
            img.onerror = () => {
                img.style.display = 'none';
                fallback.style.display = 'flex';
            };

            // Force check if already complete or cached
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    img.style.display = 'none';
                    fallback.style.display = 'flex';
                } else {
                    img.style.display = 'block';
                    fallback.style.display = 'none';
                }
            }
        }
    });
}

/* --- HERO ANIMATED SIGNAL DIAGRAM --- */
function initHeroDiagramAnimation() {
    const nodes = document.querySelectorAll('.diagram-node');
    if (!nodes.length) return;

    let activeIndex = 0;
    setInterval(() => {
        nodes.forEach((node, idx) => {
            if (idx === activeIndex) {
                node.style.borderColor = 'var(--accent-teal)';
                node.style.backgroundColor = '#FFFFFF';
            } else {
                node.style.borderColor = 'var(--border-light)';
                node.style.backgroundColor = 'var(--bg-main)';
            }
        });
        activeIndex = (activeIndex + 1) % nodes.length;
    }, 2000);
}

/* --- AIR PURIFIER DIGITAL TWIN SIMULATOR --- */
function initAirPurifierTwin() {
    const container = document.getElementById('air-purifier-twin');
    if (!container) return;

    let fanState = true;
    let ionizerState = true;
    let mode = 'AUTO';
    let aqiThreshold = 50;
    
    let aqi = 38;
    let temp = 24.2;
    let humidity = 48;
    let fanSpeed = 65;

    const valAqi = container.querySelector('.twin-val-aqi');
    const valTemp = container.querySelector('.twin-val-temp');
    const valHum = container.querySelector('.twin-val-hum');
    const valFan = container.querySelector('.twin-val-fan');
    const valIonizer = container.querySelector('.twin-val-ionizer');
    const valMode = container.querySelector('.twin-val-mode');
    
    const btnFan = container.querySelector('.btn-toggle-fan');
    const btnIonizer = container.querySelector('.btn-toggle-ionizer');
    const btnMode = container.querySelector('.btn-toggle-mode');
    const sliderThreshold = container.querySelector('.slider-threshold');
    const txtThreshold = container.querySelector('.txt-threshold-val');

    function updateDisplay() {
        if (valAqi) valAqi.textContent = Math.round(aqi);
        if (valTemp) valTemp.textContent = temp.toFixed(1);
        if (valHum) valHum.textContent = Math.round(humidity);
        if (valFan) valFan.textContent = fanState ? `${fanSpeed}%` : 'OFF';
        if (valIonizer) valIonizer.textContent = ionizerState ? 'ACTIVE' : 'OFF';
        if (valMode) valMode.textContent = mode;
        if (txtThreshold && sliderThreshold) txtThreshold.textContent = sliderThreshold.value;
    }

    if (btnFan) {
        btnFan.addEventListener('click', () => {
            fanState = !fanState;
            btnFan.classList.toggle('active', fanState);
            btnFan.textContent = `FAN RELAY: ${fanState ? 'ON' : 'OFF'}`;
            updateDisplay();
        });
    }

    if (btnIonizer) {
        btnIonizer.addEventListener('click', () => {
            ionizerState = !ionizerState;
            btnIonizer.classList.toggle('active', ionizerState);
            btnIonizer.textContent = `IONIZER RELAY: ${ionizerState ? 'ON' : 'OFF'}`;
            updateDisplay();
        });
    }

    if (btnMode) {
        btnMode.addEventListener('click', () => {
            mode = mode === 'AUTO' ? 'MANUAL' : 'AUTO';
            btnMode.textContent = `MODE: ${mode}`;
            updateDisplay();
        });
    }

    if (sliderThreshold) {
        sliderThreshold.addEventListener('input', (e) => {
            aqiThreshold = parseInt(e.target.value);
            updateDisplay();
        });
    }

    // Gentle sensor fluctuation simulation
    setInterval(() => {
        aqi += (Math.random() - 0.48) * 1.5;
        aqi = Math.max(15, Math.min(180, aqi));
        
        if (mode === 'AUTO') {
            const onPoint = aqiThreshold + 10;
            const offPoint = Math.max(0, aqiThreshold - 10);
            if (aqi >= onPoint) {
                fanState = true;
                ionizerState = true;
                fanSpeed = Math.min(100, 50 + Math.round((aqi - onPoint) * 0.8));
            } else if (aqi <= offPoint) {
                fanState = false;
                ionizerState = false;
                fanSpeed = 0;
            }
        }
        updateDisplay();
    }, 2500);

    updateDisplay();
}

/* --- FUELGUARD DIGITAL TWIN SIMULATOR --- */
function initFuelGuardTwin() {
    const container = document.getElementById('fuelguard-twin');
    if (!container) return;

    let resistivity = 1.42; // Volts ADC
    let ldrReading = 720;   // Raw ADC light transmission
    let phaseSeparated = false;
    let pumpActive = false;
    let octaneActive = false;

    const valRes = container.querySelector('.fg-val-res');
    const valLdr = container.querySelector('.fg-val-ldr');
    const valStatus = container.querySelector('.fg-val-status');
    const valPump = container.querySelector('.fg-val-pump');
    const valOctane = container.querySelector('.fg-val-octane');
    const btnSimulate = container.querySelector('.btn-simulate-water');

    function updateDisplay() {
        if (valRes) valRes.textContent = `${resistivity.toFixed(2)} V`;
        if (valLdr) valLdr.textContent = Math.round(ldrReading);
        if (valStatus) {
            valStatus.textContent = phaseSeparated ? 'PHASE SEPARATION DETECTED!' : 'NORMAL PETROL';
            valStatus.style.color = phaseSeparated ? '#EF4444' : '#10B981';
        }
        if (valPump) valPump.textContent = pumpActive ? 'ACTIVE (AIR EXTRACT)' : 'OFF';
        if (valOctane) valOctane.textContent = octaneActive ? 'DOSING' : 'OFF';
    }

    if (btnSimulate) {
        btnSimulate.addEventListener('click', () => {
            btnSimulate.disabled = true;
            btnSimulate.textContent = 'SIMULATING PHASE SEPARATION...';
            
            // Trigger phase separation
            resistivity = 3.65;
            ldrReading = 310;
            phaseSeparated = true;
            updateDisplay();

            // Auto removal sequence simulation
            setTimeout(() => {
                pumpActive = true;
                updateDisplay();
            }, 1500);

            setTimeout(() => {
                pumpActive = false;
                octaneActive = true;
                updateDisplay();
            }, 4500);

            setTimeout(() => {
                octaneActive = false;
                resistivity = 1.45;
                ldrReading = 715;
                phaseSeparated = false;
                btnSimulate.disabled = false;
                btnSimulate.textContent = '⚡ TRIGGER WATER/ETHANOL CONTAMINATION (SIMULATION)';
                updateDisplay();
            }, 7500);
        });
    }

    updateDisplay();
}

/* --- GREENBORE AI 3D DIGITAL TWIN & RAG CO-PILOT SIMULATOR --- */
function initGreenBoreTwin() {
    const container = document.getElementById('greenbore-twin');
    if (!container) return;

    let depth = 340;
    let gamma = 45;
    let resistivity = 120;
    let porosity = 22;
    let modelPred = 'AQUIFER (HIGH-YIELD)';

    const valDepth = container.querySelector('.gb-val-depth');
    const valGamma = container.querySelector('.gb-val-gamma');
    const valRes = container.querySelector('.gb-val-res');
    const valPorosity = container.querySelector('.gb-val-porosity');
    const valModel = container.querySelector('.gb-val-model');
    const btnRag = container.querySelector('.btn-simulate-rag');
    const boxCopilot = container.querySelector('.gb-copilot-output');

    function updateDisplay() {
        if (valDepth) valDepth.textContent = `${depth} m`;
        if (valGamma) valGamma.textContent = `${gamma} API`;
        if (valRes) valRes.textContent = `${resistivity} Ω·m`;
        if (valPorosity) valPorosity.textContent = `${porosity}%`;
        if (valModel) valModel.textContent = modelPred;
    }

    if (btnRag && boxCopilot) {
        btnRag.addEventListener('click', () => {
            boxCopilot.style.display = 'block';
            boxCopilot.innerHTML = '<span style="color: #F59E0B;">Querying pgvector vector database & Google Gemini LLM API...</span>';
            
            setTimeout(() => {
                boxCopilot.innerHTML = `
                    <span style="color: #38BDF8; font-weight: 700;">RAG CO-PILOT RESPONSE (PostgreSQL pgvector + Gemini):</span><br>
                    "Analyzed stratum at depth ${depth}m: Gamma-Ray (${gamma} API), Porosity (${porosity}%), and Resistivity (${resistivity} Ω·m) indicate a clean permeable sandstone reservoir. XGBoost Classifier probability: 94.8%. Recommendation: High groundwater yield expected; proceed with target casing."
                `;
            }, 1200);
        });
    }

    updateDisplay();
}

/* --- LIGHTBOX FULLSCREEN IMAGE MODAL --- */
function initImageModal() {
    let overlay = document.querySelector('.image-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'image-modal-overlay';
        overlay.innerHTML = `
            <div class="image-modal-container">
                <button class="image-modal-close" aria-label="Close image modal">&times;</button>
                <img class="image-modal-img" src="" alt="Enlarged view">
                <div class="image-modal-placeholder-box" style="display: none;">
                    <div class="placeholder-icon" style="width: 54px; height: 54px; margin-bottom: 1rem;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <div class="modal-ph-title" style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase;"></div>
                    <div class="modal-ph-path" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-teal-dark); background-color: var(--accent-teal-light); padding: 0.3rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--accent-teal-border); margin-bottom: 1rem;"></div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); max-width: 480px; line-height: 1.5;">Drop your photograph file into the assets folder to display your high-resolution image here.</div>
                </div>
                <div class="image-modal-caption"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const modalImg = overlay.querySelector('.image-modal-img');
    const placeholderBox = overlay.querySelector('.image-modal-placeholder-box');
    const modalPhTitle = overlay.querySelector('.modal-ph-title');
    const modalPhPath = overlay.querySelector('.modal-ph-path');
    const modalCaption = overlay.querySelector('.image-modal-caption');
    const closeBtn = overlay.querySelector('.image-modal-close');

    function closeModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeModal();
        }
    });

    const containers = document.querySelectorAll('.image-placeholder-container');
    containers.forEach(container => {
        container.style.cursor = 'pointer';
        container.title = 'Click to open full ratio view';

        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            const caption = container.querySelector('.placeholder-caption');
            const fallbackTitle = container.querySelector('.placeholder-title');
            const fallbackPath = container.querySelector('.placeholder-path');

            if (img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0) {
                modalImg.src = img.src;
                modalImg.alt = img.alt || 'Full size view';
                modalImg.style.display = 'block';
                placeholderBox.style.display = 'none';
            } else {
                modalImg.style.display = 'none';
                placeholderBox.style.display = 'flex';
                modalPhTitle.textContent = fallbackTitle ? fallbackTitle.textContent : 'IMAGE PLACEHOLDER';
                modalPhPath.textContent = fallbackPath ? fallbackPath.textContent : '';
            }

            if (caption) {
                modalCaption.textContent = caption.textContent;
                modalCaption.style.display = 'block';
            } else {
                modalCaption.style.display = 'none';
            }

            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
}
