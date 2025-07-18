// Enhanced Save System 2.0
class SaveSystem {
    constructor() {
        this.saveSlots = 3;
        this.autosaveInterval = 30000; // 30 seconds
        this.saveScummingThreshold = 5; // Reloads per minute
        this.reloadCount = 0;
        this.lastReloadTime = 0;
        this.autosaveTimer = null;
        this.corruptionChance = 0.01; // 1% chance of corruption per save
        
        this.init();
    }
    
    init() {
        this.startAutosave();
        this.setupSaveScummingDetection();
    }
    
    startAutosave() {
        this.autosaveTimer = setInterval(() => {
            this.autosave();
        }, this.autosaveInterval);
    }
    
    setupSaveScummingDetection() {
        // Monitor for rapid reloads
        window.addEventListener('beforeunload', () => {
            this.recordReload();
        });
        
        // Check for save scumming on page load
        window.addEventListener('load', () => {
            this.checkSaveScumming();
        });
    }
    
    recordReload() {
        const now = Date.now();
        if (now - this.lastReloadTime < 60000) { // Within 1 minute
            this.reloadCount++;
        } else {
            this.reloadCount = 1;
        }
        this.lastReloadTime = now;
        
        localStorage.setItem('unsolved_reload_count', this.reloadCount.toString());
        localStorage.setItem('unsolved_last_reload', this.lastReloadTime.toString());
    }
    
    checkSaveScumming() {
        const savedCount = parseInt(localStorage.getItem('unsolved_reload_count') || '0');
        const savedTime = parseInt(localStorage.getItem('unsolved_last_reload') || '0');
        const now = Date.now();
        
        if (now - savedTime < 60000 && savedCount >= this.saveScummingThreshold) {
            this.warnSaveScumming();
        }
    }
    
    warnSaveScumming() {
        const warning = confirm(
            "⚠️ SAVE SCUMMING DETECTED ⚠️\n\n" +
            "You've reloaded the game " + this.reloadCount + " times in the last minute.\n" +
            "This behavior may corrupt your save files.\n\n" +
            "Continue anyway?"
        );
        
        if (!warning) {
            // Reset reload count if they cancel
            this.reloadCount = 0;
            localStorage.setItem('unsolved_reload_count', '0');
        } else {
            // Increase corruption chance
            this.corruptionChance *= 2;
            this.showCorruptionWarning();
        }
    }
    
    showCorruptionWarning() {
        if (nightModeSystem) {
            nightModeSystem.showDeveloperMessage(
                "Save file corruption detected. Your progress may be lost."
            );
        }
    }
    
    autosave() {
        const saveData = this.createSaveData();
        const saveKey = `unsolved_autosave_${Date.now()}`;
        
        // Check for corruption
        if (Math.random() < this.corruptionChance) {
            this.corruptSave(saveKey, saveData);
        } else {
            localStorage.setItem(saveKey, JSON.stringify(saveData));
        }
        
        // Clean up old autosaves (keep last 5)
        this.cleanupAutosaves();
        
        // Update save indicator
        this.updateSaveIndicator('Autosaved');
    }
    
    saveGame(slot = 0) {
        const saveData = this.createSaveData();
        const saveKey = `unsolved_save_${slot}`;
        
        // Check for corruption
        if (Math.random() < this.corruptionChance) {
            this.corruptSave(saveKey, saveData);
        } else {
            localStorage.setItem(saveKey, JSON.stringify(saveData));
        }
        
        // Update save indicator
        this.updateSaveIndicator(`Saved to slot ${slot + 1}`);
        
        // Show save confirmation
        this.showSaveConfirmation(slot);
    }
    
    loadGame(slot = 0) {
        const saveKey = `unsolved_save_${slot}`;
        const saveData = localStorage.getItem(saveKey);
        
        if (!saveData) {
            this.showLoadError('No save data found');
            return false;
        }
        
        try {
            const parsed = JSON.parse(saveData);
            
            // Check for corruption
            if (this.isSaveCorrupted(parsed)) {
                this.handleCorruptedSave(slot);
                return false;
            }
            
            this.applySaveData(parsed);
            this.updateSaveIndicator(`Loaded from slot ${slot + 1}`);
            return true;
            
        } catch (e) {
            this.handleCorruptedSave(slot);
            return false;
        }
    }
    
    loadAutosave() {
        const autosaves = this.getAutosaves();
        if (autosaves.length === 0) {
            this.showLoadError('No autosave found');
            return false;
        }
        
        // Get most recent autosave
        const latestAutosave = autosaves[autosaves.length - 1];
        const saveData = localStorage.getItem(latestAutosave.key);
        
        try {
            const parsed = JSON.parse(saveData);
            
            if (this.isSaveCorrupted(parsed)) {
                this.handleCorruptedAutosave();
                return false;
            }
            
            this.applySaveData(parsed);
            this.updateSaveIndicator('Loaded from autosave');
            return true;
            
        } catch (e) {
            this.handleCorruptedAutosave();
            return false;
        }
    }
    
    createSaveData() {
        return {
            version: '2.0',
            timestamp: Date.now(),
            gameState: {
                SANITY: gameState.SANITY,
                chosen: gameState.chosen,
                visitedTopics: Array.from(gameState.visitedTopics),
                hallucinationTriggered: gameState.hallucinationTriggered,
                currentCase: gameState.currentCase,
                collectedEvidence: gameState.collectedEvidence,
                achievements: Array.from(gameState.achievements),
                caseProgress: gameState.caseProgress,
                soundEnabled: gameState.soundEnabled,
                ttsEnabled: gameState.ttsEnabled
            },
            nightMode: {
                currentTime: nightModeSystem ? nightModeSystem.getCurrentTime() : 0,
                dayPhase: nightModeSystem ? nightModeSystem.getDayPhase() : 'day',
                sanityLevel: nightModeSystem ? nightModeSystem.getSanityLevel() : 100
            },
            checksum: this.generateChecksum()
        };
    }
    
    generateChecksum() {
        // Simple checksum for corruption detection
        const data = JSON.stringify(gameState);
        let checksum = 0;
        for (let i = 0; i < data.length; i++) {
            checksum += data.charCodeAt(i);
        }
        return checksum;
    }
    
    isSaveCorrupted(saveData) {
        if (!saveData || !saveData.gameState) return true;
        
        // Check version
        if (saveData.version !== '2.0') return true;
        
        // Check checksum
        const expectedChecksum = this.generateChecksum();
        if (saveData.checksum !== expectedChecksum) return true;
        
        return false;
    }
    
    corruptSave(saveKey, saveData) {
        // Intentionally corrupt the save data
        const corruptedData = {
            ...saveData,
            corrupted: true,
            corruptionType: this.getRandomCorruptionType(),
            originalData: btoa(JSON.stringify(saveData)) // Base64 encode original
        };
        
        localStorage.setItem(saveKey, JSON.stringify(corruptedData));
    }
    
    getRandomCorruptionType() {
        const types = [
            'memory_corruption',
            'data_integrity_error',
            'checksum_mismatch',
            'version_incompatibility',
            'file_system_error'
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    handleCorruptedSave(slot) {
        this.showCorruptedSaveScreen(slot);
        
        // Play corruption sound
        if (audioEngine) {
            audioEngine.playSound('glitch', { volume: 0.8 });
        }
        
        // Trigger visual effects
        if (nightModeSystem) {
            nightModeSystem.triggerGlitch();
        }
    }
    
    handleCorruptedAutosave() {
        this.showCorruptedSaveScreen('autosave');
        
        // Play corruption sound
        if (audioEngine) {
            audioEngine.playSound('glitch', { volume: 0.8 });
        }
        
        // Trigger visual effects
        if (nightModeSystem) {
            nightModeSystem.triggerGlitch();
        }
    }
    
    showCorruptedSaveScreen(slot) {
        const corruptionHTML = `
            <div id="corruption-screen" class="corruption-screen">
                <div class="corruption-content">
                    <h2>⚠️ SAVE FILE CORRUPTED ⚠️</h2>
                    <p>Save slot ${slot} has been corrupted.</p>
                    <p>Error: ${this.getRandomCorruptionType()}</p>
                    <div class="corruption-options">
                        <button onclick="saveSystem.repairSave(${slot})">🔧 Attempt Repair</button>
                        <button onclick="saveSystem.deleteSave(${slot})">🗑️ Delete Corrupted Save</button>
                        <button onclick="saveSystem.continueAnyway(${slot})">⚠️ Continue Anyway</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', corruptionHTML);
    }
    
    repairSave(slot) {
        const saveKey = `unsolved_save_${slot}`;
        const saveData = localStorage.getItem(saveKey);
        
        if (saveData) {
            try {
                const parsed = JSON.parse(saveData);
                if (parsed.originalData) {
                    // Try to restore from backup
                    const originalData = JSON.parse(atob(parsed.originalData));
                    localStorage.setItem(saveKey, JSON.stringify(originalData));
                    
                    this.hideCorruptionScreen();
                    this.showSaveConfirmation(slot, 'Repaired');
                    return;
                }
            } catch (e) {
                // Repair failed
            }
        }
        
        this.showLoadError('Repair failed. Save is permanently corrupted.');
    }
    
    deleteSave(slot) {
        const saveKey = `unsolved_save_${slot}`;
        localStorage.removeItem(saveKey);
        
        this.hideCorruptionScreen();
        this.showSaveConfirmation(slot, 'Deleted');
    }
    
    continueAnyway(slot) {
        this.hideCorruptionScreen();
        
        // Load corrupted save with warnings
        const saveKey = `unsolved_save_${slot}`;
        const saveData = localStorage.getItem(saveKey);
        
        if (saveData) {
            try {
                const parsed = JSON.parse(saveData);
                this.applySaveData(parsed);
                
                // Show warning
                if (nightModeSystem) {
                    nightModeSystem.showDeveloperMessage(
                        "You're playing with corrupted data. Expect glitches and instability."
                    );
                }
            } catch (e) {
                this.showLoadError('Failed to load corrupted save');
            }
        }
    }
    
    hideCorruptionScreen() {
        const corruptionScreen = document.getElementById('corruption-screen');
        if (corruptionScreen) {
            corruptionScreen.remove();
        }
    }
    
    applySaveData(saveData) {
        if (!saveData.gameState) return;
        
        const gs = saveData.gameState;
        
        gameState.SANITY = gs.SANITY || 100;
        gameState.chosen = gs.chosen || {};
        gameState.visitedTopics = new Set(gs.visitedTopics || []);
        gameState.hallucinationTriggered = gs.hallucinationTriggered || false;
        gameState.currentCase = gs.currentCase || null;
        gameState.collectedEvidence = gs.collectedEvidence || [];
        gameState.achievements = new Set(gs.achievements || []);
        gameState.caseProgress = gs.caseProgress || {};
        gameState.soundEnabled = gs.soundEnabled !== undefined ? gs.soundEnabled : true;
        gameState.ttsEnabled = gs.ttsEnabled !== undefined ? gs.ttsEnabled : true;
        
        // Apply night mode data
        if (saveData.nightMode && nightModeSystem) {
            nightModeSystem.setTime(saveData.nightMode.currentTime);
        }
        
        // Update UI
        this.updateUI();
    }
    
    updateUI() {
        // Update sanity display
        const sanityElement = document.getElementById('sanity');
        if (sanityElement) {
            sanityElement.textContent = `🧠 SANITY: ${gameState.SANITY}%`;
        }
        
        // Update achievements
        const achievementsElement = document.getElementById('achievements');
        if (achievementsElement) {
            achievementsElement.textContent = `🏆 ${gameState.achievements.size}`;
        }
        
        // Update progress bar
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const totalEvidence = Object.keys(gameState.cases).length * 4; // Assuming 4 evidence per case
            const collected = gameState.collectedEvidence.length;
            const percentage = (collected / totalEvidence) * 100;
            
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${collected}/${totalEvidence}`;
        }
    }
    
    updateSaveIndicator(message) {
        // Create or update save indicator
        let indicator = document.getElementById('save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.className = 'save-indicator';
            document.body.appendChild(indicator);
        }
        
        indicator.textContent = message;
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
    
    showSaveConfirmation(slot, action = 'Saved') {
        const message = `${action} to slot ${slot + 1}`;
        this.updateSaveIndicator(message);
    }
    
    showLoadError(message) {
        alert(`Load Error: ${message}`);
    }
    
    getAutosaves() {
        const autosaves = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('unsolved_autosave_')) {
                const timestamp = parseInt(key.replace('unsolved_autosave_', ''));
                autosaves.push({ key, timestamp });
            }
        }
        
        return autosaves.sort((a, b) => a.timestamp - b.timestamp);
    }
    
    cleanupAutosaves() {
        const autosaves = this.getAutosaves();
        
        // Keep only the last 5 autosaves
        if (autosaves.length > 5) {
            const toDelete = autosaves.slice(0, autosaves.length - 5);
            toDelete.forEach(autosave => {
                localStorage.removeItem(autosave.key);
            });
        }
    }
    
    // Public methods
    saveToSlot(slot) {
        this.saveGame(slot);
    }
    
    loadFromSlot(slot) {
        return this.loadGame(slot);
    }
    
    hasSaveInSlot(slot) {
        const saveKey = `unsolved_save_${slot}`;
        return localStorage.getItem(saveKey) !== null;
    }
    
    getSaveInfo(slot) {
        const saveKey = `unsolved_save_${slot}`;
        const saveData = localStorage.getItem(saveKey);
        
        if (!saveData) return null;
        
        try {
            const parsed = JSON.parse(saveData);
            return {
                timestamp: parsed.timestamp,
                case: parsed.gameState.currentCase,
                sanity: parsed.gameState.SANITY,
                evidence: parsed.gameState.collectedEvidence.length,
                corrupted: parsed.corrupted || false
            };
        } catch (e) {
            return { corrupted: true };
        }
    }
    
    deleteSaveSlot(slot) {
        const saveKey = `unsolved_save_${slot}`;
        localStorage.removeItem(saveKey);
    }
    
    destroy() {
        if (this.autosaveTimer) {
            clearInterval(this.autosaveTimer);
        }
    }
}

// Initialize save system
let saveSystem;
document.addEventListener('DOMContentLoaded', () => {
    saveSystem = new SaveSystem();
}); 