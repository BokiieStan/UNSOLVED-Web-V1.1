// Enhanced Main Script - UNSOLVED v2.0
// Integrates all new features: Night Mode, Smart Suspects, Enhanced Evidence, etc.

// Enhanced Game State
const gameState = {
    SANITY: 100,
    chosen: {},
    visitedTopics: new Set(),
    hallucinationTriggered: false,
    currentCase: null,
    cases: {
        'case1': { name: 'The Midnight Murder', difficulty: 'Medium' },
        'case2': { name: 'The Gallery Heist', difficulty: 'Hard' },
        'case3': { name: 'The Poisoned Professor', difficulty: 'Easy' }
    },
    collectedEvidence: [],
    achievements: new Set(),
    caseProgress: {},
    soundEnabled: true,
    ttsEnabled: true,
    lastSanityEffect: 0,
    currentSuspect: null,
    suspectMemory: {}, // Smart suspects remember conversations
    dialogueHistory: [], // Track all dialogue for meta references
    evidenceTypes: new Set(), // Track what types of evidence player has seen
    metaAwareness: 0 // Suspects become more meta-aware as game progresses
};

// Smart Suspect System
class SmartSuspect {
    constructor(name, data) {
        this.name = name;
        this.data = data;
        this.memory = new Map(); // Remember what player has said
        this.lies = new Set(); // Track lies told to this suspect
        this.metaLevel = 0; // How meta-aware this suspect is
        this.emotionalState = 'neutral'; // emotional, defensive, aggressive, etc.
        this.relationship = 0; // -100 to 100, affects responses
    }
    
    remember(question, response, isLie = false) {
        this.memory.set(question, {
            response: response,
            timestamp: Date.now(),
            isLie: isLie
        });
        
        if (isLie) {
            this.lies.add(question);
        }
    }
    
    getResponse(topic) {
        let response = this.data[topic] || "I don't know anything about that.";
        
        // Check if player lied about this topic before
        if (this.lies.has(topic)) {
            response = this.getLieResponse(topic);
        }
        
        // Check if this suspect is meta-aware
        if (this.metaLevel > 0) {
            response = this.addMetaComment(response);
        }
        
        // Adjust based on emotional state
        response = this.adjustForEmotion(response);
        
        return response;
    }
    
    getLieResponse(topic) {
        const lieResponses = {
            'Relationship': "You asked me about this before, but I think you were lying then too. What's your real question?",
            'Alibi': "You know, I told you my alibi already. Why do you keep asking? Are you trying to catch me in a lie?",
            'Argument': "We've been over this. Are you testing me or something? This feels like a game...",
            'Investment': "You seem very interested in the financial aspects. Almost like you're following a script...",
            'Discovery': "I already told you what I found. Why are you asking again? This is getting repetitive.",
            'Footprints': "The footprints again? You're really focused on the details. Almost too focused..."
        };
        
        return lieResponses[topic] || "I think you're lying to me. Why are you really here?";
    }
    
    addMetaComment(response) {
        const metaComments = [
            " You know, this feels very scripted...",
            " Are you following some kind of detective game script?",
            " This conversation feels... artificial somehow.",
            " I can't shake the feeling that this isn't real.",
            " Why do I feel like I'm in a game?",
            " This is getting weird. Are you actually a detective?",
            " I think I'm starting to understand what's happening here...",
            " You're not real, are you? None of this is real."
        ];
        
        if (Math.random() < this.metaLevel * 0.1) {
            response += metaComments[Math.floor(Math.random() * metaComments.length)];
        }
        
        return response;
    }
    
    adjustForEmotion(response) {
        switch (this.emotionalState) {
            case 'emotional':
                response += " *voice trembling*";
                break;
            case 'defensive':
                response += " *defensive tone*";
                break;
            case 'aggressive':
                response += " *raising voice*";
                break;
            case 'nervous':
                response += " *fidgeting*";
                break;
        }
        
        return response;
    }
    
    increaseMetaAwareness() {
        this.metaLevel = Math.min(this.metaLevel + 1, 10);
        
        if (this.metaLevel >= 5) {
            this.emotionalState = 'confused';
        }
        
        if (this.metaLevel >= 8) {
            this.emotionalState = 'panicked';
        }
    }
}

// Enhanced Evidence System
class EnhancedEvidence {
    constructor(name, description, type = 'normal') {
        this.name = name;
        this.description = description;
        this.type = type;
        this.isCollected = false;
        this.isDecoded = false;
        this.isReconstructed = false;
        this.redactedParts = [];
    }
    
    createDisplayElement() {
        const evidenceDiv = document.createElement('div');
        evidenceDiv.className = 'evidence-item';
        
        switch (this.type) {
            case 'encrypted':
                return this.createEncryptedDisplay(evidenceDiv);
            case 'scratched':
                return this.createScratchedDisplay(evidenceDiv);
            case 'dna':
                return this.createDNADisplay(evidenceDiv);
            default:
                return this.createNormalDisplay(evidenceDiv);
        }
    }
    
    createEncryptedDisplay(div) {
        const encryptedText = this.encryptText(this.description);
        div.innerHTML = `
            <h4>🔐 ${this.name}</h4>
            <div class="evidence-encrypted">
                <p>${encryptedText}</p>
                <button onclick="enhancedEvidence.decryptEvidence(this)" class="decrypt-btn">🔓 Decrypt</button>
            </div>
        `;
        return div;
    }
    
    createScratchedDisplay(div) {
        const pieces = this.createDocumentPieces(this.description);
        div.innerHTML = `
            <h4>🔍 ${this.name}</h4>
            <div class="evidence-scratched">
                <p>Reconstruct the document by dragging the pieces into the correct order:</p>
                <div class="document-pieces" data-correct-order="${pieces.correctOrder.join(',')}">
                    ${pieces.pieces.map((piece, index) => `
                        <div class="document-piece" draggable="true" data-index="${index}">
                            ${piece}
                        </div>
                    `).join('')}
                </div>
                <button onclick="enhancedEvidence.checkDocumentReconstruction(this)" class="check-btn">✓ Check Order</button>
            </div>
        `;
        this.setupDragAndDrop(div);
        return div;
    }
    
    createDNADisplay(div) {
        const dnaReport = this.generateDNAReport();
        div.innerHTML = `
            <h4>🧬 ${this.name}</h4>
            <div class="evidence-dna">
                ${dnaReport}
            </div>
        `;
        return div;
    }
    
    createNormalDisplay(div) {
        div.innerHTML = `
            <h4>📄 ${this.name}</h4>
            <p>${this.description}</p>
        `;
        return div;
    }
    
    encryptText(text) {
        // Simple substitution cipher
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const cipher = 'XKLMNOPQRSTUVWXYZABCDEFGHIJ';
        
        return text.toUpperCase().split('').map(char => {
            const index = alphabet.indexOf(char);
            return index >= 0 ? cipher[index] : char;
        }).join('');
    }
    
    createDocumentPieces(text) {
        const sentences = text.split('. ').filter(s => s.trim());
        const shuffled = [...sentences].sort(() => Math.random() - 0.5);
        const correctOrder = sentences.map(s => shuffled.indexOf(s));
        
        return {
            pieces: shuffled,
            correctOrder: correctOrder
        };
    }
    
    generateDNAReport() {
        return `
DNA ANALYSIS REPORT
Case: ${this.name}
Date: ${new Date().toLocaleDateString()}
Lab ID: DNA-${Math.floor(Math.random() * 10000)}

SAMPLE ANALYSIS:
- Sample Type: Blood stain
- Collection Date: [REDACTED]
- Analysis Method: PCR amplification

RESULTS:
- Victim DNA: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>
- Suspect 1: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>
- Suspect 2: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>
- Suspect 3: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>

MATCH PROBABILITY:
- Primary Match: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>
- Secondary Match: <span class="dna-redacted" onclick="this.classList.add('revealed')">[REDACTED]</span>

NOTES:
Click on [REDACTED] sections to reveal information based on your investigation progress.
        `;
    }
    
    setupDragAndDrop(container) {
        const pieces = container.querySelectorAll('.document-piece');
        const dropZone = container.querySelector('.document-pieces');
        
        pieces.forEach(piece => {
            piece.addEventListener('dragstart', (e) => {
                piece.classList.add('dragging');
                e.dataTransfer.setData('text/plain', piece.dataset.index);
            });
            
            piece.addEventListener('dragend', () => {
                piece.classList.remove('dragging');
            });
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData('text/plain');
            const draggedPiece = container.querySelector(`[data-index="${draggedIndex}"]`);
            
            if (draggedPiece) {
                dropZone.appendChild(draggedPiece);
            }
        });
    }
}

// Enhanced Suspect Interview System
class EnhancedInterview {
    constructor(suspect) {
        this.suspect = suspect;
        this.currentTopic = null;
        this.interviewHistory = [];
        this.lieDetected = false;
    }
    
    startInterview() {
        this.showInterviewModal();
        this.updateSuspectEmotion();
    }
    
    showInterviewModal() {
        const modalHTML = `
            <div id="enhanced-interview-modal" class="modal">
                <div class="modal-content wide">
                    <div class="interview-header">
                        <h2>Interview: ${this.suspect.name}</h2>
                        <div class="suspect-emotion">${this.getEmotionIcon()}</div>
                    </div>
                    <div class="interview-content">
                        <div class="topic-selection">
                            <h3>Select a topic to discuss:</h3>
                            <div class="topic-buttons" id="enhanced-topic-buttons"></div>
                        </div>
                        <div class="dialogue-area">
                            <div class="dialogue-history" id="dialogue-history"></div>
                            <div class="current-response" id="current-response"></div>
                        </div>
                    </div>
                    <div class="interview-actions">
                        <button onclick="enhancedInterview.endInterview()">End Interview</button>
                        <button onclick="enhancedInterview.accuseSuspect()">Accuse Suspect</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.populateTopics();
        this.showInterviewModal();
    }
    
    populateTopics() {
        const topicButtons = document.getElementById('enhanced-topic-buttons');
        const topics = Object.keys(this.suspect.data);
        
        topicButtons.innerHTML = '';
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.textContent = topic;
            button.onclick = () => this.discussTopic(topic);
            topicButtons.appendChild(button);
        });
    }
    
    discussTopic(topic) {
        this.currentTopic = topic;
        
        // Check if we've discussed this before
        const previousDiscussion = this.suspect.memory.get(topic);
        
        if (previousDiscussion) {
            this.handleRepeatQuestion(topic, previousDiscussion);
        } else {
            this.handleNewQuestion(topic);
        }
        
        // Update suspect's meta awareness
        this.suspect.increaseMetaAwareness();
        this.updateSuspectEmotion();
    }
    
    handleNewQuestion(topic) {
        const response = this.suspect.getResponse(topic);
        this.addToDialogueHistory(`You: "Tell me about ${topic}."`, response);
        
        // Check for lies (random chance based on suspect's emotional state)
        if (Math.random() < 0.3) {
            this.detectLie(topic);
        }
    }
    
    handleRepeatQuestion(topic, previousDiscussion) {
        let response;
        
        if (previousDiscussion.isLie) {
            response = this.suspect.getLieResponse(topic);
        } else {
            response = "I already told you about that. Why are you asking again?";
        }
        
        this.addToDialogueHistory(`You: "Let's go back to ${topic}."`, response);
    }
    
    detectLie(topic) {
        // Simulate lie detection
        if (Math.random() < 0.4) {
            this.lieDetected = true;
            this.addToDialogueHistory("", "⚠️ You notice some inconsistencies in their story...", 'warning');
        }
    }
    
    addToDialogueHistory(question, response, type = 'normal') {
        const history = document.getElementById('dialogue-history');
        const responseDiv = document.getElementById('current-response');
        
        if (question) {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'dialogue-question';
            questionDiv.textContent = question;
            history.appendChild(questionDiv);
        }
        
        const responseElement = document.createElement('div');
        responseElement.className = `dialogue-response ${type}`;
        responseElement.textContent = response;
        history.appendChild(responseElement);
        
        responseDiv.innerHTML = '';
        responseDiv.appendChild(responseElement.cloneNode(true));
        
        // Scroll to bottom
        history.scrollTop = history.scrollHeight;
        
        // Add to interview history
        this.interviewHistory.push({
            topic: this.currentTopic,
            question: question,
            response: response,
            timestamp: Date.now()
        });
    }
    
    getEmotionIcon() {
        const icons = {
            'neutral': '😐',
            'emotional': '😢',
            'defensive': '😤',
            'aggressive': '😠',
            'nervous': '😰',
            'confused': '😕',
            'panicked': '😱'
        };
        
        return icons[this.suspect.emotionalState] || '😐';
    }
    
    updateSuspectEmotion() {
        const emotionIcon = document.querySelector('.suspect-emotion');
        if (emotionIcon) {
            emotionIcon.textContent = this.getEmotionIcon();
        }
    }
    
    endInterview() {
        // Save interview data to suspect memory
        this.interviewHistory.forEach(entry => {
            this.suspect.remember(entry.topic, entry.response, this.lieDetected);
        });
        
        // Update game state
        gameState.suspectMemory[this.suspect.name] = this.suspect;
        
        // Hide modal
        this.hideInterviewModal();
        
        // Update UI
        this.updateInterviewButton();
    }
    
    accuseSuspect() {
        // Handle accusation logic
        this.endInterview();
        showAccuseModal();
    }
    
    hideInterviewModal() {
        const modal = document.getElementById('enhanced-interview-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    updateInterviewButton() {
        // Update the interview button to show completion
        const suspectButtons = document.querySelectorAll('.suspect-btn');
        suspectButtons.forEach(btn => {
            if (btn.textContent.includes(this.suspect.name)) {
                btn.classList.add('interviewed');
                btn.textContent += ' ✓';
            }
        });
    }
}

// Initialize enhanced systems
let enhancedEvidence;
let enhancedInterview;

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedGame();
    setupEnhancedEventListeners();
    
    // Check for load parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('load')) {
        loadGame();
    } else if (urlParams.has('case')) {
        // Load specific mod case
        const caseId = urlParams.get('case');
        startModCase(caseId);
    } else {
        showCaseSelection();
    }
});

function initEnhancedGame() {
    // Initialize case progress
    Object.keys(gameState.cases).forEach(caseId => {
        gameState.caseProgress[caseId] = {
            solved: false,
            tagsCompleted: 0,
            totalTags: 0,
            evidenceCollected: 0,
            suspectsInterviewed: new Set()
        };
    });
    
    // Initialize enhanced evidence system
    enhancedEvidence = new EnhancedEvidence();
    
    // Start enhanced systems
    if (nightModeSystem) {
        nightModeSystem.setTime(12); // Start at noon
    }
    
    if (audioEngine) {
        audioEngine.setMood('neutral');
    }
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
}

function setupEnhancedEventListeners() {
    // Enhanced menu buttons
    const startButton = document.getElementById('start-button');
    const loadButton = document.getElementById('load-button');
    const createCaseBtn = document.getElementById('create-case-btn');
    const modsBtn = document.getElementById('mods-btn');
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    }
    
    if (loadButton) {
        loadButton.addEventListener('click', () => {
            window.location.href = 'game.html?load=true';
        });
    }
    
    if (createCaseBtn) {
        createCaseBtn.addEventListener('click', () => {
            if (moddingTools) {
                moddingTools.showModManager();
                moddingTools.createNewCase();
            }
        });
    }
    
    if (modsBtn) {
        modsBtn.addEventListener('click', () => {
            if (moddingTools) {
                moddingTools.showModManager();
            }
        });
    }
    
    // Developer popup close
    const devClose = document.querySelector('.dev-close');
    if (devClose) {
        devClose.addEventListener('click', () => {
            const devPopup = document.getElementById('dev-popup');
            if (devPopup) {
                devPopup.classList.add('hidden');
            }
        });
    }
    
    // Terminal close
    const terminalClose = document.querySelector('.terminal-close');
    if (terminalClose) {
        terminalClose.addEventListener('click', () => {
            if (terminalSystem) {
                terminalSystem.hideTerminal();
            }
        });
    }
}

function showCaseSelection() {
    // Show case selection with mod cases
    const caseSelection = document.getElementById('case-selection');
    if (caseSelection) {
        caseSelection.classList.add('active');
    }
    
    // Populate case grid with both original and mod cases
    populateCaseGrid();
}

function populateCaseGrid() {
    const caseGrid = document.getElementById('case-grid');
    if (!caseGrid) return;
    
    caseGrid.innerHTML = '';
    
    // Add original cases
    Object.entries(gameState.cases).forEach(([caseId, caseInfo]) => {
        const caseBtn = document.createElement('button');
        caseBtn.className = 'case-btn';
        caseBtn.innerHTML = `${caseInfo.name}<br>(${caseInfo.difficulty})`;
        caseBtn.addEventListener('click', () => startCase(caseId));
        caseGrid.appendChild(caseBtn);
    });
    
    // Add mod cases
    if (moddingTools) {
        const modCases = moddingTools.getModCases();
        modCases.forEach(modCase => {
            const caseBtn = document.createElement('button');
            caseBtn.className = 'case-btn mod-case';
            caseBtn.innerHTML = `${modCase.name}<br>(${modCase.difficulty})<br><small>MOD</small>`;
            caseBtn.addEventListener('click', () => startModCase(modCase.id));
            caseGrid.appendChild(caseBtn);
        });
    }
}

function startModCase(caseId) {
    const modCase = moddingTools ? moddingTools.getModCase(caseId) : null;
    if (!modCase) {
        alert('Mod case not found!');
        return;
    }
    
    // Set up mod case
    gameState.currentCase = caseId;
    gameState.cases[caseId] = {
        name: modCase.name,
        difficulty: modCase.difficulty
    };
    
    // Load mod case data
    loadModCaseData(modCase);
    
    // Start the case
    startCase(caseId);
}

function loadModCaseData(modCase) {
    // Convert mod case data to game format
    // This would need to be implemented based on the mod case structure
    console.log('Loading mod case:', modCase);
}

// Enhanced functions that integrate with new systems
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    
    if (nightModeSystem) {
        const currentTime = nightModeSystem.getCurrentTime();
        const hours = Math.floor(currentTime);
        const minutes = Math.floor((currentTime % 1) * 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        clockElement.textContent = `🕒 ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } else {
        const now = new Date();
        clockElement.textContent = `🕒 ${now.toLocaleTimeString()}`;
    }
}

function updateSanityDisplay() {
    const sanityElement = document.getElementById('sanity');
    if (sanityElement) {
        sanityElement.textContent = `🧠 SANITY: ${gameState.SANITY}%`;
    }
}

function applySanityEffects() {
    // Update night mode system
    if (nightModeSystem) {
        nightModeSystem.updateSanityEffects();
    }
    
    // Update audio effects
    if (audioEngine) {
        audioEngine.updateSanityEffects(gameState.SANITY);
    }
    
    // Update UI
    updateSanityDisplay();
}

// Export functions for global access
window.enhancedEvidence = enhancedEvidence;
window.enhancedInterview = enhancedInterview;
window.startModCase = startModCase; 