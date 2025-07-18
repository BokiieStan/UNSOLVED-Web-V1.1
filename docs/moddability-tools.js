// Modding Tools and Case Creation System
class ModdingTools {
    constructor() {
        this.modCases = [];
        this.customEvidence = [];
        this.customSuspects = [];
        this.caseWizard = null;
        this.modManager = null;
        
        this.init();
    }
    
    init() {
        this.loadModCases();
        this.setupModManager();
    }
    
    loadModCases() {
        // Load mod cases from localStorage
        const modCasesData = localStorage.getItem('unsolved_mod_cases');
        if (modCasesData) {
            try {
                this.modCases = JSON.parse(modCasesData);
            } catch (e) {
                console.error('Failed to load mod cases:', e);
                this.modCases = [];
            }
        }
    }
    
    setupModManager() {
        // Create mod manager UI
        this.createModManager();
    }
    
    createModManager() {
        const modManagerHTML = `
            <div id="mod-manager" class="mod-manager hidden">
                <div class="mod-manager-content">
                    <div class="mod-manager-header">
                        <h2>🎭 Mod Manager</h2>
                        <button class="mod-close" onclick="moddingTools.hideModManager()">×</button>
                    </div>
                    <div class="mod-manager-tabs">
                        <button class="mod-tab active" data-tab="cases">📁 Cases</button>
                        <button class="mod-tab" data-tab="wizard">🔧 Create Case</button>
                        <button class="mod-tab" data-tab="import">📥 Import</button>
                        <button class="mod-tab" data-tab="export">📤 Export</button>
                    </div>
                    <div class="mod-tab-content active" id="cases-tab">
                        <div class="mod-cases-list" id="mod-cases-list"></div>
                        <button class="mod-btn" onclick="moddingTools.createNewCase()">➕ Create New Case</button>
                    </div>
                    <div class="mod-tab-content" id="wizard-tab">
                        <div class="case-wizard" id="case-wizard"></div>
                    </div>
                    <div class="mod-tab-content" id="import-tab">
                        <div class="import-section">
                            <h3>Import Case JSON</h3>
                            <textarea id="import-json" placeholder="Paste your case JSON here..."></textarea>
                            <button class="mod-btn" onclick="moddingTools.importCase()">Import Case</button>
                        </div>
                        <div class="import-section">
                            <h3>Import from File</h3>
                            <input type="file" id="import-file" accept=".json" onchange="moddingTools.handleFileImport(event)">
                            <p>Select a JSON file containing case data</p>
                        </div>
                    </div>
                    <div class="mod-tab-content" id="export-tab">
                        <div class="export-section">
                            <h3>Export Current Case</h3>
                            <button class="mod-btn" onclick="moddingTools.exportCurrentCase()">Export to JSON</button>
                        </div>
                        <div class="export-section">
                            <h3>Export All Cases</h3>
                            <button class="mod-btn" onclick="moddingTools.exportAllCases()">Export All</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modManagerHTML);
        this.modManager = document.getElementById('mod-manager');
        
        this.setupModManagerEvents();
        this.updateModCasesList();
    }
    
    setupModManagerEvents() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mod-tab')) {
                this.switchModTab(e.target.dataset.tab);
            }
        });
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleModManager();
            }
        });
    }
    
    switchModTab(tabName) {
        // Update active tab
        document.querySelectorAll('.mod-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active content
        document.querySelectorAll('.mod-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load specific content
        if (tabName === 'wizard') {
            this.loadCaseWizard();
        }
    }
    
    toggleModManager() {
        if (this.modManager) {
            this.modManager.classList.toggle('hidden');
        }
    }
    
    showModManager() {
        if (this.modManager) {
            this.modManager.classList.remove('hidden');
        }
    }
    
    hideModManager() {
        if (this.modManager) {
            this.modManager.classList.add('hidden');
        }
    }
    
    updateModCasesList() {
        const casesList = document.getElementById('mod-cases-list');
        if (!casesList) return;
        
        casesList.innerHTML = '';
        
        this.modCases.forEach((modCase, index) => {
            const caseElement = document.createElement('div');
            caseElement.className = 'mod-case-item';
            caseElement.innerHTML = `
                <div class="mod-case-info">
                    <h4>${modCase.name}</h4>
                    <p>Difficulty: ${modCase.difficulty}</p>
                    <p>Evidence: ${modCase.evidence.length} items</p>
                    <p>Suspects: ${modCase.suspects.length} people</p>
                </div>
                <div class="mod-case-actions">
                    <button onclick="moddingTools.playModCase(${index})">▶️ Play</button>
                    <button onclick="moddingTools.editModCase(${index})">✏️ Edit</button>
                    <button onclick="moddingTools.deleteModCase(${index})">🗑️ Delete</button>
                </div>
            `;
            casesList.appendChild(caseElement);
        });
    }
    
    loadCaseWizard() {
        const wizardContainer = document.getElementById('case-wizard');
        if (!wizardContainer) return;
        
        wizardContainer.innerHTML = `
            <div class="wizard-step active" data-step="1">
                <h3>Step 1: Basic Information</h3>
                <div class="wizard-form">
                    <label>Case Name:</label>
                    <input type="text" id="wizard-name" placeholder="Enter case name">
                    
                    <label>Difficulty:</label>
                    <select id="wizard-difficulty">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    
                    <label>Description:</label>
                    <textarea id="wizard-description" placeholder="Brief description of the case"></textarea>
                </div>
                <button class="wizard-btn" onclick="moddingTools.nextWizardStep()">Next</button>
            </div>
            
            <div class="wizard-step" data-step="2">
                <h3>Step 2: Evidence</h3>
                <div class="evidence-builder" id="evidence-builder">
                    <div class="evidence-item-template">
                        <input type="text" placeholder="Evidence name" class="evidence-name">
                        <textarea placeholder="Evidence description" class="evidence-description"></textarea>
                        <select class="evidence-type">
                            <option value="normal">Normal</option>
                            <option value="encrypted">Encrypted</option>
                            <option value="scratched">Scratched</option>
                            <option value="dna">DNA Report</option>
                        </select>
                        <button onclick="moddingTools.removeEvidenceItem(this)">Remove</button>
                    </div>
                </div>
                <button class="wizard-btn" onclick="moddingTools.addEvidenceItem()">Add Evidence</button>
                <button class="wizard-btn" onclick="moddingTools.prevWizardStep()">Previous</button>
                <button class="wizard-btn" onclick="moddingTools.nextWizardStep()">Next</button>
            </div>
            
            <div class="wizard-step" data-step="3">
                <h3>Step 3: Suspects</h3>
                <div class="suspects-builder" id="suspects-builder">
                    <div class="suspect-item-template">
                        <input type="text" placeholder="Suspect name" class="suspect-name">
                        <div class="suspect-topics">
                            <input type="text" placeholder="Topic 1" class="suspect-topic">
                            <input type="text" placeholder="Response 1" class="suspect-response">
                            <input type="text" placeholder="Topic 2" class="suspect-topic">
                            <input type="text" placeholder="Response 2" class="suspect-response">
                            <input type="text" placeholder="Topic 3" class="suspect-topic">
                            <input type="text" placeholder="Response 3" class="suspect-response">
                        </div>
                        <button onclick="moddingTools.removeSuspectItem(this)">Remove</button>
                    </div>
                </div>
                <button class="wizard-btn" onclick="moddingTools.addSuspectItem()">Add Suspect</button>
                <button class="wizard-btn" onclick="moddingTools.prevWizardStep()">Previous</button>
                <button class="wizard-btn" onclick="moddingTools.nextWizardStep()">Next</button>
            </div>
            
            <div class="wizard-step" data-step="4">
                <h3>Step 4: Solution</h3>
                <div class="solution-builder">
                    <label>Correct Suspect:</label>
                    <select id="wizard-correct-suspect"></select>
                    
                    <label>Solution Explanation:</label>
                    <textarea id="wizard-solution" placeholder="Explain why this suspect is guilty"></textarea>
                </div>
                <button class="wizard-btn" onclick="moddingTools.prevWizardStep()">Previous</button>
                <button class="wizard-btn" onclick="moddingTools.finishWizard()">Create Case</button>
            </div>
        `;
    }
    
    nextWizardStep() {
        const currentStep = document.querySelector('.wizard-step.active');
        const currentStepNum = parseInt(currentStep.dataset.step);
        const nextStep = document.querySelector(`[data-step="${currentStepNum + 1}"]`);
        
        if (nextStep) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            
            // Update suspect list in step 4
            if (currentStepNum + 1 === 4) {
                this.updateSuspectList();
            }
        }
    }
    
    prevWizardStep() {
        const currentStep = document.querySelector('.wizard-step.active');
        const currentStepNum = parseInt(currentStep.dataset.step);
        const prevStep = document.querySelector(`[data-step="${currentStepNum - 1}"]`);
        
        if (prevStep) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
        }
    }
    
    updateSuspectList() {
        const suspectSelect = document.getElementById('wizard-correct-suspect');
        if (!suspectSelect) return;
        
        suspectSelect.innerHTML = '';
        const suspectNames = Array.from(document.querySelectorAll('.suspect-name')).map(input => input.value).filter(name => name.trim());
        
        suspectNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            suspectSelect.appendChild(option);
        });
    }
    
    addEvidenceItem() {
        const builder = document.getElementById('evidence-builder');
        const template = builder.querySelector('.evidence-item-template');
        const newItem = template.cloneNode(true);
        
        // Clear the new item
        newItem.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
        
        builder.appendChild(newItem);
    }
    
    removeEvidenceItem(button) {
        const item = button.closest('.evidence-item-template');
        if (item.parentNode.children.length > 1) {
            item.remove();
        }
    }
    
    addSuspectItem() {
        const builder = document.getElementById('suspects-builder');
        const template = builder.querySelector('.suspect-item-template');
        const newItem = template.cloneNode(true);
        
        // Clear the new item
        newItem.querySelectorAll('input').forEach(el => el.value = '');
        
        builder.appendChild(newItem);
    }
    
    removeSuspectItem(button) {
        const item = button.closest('.suspect-item-template');
        if (item.parentNode.children.length > 1) {
            item.remove();
        }
    }
    
    finishWizard() {
        // Collect all data from wizard
        const caseData = this.collectWizardData();
        
        if (this.validateCaseData(caseData)) {
            this.modCases.push(caseData);
            this.saveModCases();
            this.updateModCasesList();
            
            // Reset wizard
            this.switchModTab('cases');
            
            // Show success message
            if (nightModeSystem) {
                nightModeSystem.showDeveloperMessage("Case created successfully! You can now play it.");
            }
        } else {
            alert('Please fill in all required fields.');
        }
    }
    
    collectWizardData() {
        const evidence = [];
        const suspects = {};
        
        // Collect evidence
        document.querySelectorAll('.evidence-item-template').forEach(item => {
            const name = item.querySelector('.evidence-name').value;
            const description = item.querySelector('.evidence-description').value;
            const type = item.querySelector('.evidence-type').value;
            
            if (name && description) {
                evidence.push({ name, description, type });
            }
        });
        
        // Collect suspects
        document.querySelectorAll('.suspect-item-template').forEach(item => {
            const name = item.querySelector('.suspect-name').value;
            const topics = {};
            
            const topicInputs = item.querySelectorAll('.suspect-topic');
            const responseInputs = item.querySelectorAll('.suspect-response');
            
            for (let i = 0; i < topicInputs.length; i++) {
                const topic = topicInputs[i].value;
                const response = responseInputs[i].value;
                
                if (topic && response) {
                    topics[topic] = response;
                }
            }
            
            if (name && Object.keys(topics).length > 0) {
                suspects[name] = topics;
            }
        });
        
        return {
            name: document.getElementById('wizard-name').value,
            difficulty: document.getElementById('wizard-difficulty').value,
            description: document.getElementById('wizard-description').value,
            evidence: evidence,
            suspects: suspects,
            correctSuspect: document.getElementById('wizard-correct-suspect').value,
            solution: document.getElementById('wizard-solution').value,
            id: 'mod_' + Date.now()
        };
    }
    
    validateCaseData(caseData) {
        return caseData.name && 
               caseData.description && 
               caseData.evidence.length > 0 && 
               Object.keys(caseData.suspects).length > 0 &&
               caseData.correctSuspect &&
               caseData.solution;
    }
    
    saveModCases() {
        localStorage.setItem('unsolved_mod_cases', JSON.stringify(this.modCases));
    }
    
    playModCase(index) {
        const modCase = this.modCases[index];
        if (!modCase) return;
        
        // Set up the mod case for playing
        gameState.currentCase = modCase.id;
        gameState.cases[modCase.id] = {
            name: modCase.name,
            difficulty: modCase.difficulty
        };
        
        // Hide mod manager and start the case
        this.hideModManager();
        
        // Navigate to game
        if (window.location.pathname.includes('index.html')) {
            window.location.href = './docs/game.html?case=' + modCase.id;
        } else {
            // If already in game, restart with mod case
            location.reload();
        }
    }
    
    editModCase(index) {
        const modCase = this.modCases[index];
        if (!modCase) return;
        
        // Load case data into wizard
        this.loadCaseIntoWizard(modCase);
        this.switchModTab('wizard');
    }
    
    loadCaseIntoWizard(modCase) {
        // Populate wizard with existing case data
        document.getElementById('wizard-name').value = modCase.name;
        document.getElementById('wizard-difficulty').value = modCase.difficulty;
        document.getElementById('wizard-description').value = modCase.description;
        document.getElementById('wizard-solution').value = modCase.solution;
        
        // Load evidence
        const evidenceBuilder = document.getElementById('evidence-builder');
        evidenceBuilder.innerHTML = '';
        
        modCase.evidence.forEach(evidence => {
            const item = document.createElement('div');
            item.className = 'evidence-item-template';
            item.innerHTML = `
                <input type="text" placeholder="Evidence name" class="evidence-name" value="${evidence.name}">
                <textarea placeholder="Evidence description" class="evidence-description">${evidence.description}</textarea>
                <select class="evidence-type">
                    <option value="normal" ${evidence.type === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="encrypted" ${evidence.type === 'encrypted' ? 'selected' : ''}>Encrypted</option>
                    <option value="scratched" ${evidence.type === 'scratched' ? 'selected' : ''}>Scratched</option>
                    <option value="dna" ${evidence.type === 'dna' ? 'selected' : ''}>DNA Report</option>
                </select>
                <button onclick="moddingTools.removeEvidenceItem(this)">Remove</button>
            `;
            evidenceBuilder.appendChild(item);
        });
        
        // Load suspects
        const suspectsBuilder = document.getElementById('suspects-builder');
        suspectsBuilder.innerHTML = '';
        
        Object.entries(modCase.suspects).forEach(([name, topics]) => {
            const item = document.createElement('div');
            item.className = 'suspect-item-template';
            
            const topicInputs = Object.entries(topics).map(([topic, response], index) => `
                <input type="text" placeholder="Topic ${index + 1}" class="suspect-topic" value="${topic}">
                <input type="text" placeholder="Response ${index + 1}" class="suspect-response" value="${response}">
            `).join('');
            
            item.innerHTML = `
                <input type="text" placeholder="Suspect name" class="suspect-name" value="${name}">
                <div class="suspect-topics">
                    ${topicInputs}
                </div>
                <button onclick="moddingTools.removeSuspectItem(this)">Remove</button>
            `;
            suspectsBuilder.appendChild(item);
        });
    }
    
    deleteModCase(index) {
        if (confirm('Are you sure you want to delete this case?')) {
            this.modCases.splice(index, 1);
            this.saveModCases();
            this.updateModCasesList();
        }
    }
    
    importCase() {
        const jsonText = document.getElementById('import-json').value;
        if (!jsonText.trim()) {
            alert('Please paste JSON data first.');
            return;
        }
        
        try {
            const caseData = JSON.parse(jsonText);
            if (this.validateCaseData(caseData)) {
                caseData.id = 'mod_' + Date.now();
                this.modCases.push(caseData);
                this.saveModCases();
                this.updateModCasesList();
                
                document.getElementById('import-json').value = '';
                alert('Case imported successfully!');
            } else {
                alert('Invalid case data. Please check the JSON format.');
            }
        } catch (e) {
            alert('Invalid JSON format. Please check your data.');
        }
    }
    
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const caseData = JSON.parse(e.target.result);
                if (this.validateCaseData(caseData)) {
                    caseData.id = 'mod_' + Date.now();
                    this.modCases.push(caseData);
                    this.saveModCases();
                    this.updateModCasesList();
                    alert('Case imported successfully!');
                } else {
                    alert('Invalid case data in file.');
                }
            } catch (e) {
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    }
    
    exportCurrentCase() {
        if (!gameState.currentCase) {
            alert('No case is currently loaded.');
            return;
        }
        
        // Find current case data
        const caseData = this.getCurrentCaseData();
        if (caseData) {
            this.downloadJSON(caseData, `${caseData.name.replace(/\s+/g, '_')}_case.json`);
        }
    }
    
    exportAllCases() {
        const allCases = {
            version: '2.0',
            timestamp: Date.now(),
            cases: this.modCases
        };
        
        this.downloadJSON(allCases, 'all_mod_cases.json');
    }
    
    getCurrentCaseData() {
        // This would need to be implemented based on how the current case is structured
        // For now, return a basic structure
        return {
            name: gameState.cases[gameState.currentCase]?.name || 'Unknown Case',
            difficulty: gameState.cases[gameState.currentCase]?.difficulty || 'Medium',
            evidence: gameState.collectedEvidence,
            // Add more fields as needed
        };
    }
    
    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Public methods
    getModCases() {
        return this.modCases;
    }
    
    getModCase(id) {
        return this.modCases.find(case_ => case_.id === id);
    }
    
    createNewCase() {
        this.switchModTab('wizard');
        this.loadCaseWizard();
    }
}

// Initialize modding tools
let moddingTools;
document.addEventListener('DOMContentLoaded', () => {
    moddingTools = new ModdingTools();
}); 