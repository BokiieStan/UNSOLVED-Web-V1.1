// Advanced Audio Engine with Layered Music and Whispering Effects
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.whisperGain = null;
        this.backgroundMusic = null;
        this.soundBuffers = {};
        this.musicLayers = {};
        this.whisperQueue = [];
        this.isPlaying = false;
        this.currentMood = 'neutral';
        this.whisperInterval = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioNodes();
            await this.preloadSounds();
            this.startWhisperSystem();
        } catch (e) {
            console.error('Audio initialization failed:', e);
        }
    }
    
    setupAudioNodes() {
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        this.musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.masterGain);
        this.musicGain.gain.value = 0.3;
        
        this.sfxGain = this.audioContext.createGain();
        this.sfxGain.connect(this.masterGain);
        this.sfxGain.gain.value = 0.5;
        
        this.whisperGain = this.audioContext.createGain();
        this.whisperGain.connect(this.masterGain);
        this.whisperGain.gain.value = 0.1;
        
        // Create filters for whispering effects
        this.whisperLowpass = this.audioContext.createBiquadFilter();
        this.whisperLowpass.type = 'lowpass';
        this.whisperLowpass.frequency.value = 800;
        this.whisperLowpass.connect(this.whisperGain);
    }
    
    async preloadSounds() {
        const soundFiles = [
            'background', 'case_start', 'success', 'error', 'evidence',
            'hallucination', 'victory', 'failure', 'achievement', 'nightmare',
            'whisper', 'glitch', 'rewind', 'fastforward'
        ];
        
        for (const sound of soundFiles) {
            try {
                const buffer = await this.loadSound("./sounds/" + sound + ".mp3");
                this.soundBuffers[sound] = buffer;
            } catch (e) {
                try {
                    const buffer = await this.loadSound("./sounds/" + sound + ".wav");
                    this.soundBuffers[sound] = buffer;
                } catch (e2) {
                    console.warn(`Could not load sound: ${sound}`);
                }
            }
        }
    }
    
    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }
    
    playSound(name, options = {}) {
        if (!this.soundBuffers[name] || !gameState.soundEnabled) return null;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.soundBuffers[name];
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume || 1.0;
        
        source.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        if (options.loop) {
            source.loop = true;
        }
        
        source.start();
        return source;
    }
    
    playLayeredMusic(mood) {
        this.currentMood = mood;
        this.stopBackgroundMusic();
        
        // Create layered music based on mood
        const layers = this.getMusicLayers(mood);
        
        layers.forEach((layer, index) => {
            if (this.soundBuffers[layer.sound]) {
                const source = this.audioContext.createBufferSource();
                source.buffer = this.soundBuffers[layer.sound];
                source.loop = true;
                
                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = layer.volume || 0.3;
                
                source.connect(gainNode);
                gainNode.connect(this.musicGain);
                
                source.start();
                this.musicLayers[index] = { source, gain: gainNode };
            }
        });
        
        this.isPlaying = true;
    }
    
    getMusicLayers(mood) {
        const layers = {
            'neutral': [
                { sound: 'background', volume: 0.3 }
            ],
            'tension': [
                { sound: 'background', volume: 0.2 },
                { sound: 'nightmare', volume: 0.1 }
            ],
            'danger': [
                { sound: 'background', volume: 0.1 },
                { sound: 'nightmare', volume: 0.3 }
            ],
            'victory': [
                { sound: 'victory', volume: 0.4 }
            ],
            'failure': [
                { sound: 'failure', volume: 0.4 }
            ]
        };
        
        return layers[mood] || layers['neutral'];
    }
    
    stopBackgroundMusic() {
        Object.values(this.musicLayers).forEach(layer => {
            if (layer.source) {
                layer.source.stop();
            }
        });
        this.musicLayers = {};
        this.isPlaying = false;
    }
    
    startWhisperSystem() {
        this.whisperInterval = setInterval(() => {
            if (gameState.SANITY < 60 && Math.random() < 0.3) {
                this.playWhisper();
            }
        }, 5000);
    }
    
    playWhisper() {
        const whispers = [
            "Victoria...",
            "Richard...",
            "James...",
            "Eleanor...",
            "Thomas...",
            "murder...",
            "blood...",
            "lies...",
            "truth...",
            "evidence...",
            "guilty...",
            "innocent...",
            "deception...",
            "betrayal...",
            "secrets...",
            "corruption...",
            "justice...",
            "vengeance...",
            "death...",
            "life..."
        ];
        
        const whisper = whispers[Math.floor(Math.random() * whispers.length)];
        this.speakWhisper(whisper);
    }
    
    speakWhisper(text) {
        if (!gameState.ttsEnabled) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        utterance.volume = 0.3;
        
        // Apply audio processing for whispering effect
        if (this.audioContext && this.audioContext.state === 'running') {
            const source = this.audioContext.createMediaStreamSource(
                new MediaStream([new MediaStreamTrack()])
            );
            source.connect(this.whisperLowpass);
        }
        
        window.speechSynthesis.speak(utterance);
        
        // Create visual whisper effect
        this.createWhisperVisual(text);
    }
    
    createWhisperVisual(text) {
        const whisperLayer = document.getElementById('whisper-layer');
        if (!whisperLayer) return;
        
        const whisperText = document.createElement('div');
        whisperText.className = 'whisper-text';
        whisperText.textContent = text;
        
        // Random position
        whisperText.style.left = Math.random() * 80 + 10 + '%';
        whisperText.style.top = Math.random() * 80 + 10 + '%';
        
        whisperLayer.appendChild(whisperText);
        
        // Remove after animation
        setTimeout(() => {
            if (whisperText.parentNode) {
                whisperText.parentNode.removeChild(whisperText);
            }
        }, 3000);
    }
    
    playRewindEffect() {
        this.playSound('rewind', { volume: 0.4 });
        
        // Create visual rewind effect
        const vhsOverlay = document.getElementById('vhs-overlay');
        if (vhsOverlay) {
            vhsOverlay.classList.add('active');
            setTimeout(() => {
                vhsOverlay.classList.remove('active');
            }, 1000);
        }
    }
    
    playFastForwardEffect() {
        this.playSound('fastforward', { volume: 0.4 });
        
        // Create visual fast-forward effect
        const vhsOverlay = document.getElementById('vhs-overlay');
        if (vhsOverlay) {
            vhsOverlay.classList.add('active');
            setTimeout(() => {
                vhsOverlay.classList.remove('active');
            }, 800);
        }
    }
    
    setMood(mood) {
        if (this.currentMood !== mood) {
            this.playLayeredMusic(mood);
        }
    }
    
    updateSanityEffects(sanity) {
        // Adjust whisper frequency based on sanity
        if (this.whisperInterval) {
            clearInterval(this.whisperInterval);
        }
        
        const interval = sanity < 30 ? 2000 : sanity < 60 ? 5000 : 10000;
        this.whisperInterval = setInterval(() => {
            if (sanity < 60 && Math.random() < (60 - sanity) / 60) {
                this.playWhisper();
            }
        }, interval);
        
        // Adjust music layers based on sanity
        Object.values(this.musicLayers).forEach(layer => {
            if (layer.gain) {
                const targetVolume = sanity < 30 ? 0.5 : sanity < 60 ? 0.3 : 0.2;
                layer.gain.gain.setTargetAtTime(targetVolume, this.audioContext.currentTime, 1.0);
            }
        });
    }
    
    destroy() {
        if (this.whisperInterval) {
            clearInterval(this.whisperInterval);
        }
        this.stopBackgroundMusic();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize audio engine
let audioEngine;
document.addEventListener('DOMContentLoaded', () => {
    audioEngine = new AudioEngine();
}); 