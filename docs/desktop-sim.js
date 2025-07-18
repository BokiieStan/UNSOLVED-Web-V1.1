// Desktop Simulation System
class DesktopSimulation {
    constructor() {
        this.browserWindow = null;
        this.emailWindow = null;
        this.currentBrowserUrl = '';
        this.emailThreads = {};
        this.currentDay = 1;
        this.evidenceTypes = {
            'encrypted': this.handleEncryptedEvidence,
            'scratched': this.handleScratchedEvidence,
            'dna': this.handleDNAEvidence
        };
        
        this.init();
    }
    
    init() {
        this.createBrowserWindow();
        this.createEmailWindow();
        this.setupEventListeners();
        this.initializeEmailThreads();
    }
    
    createBrowserWindow() {
        const browserHTML = `
            <div id="browser-window" class="browser-window">
                <div class="browser-header">
                    <div class="browser-controls">
                        <button class="browser-btn close" onclick="desktopSim.closeBrowser()">×</button>
                        <button class="browser-btn minimize">−</button>
                        <button class="browser-btn maximize">□</button>
                    </div>
                    <input type="text" class="browser-url" value="https://darkweb.case-files.local" readonly>
                </div>
                <div class="browser-content" id="browser-content">
                    <div class="terminal-style">
                        <span class="prompt">></span> <span class="command">connect darkweb.case-files.local</span><br>
                        <span class="output">Connecting to secure server...</span><br>
                        <span class="output">Access granted. Welcome, Detective.</span><br><br>
                        <span class="prompt">></span> <span class="command">ls cases/</span><br>
                        <span class="output">case001_midnight_murder/</span><br>
                        <span class="output">case002_gallery_heist/</span><br>
                        <span class="output">case003_poisoned_professor/</span><br><br>
                        <span class="prompt">></span> <span class="command">cat case001_midnight_murder/evidence.txt</span><br>
                        <span class="output">Loading case evidence...</span><br>
                        <span class="output">[REDACTED] - Victim found in study</span><br>
                        <span class="output">[REDACTED] - Time of death: 11:30 PM</span><br>
                        <span class="output">[REDACTED] - Cause: Gunshot wound</span><br>
                        <span class="output">[REDACTED] - Weapon: Derringer pistol</span><br><br>
                        <span class="prompt">></span> <span class="command">_</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', browserHTML);
        this.browserWindow = document.getElementById('browser-window');
    }
    
    createEmailWindow() {
        const emailHTML = `
            <div id="email-window" class="email-window">
                <div class="email-header">
                    <span class="email-title">Case Communications</span>
                    <button class="email-close" onclick="desktopSim.closeEmail()">×</button>
                </div>
                <div class="email-content">
                    <div class="email-sidebar" id="email-sidebar">
                        <div class="email-folder active" data-folder="inbox">📥 Inbox</div>
                        <div class="email-folder" data-folder="sent">📤 Sent</div>
                        <div class="email-folder" data-folder="drafts">📝 Drafts</div>
                        <div class="email-folder" data-folder="trash">🗑️ Trash</div>
                    </div>
                    <div class="email-main">
                        <div class="email-list" id="email-list"></div>
                        <div class="email-view" id="email-view">
                            <div class="email-view-header">
                                <div class="email-view-subject">Select an email to view</div>
                                <div class="email-view-meta"></div>
                            </div>
                            <div class="email-view-body">
                                Choose an email from the list to read its contents.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', emailHTML);
        this.emailWindow = document.getElementById('email-window');
    }
    
    setupEventListeners() {
        // Browser events
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.toggleBrowser();
            }
        });
        
        // Email events
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.toggleEmail();
            }
        });
        
        // Email folder switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('email-folder')) {
                this.switchEmailFolder(e.target.dataset.folder);
            }
        });
        
        // Email item selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.email-item')) {
                const emailId = e.target.closest('.email-item').dataset.emailId;
                this.showEmail(emailId);
            }
        });
    }
    
    initializeEmailThreads() {
        this.emailThreads = {
            inbox: [
                {
                    id: 'email1',
                    sender: 'Chief Detective',
                    subject: 'Case Assignment - Midnight Murder',
                    preview: 'New case has been assigned to you. Victim: Richard Hawthorne...',
                    body: `Detective,

A new case has been assigned to you. The victim is Richard Hawthorne, found dead in his study at 11:30 PM.

Key details:
- Victim: Richard Hawthorne, 45, businessman
- Location: Hawthorne Manor, study
- Time: 11:30 PM
- Cause: Gunshot wound to the head
- Weapon: Derringer pistol (registered to Victoria's father)

Please begin your investigation immediately. All case files are available in the evidence locker.

Good luck,
Chief Detective`,
                    timestamp: 'Day 1, 9:00 AM',
                    unread: true
                },
                {
                    id: 'email2',
                    sender: 'Forensics Lab',
                    subject: 'Preliminary Report - Evidence Analysis',
                    preview: 'Initial analysis of collected evidence is complete...',
                    body: `Detective,

Preliminary analysis of collected evidence:

1. Whiskey Glass - Lipstick residue matches Victoria's shade
2. Financial Documents - Richard had $500,000+ in gambling debts
3. Torn Letter - Partial love letter to Richard, signed 'E'
4. Derringer - Registered to Victoria's father, found under desk

DNA analysis pending. Will update when results are available.

Forensics Team`,
                    timestamp: 'Day 1, 2:30 PM',
                    unread: false
                }
            ],
            sent: [],
            drafts: [],
            trash: []
        };
        
        this.updateEmailList('inbox');
    }
    
    toggleBrowser() {
        if (this.browserWindow) {
            this.browserWindow.classList.toggle('active');
        }
    }
    
    closeBrowser() {
        if (this.browserWindow) {
            this.browserWindow.classList.remove('active');
        }
    }
    
    toggleEmail() {
        if (this.emailWindow) {
            this.emailWindow.classList.toggle('active');
        }
    }
    
    closeEmail() {
        if (this.emailWindow) {
            this.emailWindow.classList.remove('active');
        }
    }
    
    switchEmailFolder(folder) {
        // Update active folder
        document.querySelectorAll('.email-folder').forEach(f => f.classList.remove('active'));
        document.querySelector(`[data-folder="${folder}"]`).classList.add('active');
        
        this.updateEmailList(folder);
    }
    
    updateEmailList(folder) {
        const emailList = document.getElementById('email-list');
        if (!emailList) return;
        
        emailList.innerHTML = '';
        
        const emails = this.emailThreads[folder] || [];
        
        emails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = `email-item ${email.unread ? 'unread' : ''}`;
            emailItem.dataset.emailId = email.id;
            
            emailItem.innerHTML = `
                <div class="email-sender">${email.sender}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            `;
            
            emailList.appendChild(emailItem);
        });
    }
    
    showEmail(emailId) {
        const emailView = document.getElementById('email-view');
        if (!emailView) return;
        
        // Find email in all folders
        let email = null;
        for (const folder of Object.values(this.emailThreads)) {
            email = folder.find(e => e.id === emailId);
            if (email) break;
        }
        
        if (!email) return;
        
        // Mark as read
        email.unread = false;
        
        emailView.innerHTML = `
            <div class="email-view-header">
                <div class="email-view-subject">${email.subject}</div>
                <div class="email-view-meta">From: ${email.sender} | ${email.timestamp}</div>
            </div>
            <div class="email-view-body">${email.body.replace(/\n/g, '<br>')}</div>
        `;
        
        // Update email list to reflect read status
        const activeFolder = document.querySelector('.email-folder.active').dataset.folder;
        this.updateEmailList(activeFolder);
    }
    
    addEmail(folder, email) {
        if (!this.emailThreads[folder]) {
            this.emailThreads[folder] = [];
        }
        
        this.emailThreads[folder].unshift(email);
        
        // Update list if this folder is currently active
        const activeFolder = document.querySelector('.email-folder.active');
        if (activeFolder && activeFolder.dataset.folder === folder) {
            this.updateEmailList(folder);
        }
    }
    
    // Enhanced Evidence Types
    handleEncryptedEvidence(evidence) {
        const encryptedDiv = document.createElement('div');
        encryptedDiv.className = 'evidence-encrypted';
        
        const encryptedText = this.encryptText(evidence.description);
        
        encryptedDiv.innerHTML = `
            <h4>🔐 ${evidence.name}</h4>
            <div class="encrypted-content">
                <p>${encryptedText}</p>
                <button onclick="desktopSim.decryptEvidence(this)" class="decrypt-btn">🔓 Decrypt</button>
            </div>
        `;
        
        return encryptedDiv;
    }
    
    handleScratchedEvidence(evidence) {
        const scratchedDiv = document.createElement('div');
        scratchedDiv.className = 'evidence-scratched';
        
        const pieces = this.createDocumentPieces(evidence.description);
        
        scratchedDiv.innerHTML = `
            <h4>🔍 ${evidence.name}</h4>
            <p>Reconstruct the document by dragging the pieces into the correct order:</p>
            <div class="document-pieces" data-correct-order="${pieces.correctOrder.join(',')}">
                ${pieces.pieces.map((piece, index) => `
                    <div class="document-piece" draggable="true" data-index="${index}">
                        ${piece}
                    </div>
                `).join('')}
            </div>
            <button onclick="desktopSim.checkDocumentReconstruction(this)" class="check-btn">✓ Check Order</button>
        `;
        
        this.setupDragAndDrop(scratchedDiv);
        return scratchedDiv;
    }
    
    handleDNAEvidence(evidence) {
        const dnaDiv = document.createElement('div');
        dnaDiv.className = 'evidence-dna';
        
        const dnaReport = this.generateDNAReport(evidence);
        
        dnaDiv.innerHTML = `
            <h4>🧬 ${evidence.name}</h4>
            <div class="dna-report">
                ${dnaReport}
            </div>
        `;
        
        return dnaDiv;
    }
    
    encryptText(text) {
        // Simple substitution cipher for demonstration
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const cipher = 'XKLMNOPQRSTUVWXYZABCDEFGHIJ';
        
        return text.toUpperCase().split('').map(char => {
            const index = alphabet.indexOf(char);
            return index >= 0 ? cipher[index] : char;
        }).join('');
    }
    
    decryptEvidence(button) {
        const encryptedDiv = button.closest('.evidence-encrypted');
        const encryptedText = encryptedDiv.querySelector('p').textContent;
        
        // Simple decryption (reverse of encryption)
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const cipher = 'XKLMNOPQRSTUVWXYZABCDEFGHIJ';
        
        const decryptedText = encryptedText.split('').map(char => {
            const index = cipher.indexOf(char);
            return index >= 0 ? alphabet[index] : char;
        }).join('');
        
        encryptedDiv.querySelector('p').textContent = decryptedText;
        button.textContent = '✅ Decrypted';
        button.disabled = true;
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
    
    checkDocumentReconstruction(button) {
        const container = button.closest('.evidence-scratched');
        const dropZone = container.querySelector('.document-pieces');
        const correctOrder = dropZone.dataset.correctOrder.split(',').map(Number);
        
        const currentOrder = Array.from(dropZone.children).map(piece => 
            parseInt(piece.dataset.index)
        );
        
        const isCorrect = currentOrder.every((index, position) => 
            correctOrder[position] === index
        );
        
        if (isCorrect) {
            button.textContent = '✅ Correct!';
            button.style.background = '#4caf50';
            dropZone.style.borderColor = '#4caf50';
        } else {
            button.textContent = '❌ Try Again';
            button.style.background = '#f44336';
        }
    }
    
    generateDNAReport(evidence) {
        const report = `
DNA ANALYSIS REPORT
Case: ${evidence.name}
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
        
        return report;
    }
    
    // Public methods
    showBrowser() {
        this.toggleBrowser();
    }
    
    showEmail() {
        this.toggleEmail();
    }
    
    getEvidenceHandler(type) {
        return this.evidenceTypes[type] || null;
    }
}

// Initialize desktop simulation
let desktopSim;
document.addEventListener('DOMContentLoaded', () => {
    desktopSim = new DesktopSimulation();
}); 