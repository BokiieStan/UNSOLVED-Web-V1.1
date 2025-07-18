// UNSOLVED v2.0³ - TRINITY PROTOCOL
// "It's no longer about solving the case. Now the case solves you."

class TrinityProtocol {
    constructor() {
        this.sanity = {
            cognitive: 100,    // Logic
            emotional: 100,    // Morality  
            perceptual: 100    // Reality
        };
        
        this.evidenceEvolution = new Map();
        this.livingArchive = [];
        this.cursedObjects = [];
        this.playerBehavior = {
            playTime: 0,
            fileOpens: new Map(),
            clicks: 0,
            idleTime: 0,
            lastAction: Date.now()
        };
        
        this.gameMode = 'vanishing'; // 'vanishing', 'restricted', 'whispernet'
        this.symbiosisLevel = 0;
        this.ttsVoices = [];
        this.ambientLayers = [];
        
        this.init();
    }
    
    init() {
        this.setupSanityMeters();
        this.setupEvidenceEvolution();
        this.setupLivingArchive();
        this.setupBehaviorTracking();
        this.setupAudioLayering();
        this.setupGameModes();
        this.setupSecretTriggers();
    }
    
    setupSanityMeters() {
        // Create three separate sanity meters
        const sanityContainer = document.createElement('div');
        sanityContainer.id = 'trinity-sanity';
        sanityContainer.className = 'trinity-sanity-container';
        sanityContainer.innerHTML = `
            <div class="sanity-meter cognitive">
                <span class="sanity-label">🧠 Cognitive Stability</span>
                <div class="sanity-bar">
                    <div class="sanity-fill" id="cognitive-fill"></div>
                </div>
                <span class="sanity-value" id="cognitive-value">100%</span>
            </div>
            <div class="sanity-meter emotional">
                <span class="sanity-label">💔 Emotional Integrity</span>
                <div class="sanity-bar">
                    <div class="sanity-fill" id="emotional-fill"></div>
                </div>
                <span class="sanity-value" id="emotional-value">100%</span>
            </div>
            <div class="sanity-meter perceptual">
                <span class="sanity-label">👁️ Perceptual Anchoring</span>
                <div class="sanity-bar">
                    <div class="sanity-fill" id="perceptual-fill"></div>
                </div>
                <span class="sanity-value" id="perceptual-value">100%</span>
            </div>
        `;
        
        document.body.appendChild(sanityContainer);
        this.updateSanityDisplay();
    }
    
    updateSanityDisplay() {
        Object.keys(this.sanity).forEach(type => {
            const fill = document.getElementById(`${type}-fill`);
            const value = document.getElementById(`${type}-value`);
            if (fill && value) {
                fill.style.width = `${this.sanity[type]}%`;
                value.textContent = `${this.sanity[type]}%`;
                
                // Apply visual effects based on sanity type
                this.applySanityEffects(type, this.sanity[type]);
            }
        });
    }
    
    applySanityEffects(type, value) {
        const body = document.body;
        
        switch(type) {
            case 'cognitive':
                if (value < 30) {
                    body.style.filter = 'hue-rotate(180deg) contrast(150%)';
                } else if (value < 60) {
                    body.style.filter = 'hue-rotate(90deg) contrast(120%)';
                } else {
                    body.style.filter = 'none';
                }
                break;
                
            case 'emotional':
                if (value < 30) {
                    body.style.animation = 'emotionalShake 0.1s infinite';
                } else if (value < 60) {
                    body.style.animation = 'emotionalPulse 2s infinite';
                } else {
                    body.style.animation = 'none';
                }
                break;
                
            case 'perceptual':
                if (value < 30) {
                    this.createGlitchOverlay();
                } else if (value < 60) {
                    this.createDistortionEffect();
                } else {
                    this.removeVisualEffects();
                }
                break;
        }
    }
    
    setupEvidenceEvolution() {
        // Evidence files now have life and can mutate
        this.evidenceEvolution = new Map();
        
        // Track file interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.evidence-item') || e.target.closest('.file-display')) {
                this.evolveEvidence(e.target);
            }
        });
    }
    
    evolveEvidence(element) {
        const fileId = element.dataset.fileId || 'unknown';
        const interactions = this.evidenceEvolution.get(fileId) || 0;
        this.evidenceEvolution.set(fileId, interactions + 1);
        
        if (interactions > 5) {
            this.mutateFile(element);
        }
        
        if (interactions > 10) {
            this.makeFileHostile(element);
        }
    }
    
    mutateFile(element) {
        // File starts to change
        const originalText = element.textContent;
        const words = originalText.split(' ');
        const mutatedWords = words.map(word => {
            if (Math.random() < 0.1) {
                return this.getGlitchWord();
            }
            return word;
        });
        
        element.textContent = mutatedWords.join(' ');
        element.style.color = '#ff0000';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 3000);
    }
    
    makeFileHostile(element) {
        // File fights back
        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.attackPlayer();
        }, { once: true });
        
        element.style.cursor = 'crosshair';
        element.title = 'This file is watching you...';
    }
    
    setupLivingArchive() {
        // Create the living archive interface
        const archiveHTML = `
            <div id="living-archive" class="living-archive hidden">
                <div class="archive-header">
                    <h3>🗂️ Living Archive</h3>
                    <button class="archive-close">×</button>
                </div>
                <div class="archive-content">
                    <div class="archive-files"></div>
                    <div class="archive-arguments"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', archiveHTML);
    }
    
    setupBehaviorTracking() {
        // Track player behavior for symbiosis
        setInterval(() => {
            this.playerBehavior.playTime += 1;
            this.playerBehavior.idleTime = Date.now() - this.playerBehavior.lastAction;
            
            // Check for secret triggers
            this.checkSecretTriggers();
            
            // Update symbiosis level
            this.updateSymbiosis();
        }, 1000);
        
        // Track clicks and interactions
        document.addEventListener('click', () => {
            this.playerBehavior.clicks++;
            this.playerBehavior.lastAction = Date.now();
        });
    }
    
    setupAudioLayering() {
        // Three TTS voices
        this.ttsVoices = [
            { name: 'cognitive', rate: 1.0, pitch: 1.0 },
            { name: 'emotional', rate: 0.8, pitch: 1.2 },
            { name: 'perceptual', rate: 1.2, pitch: 0.8 }
        ];
        
        // Ambient soundtrack layers
        this.ambientLayers = [
            { name: 'base', volume: 0.3 },
            { name: 'tension', volume: 0.2 },
            { name: 'paranoia', volume: 0.1 }
        ];
    }
    
    setupGameModes() {
        // Game mode selection
        const modeSelector = document.createElement('div');
        modeSelector.id = 'game-mode-selector';
        modeSelector.className = 'mode-selector hidden';
        modeSelector.innerHTML = `
            <h3>🕵️‍♀️ Select Game Mode</h3>
            <div class="mode-option" data-mode="vanishing">
                <h4>🌒 THE VANISHING REPORT</h4>
                <p>The game is missing pieces. You're reconstructing the game itself.</p>
            </div>
            <div class="mode-option" data-mode="restricted">
                <h4>☣️ PROTOCOL: RESTRICTED</h4>
                <p>You are no longer authorized. Break into secure folders.</p>
            </div>
            <div class="mode-option" data-mode="whispernet">
                <h4>📻 WHISPERNET</h4>
                <p>Play while connected to real time. Fake emails arrive based on actual day.</p>
            </div>
        `;
        
        document.body.appendChild(modeSelector);
        
        // Mode selection handlers
        modeSelector.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', () => {
                this.setGameMode(option.dataset.mode);
            });
        });
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
        
        switch(mode) {
            case 'vanishing':
                this.activateVanishingMode();
                break;
            case 'restricted':
                this.activateRestrictedMode();
                break;
            case 'whispernet':
                this.activateWhispernetMode();
                break;
        }
    }
    
    activateVanishingMode() {
        // Files disappear and rewrite each other
        setInterval(() => {
            const files = document.querySelectorAll('.file-display, .evidence-item');
            if (files.length > 0) {
                const randomFile = files[Math.floor(Math.random() * files.length)];
                this.makeFileVanish(randomFile);
            }
        }, 30000);
    }
    
    activateRestrictedMode() {
        // Create fake OS interface
        this.createFakeOS();
        
        // Add fake encryption
        this.addFakeEncryption();
    }
    
    activateWhispernetMode() {
        // Connect to real time
        this.setupRealTimeConnection();
        
        // Fake emails based on actual day
        this.setupFakeEmails();
    }
    
    setupSecretTriggers() {
        // Secret triggers for the final mode
        this.secretTriggers = {
            idle6Hours: false,
            openCorrupted99Times: false,
            dragAndDelete: false
        };
    }
    
    checkSecretTriggers() {
        // Check for 6 hours idle
        if (this.playerBehavior.idleTime > 21600000 && !this.secretTriggers.idle6Hours) {
            this.secretTriggers.idle6Hours = true;
            this.triggerSecretMode();
        }
        
        // Check for 99 corrupted file opens
        const corruptedOpens = Array.from(this.playerBehavior.fileOpens.values())
            .filter(opens => opens > 99).length;
        if (corruptedOpens > 0 && !this.secretTriggers.openCorrupted99Times) {
            this.secretTriggers.openCorrupted99Times = true;
            this.triggerSecretMode();
        }
    }
    
    triggerSecretMode() {
        // Screen "crashes"
        document.body.style.animation = 'screenCrash 0.5s forwards';
        
        setTimeout(() => {
            const crashMessage = document.createElement('div');
            crashMessage.className = 'crash-message';
            crashMessage.textContent = "You're not supposed to remember this case.";
            document.body.appendChild(crashMessage);
        }, 500);
    }
    
    // Utility functions
    getGlitchWord() {
        const glitches = ["[[error]]", "███", "what did you see?", "he's behind you", "I know your name", "🕯️"];
        return glitches[Math.floor(Math.random() * glitches.length)];
    }
    
    attackPlayer() {
        // File attacks the player
        this.sanity.perceptual -= 10;
        this.sanity.emotional -= 5;
        this.updateSanityDisplay();
        
        // Visual attack effect
        document.body.style.animation = 'fileAttack 0.3s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }
    
    updateSymbiosis() {
        // Player behavior affects gameplay
        this.symbiosisLevel = Math.min(100, this.playerBehavior.playTime / 3600);
        
        if (this.symbiosisLevel > 50) {
            // Game starts to adapt to player
            this.adaptToPlayer();
        }
    }
    
    adaptToPlayer() {
        // Game learns from player behavior
        const avgClicksPerMinute = this.playerBehavior.clicks / (this.playerBehavior.playTime / 60);
        
        if (avgClicksPerMinute > 10) {
            // Fast player - speedrun endings
            this.enableSpeedrunMode();
        } else if (avgClicksPerMinute < 2) {
            // Slow player - slowburn endings
            this.enableSlowburnMode();
        }
    }
    
    // Placeholder functions for complex features
    createGlitchOverlay() { /* Implementation */ }
    createDistortionEffect() { /* Implementation */ }
    removeVisualEffects() { /* Implementation */ }
    makeFileVanish(file) { /* Implementation */ }
    createFakeOS() { /* Implementation */ }
    addFakeEncryption() { /* Implementation */ }
    setupRealTimeConnection() { /* Implementation */ }
    setupFakeEmails() { /* Implementation */ }
    enableSpeedrunMode() { /* Implementation */ }
    enableSlowburnMode() { /* Implementation */ }
}

// Initialize Trinity Protocol
let trinityProtocol;
document.addEventListener('DOMContentLoaded', () => {
    trinityProtocol = new TrinityProtocol();
}); 