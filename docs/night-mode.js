// Night Mode and Sanity Effects System
class NightModeSystem {
    constructor() {
        this.currentTime = 0; // 0-24 hour format
        this.dayPhase = 'day'; // day, evening, night, midnight
        this.sanityLevel = 100;
        this.nightOverlay = null;
        this.vhsOverlay = null;
        this.whisperLayer = null;
        this.customCursor = null;
        this.isNightMode = false;
        this.glitchIntensity = 0;
        
        this.init();
    }
    
    init() {
        this.nightOverlay = document.getElementById('night-overlay');
        this.vhsOverlay = document.getElementById('vhs-overlay');
        this.whisperLayer = document.getElementById('whisper-layer');
        this.customCursor = document.getElementById('custom-cursor');
        
        this.setupCustomCursor();
        this.startTimeSystem();
        this.startSanityMonitoring();
    }
    
    setupCustomCursor() {
        if (!this.customCursor) return;
        
        document.addEventListener('mousemove', (e) => {
            this.customCursor.style.left = e.clientX + 'px';
            this.customCursor.style.top = e.clientY + 'px';
        });
        
        // Change cursor based on sanity
        this.updateCursorStyle();
    }
    
    startTimeSystem() {
        // Update time every minute
        setInterval(() => {
            this.currentTime = (this.currentTime + 0.1) % 24;
            this.updateDayPhase();
            this.updateLighting();
        }, 60000); // 1 minute = 0.1 hours
        
        // Initial update
        this.updateDayPhase();
        this.updateLighting();
    }
    
    updateDayPhase() {
        const oldPhase = this.dayPhase;
        
        if (this.currentTime >= 6 && this.currentTime < 18) {
            this.dayPhase = 'day';
        } else if (this.currentTime >= 18 && this.currentTime < 21) {
            this.dayPhase = 'evening';
        } else if (this.currentTime >= 21 && this.currentTime < 24) {
            this.dayPhase = 'night';
        } else {
            this.dayPhase = 'midnight';
        }
        
        if (oldPhase !== this.dayPhase) {
            this.onPhaseChange(oldPhase, this.dayPhase);
        }
    }
    
    updateLighting() {
        if (!this.nightOverlay) return;
        
        let opacity = 0;
        let intensity = 'normal';
        
        switch (this.dayPhase) {
            case 'day':
                opacity = 0;
                break;
            case 'evening':
                opacity = 0.3;
                break;
            case 'night':
                opacity = 0.6;
                break;
            case 'midnight':
                opacity = 0.8;
                intensity = 'intense';
                break;
        }
        
        // Apply sanity-based modifications
        if (this.sanityLevel < 30) {
            opacity += 0.2;
            intensity = 'intense';
        } else if (this.sanityLevel < 60) {
            opacity += 0.1;
        }
        
        this.nightOverlay.style.opacity = opacity;
        this.nightOverlay.className = `night-overlay ${opacity > 0 ? 'active' : ''} ${intensity === 'intense' ? 'intense' : ''}`;
        
        this.isNightMode = opacity > 0;
    }
    
    onPhaseChange(oldPhase, newPhase) {
        // Trigger phase-specific events
        if (newPhase === 'night' || newPhase === 'midnight') {
            this.activateNightMode();
        } else if (oldPhase === 'night' || oldPhase === 'midnight') {
            this.deactivateNightMode();
        }
        
        // Update audio mood
        if (audioEngine) {
            const mood = this.getMoodForPhase(newPhase);
            audioEngine.setMood(mood);
        }
    }
    
    getMoodForPhase(phase) {
        const moods = {
            'day': 'neutral',
            'evening': 'tension',
            'night': 'tension',
            'midnight': 'danger'
        };
        return moods[phase] || 'neutral';
    }
    
    activateNightMode() {
        if (this.whisperLayer) {
            this.whisperLayer.classList.add('active');
        }
        
        // Start random glitch effects
        this.startGlitchEffects();
    }
    
    deactivateNightMode() {
        if (this.whisperLayer) {
            this.whisperLayer.classList.remove('active');
        }
        
        this.stopGlitchEffects();
    }
    
    startGlitchEffects() {
        this.glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.triggerGlitch();
            }
        }, 3000);
    }
    
    stopGlitchEffects() {
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
    }
    
    triggerGlitch() {
        if (!this.vhsOverlay) return;
        
        this.vhsOverlay.classList.add('active');
        
        // Random glitch duration
        const duration = 500 + Math.random() * 1000;
        
        setTimeout(() => {
            this.vhsOverlay.classList.remove('active');
        }, duration);
        
        // Play glitch sound
        if (audioEngine) {
            audioEngine.playSound('glitch', { volume: 0.3 });
        }
    }
    
    startSanityMonitoring() {
        // Monitor sanity changes and apply effects
        setInterval(() => {
            this.updateSanityEffects();
        }, 1000);
    }
    
    updateSanityEffects() {
        const oldLevel = this.sanityLevel;
        this.sanityLevel = gameState.SANITY;
        
        if (oldLevel !== this.sanityLevel) {
            this.onSanityChange(oldLevel, this.sanityLevel);
        }
        
        // Apply visual effects based on sanity
        this.applySanityVisualEffects();
        this.updateCursorStyle();
        
        // Update audio effects
        if (audioEngine) {
            audioEngine.updateSanityEffects(this.sanityLevel);
        }
    }
    
    onSanityChange(oldLevel, newLevel) {
        // Trigger sanity-based events
        if (newLevel < 30 && oldLevel >= 30) {
            this.triggerCriticalSanity();
        } else if (newLevel < 60 && oldLevel >= 60) {
            this.triggerLowSanity();
        } else if (newLevel >= 60 && oldLevel < 60) {
            this.triggerRecovery();
        }
    }
    
    triggerCriticalSanity() {
        // Intense visual and audio effects
        this.glitchIntensity = 2;
        this.triggerGlitch();
        
        // Show developer popup
        this.showDeveloperMessage("Your sanity is critically low. The game is becoming unstable...");
        
        // Intense VHS effects
        if (this.vhsOverlay) {
            this.vhsOverlay.style.opacity = '0.8';
        }
    }
    
    triggerLowSanity() {
        this.glitchIntensity = 1;
        
        // Show developer popup
        this.showDeveloperMessage("Reality is beginning to blur. Are you sure you want to continue?");
    }
    
    triggerRecovery() {
        this.glitchIntensity = 0;
        
        // Show developer popup
        this.showDeveloperMessage("Your mind is clearing. The truth becomes more apparent.");
    }
    
    applySanityVisualEffects() {
        const body = document.body;
        
        // Remove existing sanity classes
        body.classList.remove('low-sanity', 'critical-sanity');
        
        // Apply new sanity classes
        if (this.sanityLevel < 30) {
            body.classList.add('critical-sanity');
        } else if (this.sanityLevel < 60) {
            body.classList.add('low-sanity');
        }
    }
    
    updateCursorStyle() {
        if (!this.customCursor) return;
        
        // Remove existing cursor classes
        this.customCursor.classList.remove('stabby', 'shaky');
        
        // Apply new cursor style based on sanity
        if (this.sanityLevel < 30) {
            this.customCursor.classList.add('stabby');
        } else if (this.sanityLevel < 60) {
            this.customCursor.classList.add('shaky');
        }
    }
    
    showDeveloperMessage(message) {
        const devPopup = document.getElementById('dev-popup');
        const devMessage = document.getElementById('dev-message');
        
        if (devPopup && devMessage) {
            devMessage.textContent = message;
            devPopup.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                devPopup.classList.add('hidden');
            }, 5000);
        }
    }
    
    // Public methods for external use
    setTime(hour) {
        this.currentTime = hour % 24;
        this.updateDayPhase();
        this.updateLighting();
    }
    
    getCurrentTime() {
        return this.currentTime;
    }
    
    getDayPhase() {
        return this.dayPhase;
    }
    
    isNightTime() {
        return this.isNightMode;
    }
    
    getSanityLevel() {
        return this.sanityLevel;
    }
    
    // Force trigger effects for testing
    forceGlitch() {
        this.triggerGlitch();
    }
    
    forceNightMode() {
        this.setTime(23); // Set to 11 PM
    }
    
    forceDayMode() {
        this.setTime(12); // Set to 12 PM
    }
}

// Initialize night mode system
let nightModeSystem;
document.addEventListener('DOMContentLoaded', () => {
    nightModeSystem = new NightModeSystem();
}); 