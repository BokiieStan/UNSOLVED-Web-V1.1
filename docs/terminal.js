// Terminal System with Fake Commands and Unlockable Features
class TerminalSystem {
    constructor() {
        this.terminal = null;
        this.terminalOutput = null;
        this.terminalInput = null;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentDirectory = '/cases';
        this.unlockedCommands = new Set(['help', 'ls', 'pwd', 'clear']);
        this.secretCommands = new Set(['unlock', 'debug', 'corrupt', 'reality']);
        this.isUnlocked = false;
        
        this.init();
    }
    
    init() {
        this.terminal = document.getElementById('terminal');
        this.terminalOutput = document.querySelector('.terminal-output');
        this.terminalInput = document.querySelector('.terminal-input');
        
        this.setupEventListeners();
        this.printWelcome();
    }
    
    setupEventListeners() {
        if (!this.terminalInput) return;
        
        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.terminalInput.value);
                this.terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
        
        // Terminal close button
        const closeBtn = document.querySelector('.terminal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideTerminal();
            });
        }
        
        // Keyboard shortcut to show terminal
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.toggleTerminal();
            }
        });
    }
    
    toggleTerminal() {
        if (this.terminal) {
            this.terminal.classList.toggle('hidden');
            if (!this.terminal.classList.contains('hidden')) {
                this.terminalInput.focus();
            }
        }
    }
    
    hideTerminal() {
        if (this.terminal) {
            this.terminal.classList.add('hidden');
        }
    }
    
    printWelcome() {
        this.printLine('UNSOLVED TERMINAL v2.0 - The Nightmare Files');
        this.printLine('Type "help" for available commands.');
        this.printLine('');
        this.printPrompt();
    }
    
    printPrompt() {
        this.printLine(`detective@unsolved:${this.currentDirectory}$ `, false);
    }
    
    printLine(text, addToHistory = true) {
        if (!this.terminalOutput) return;
        
        const line = document.createElement('div');
        line.textContent = text;
        this.terminalOutput.appendChild(line);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        
        if (addToHistory) {
            this.commandHistory.push(text);
        }
    }
    
    executeCommand(command) {
        if (!command.trim()) {
            this.printPrompt();
            return;
        }
        
        this.printLine(`detective@unsolved:${this.currentDirectory}$ ${command}`);
        
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Add to command history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Execute command
        if (this.unlockedCommands.has(cmd) || this.isUnlocked) {
            this.runCommand(cmd, args);
        } else if (this.secretCommands.has(cmd)) {
            this.runSecretCommand(cmd, args);
        } else {
            this.printLine(`Command not found: ${cmd}`);
        }
        
        this.printPrompt();
    }
    
    runCommand(cmd, args) {
        switch (cmd) {
            case 'help':
                this.cmdHelp(args);
                break;
            case 'ls':
                this.cmdLs(args);
                break;
            case 'pwd':
                this.cmdPwd(args);
                break;
            case 'clear':
                this.cmdClear(args);
                break;
            case 'cd':
                this.cmdCd(args);
                break;
            case 'cat':
                this.cmdCat(args);
                break;
            case 'grep':
                this.cmdGrep(args);
                break;
            case 'ps':
                this.cmdPs(args);
                break;
            case 'kill':
                this.cmdKill(args);
                break;
            case 'top':
                this.cmdTop(args);
                break;
            case 'netstat':
                this.cmdNetstat(args);
                break;
            case 'whoami':
                this.cmdWhoami(args);
                break;
            case 'date':
                this.cmdDate(args);
                break;
            case 'uname':
                this.cmdUname(args);
                break;
            default:
                this.printLine(`Command not found: ${cmd}`);
        }
    }
    
    runSecretCommand(cmd, args) {
        switch (cmd) {
            case 'unlock':
                this.cmdUnlock(args);
                break;
            case 'debug':
                this.cmdDebug(args);
                break;
            case 'corrupt':
                this.cmdCorrupt(args);
                break;
            case 'reality':
                this.cmdReality(args);
                break;
            default:
                this.printLine(`Secret command not found: ${cmd}`);
        }
    }
    
    cmdHelp(args) {
        this.printLine('Available commands:');
        this.printLine('  help     - Show this help message');
        this.printLine('  ls       - List directory contents');
        this.printLine('  pwd      - Print working directory');
        this.printLine('  clear    - Clear terminal screen');
        this.printLine('  cd       - Change directory');
        this.printLine('  cat      - Display file contents');
        this.printLine('  grep     - Search for patterns');
        this.printLine('  ps       - Show running processes');
        this.printLine('  kill     - Terminate processes');
        this.printLine('  top      - Show system resources');
        this.printLine('  netstat  - Show network connections');
        this.printLine('  whoami   - Show current user');
        this.printLine('  date     - Show current date/time');
        this.printLine('  uname    - Show system information');
        
        if (this.isUnlocked) {
            this.printLine('');
            this.printLine('Secret commands:');
            this.printLine('  unlock   - Unlock hidden features');
            this.printLine('  debug    - Enable debug mode');
            this.printLine('  corrupt  - Corrupt system files');
            this.printLine('  reality  - Alter game reality');
        }
    }
    
    cmdLs(args) {
        const files = {
            '/': ['cases', 'system', 'logs', 'config'],
            '/cases': ['case001_midnight_murder', 'case002_gallery_heist', 'case003_poisoned_professor'],
            '/cases/case001_midnight_murder': ['evidence.txt', 'suspects.txt', 'timeline.txt', 'photos'],
            '/cases/case002_gallery_heist': ['evidence.txt', 'suspects.txt', 'timeline.txt', 'photos'],
            '/cases/case003_poisoned_professor': ['evidence.txt', 'suspects.txt', 'timeline.txt', 'photos'],
            '/system': ['processes.txt', 'memory.txt', 'network.txt'],
            '/logs': ['access.log', 'error.log', 'debug.log'],
            '/config': ['settings.json', 'user.json', 'game.json']
        };
        
        const currentFiles = files[this.currentDirectory] || [];
        currentFiles.forEach(file => {
            this.printLine(`  ${file}`);
        });
    }
    
    cmdPwd(args) {
        this.printLine(this.currentDirectory);
    }
    
    cmdClear(args) {
        if (this.terminalOutput) {
            this.terminalOutput.innerHTML = '';
        }
    }
    
    cmdCd(args) {
        if (args.length === 0) {
            this.currentDirectory = '/';
        } else {
            const target = args[0];
            if (target === '..') {
                const parts = this.currentDirectory.split('/').filter(p => p);
                parts.pop();
                this.currentDirectory = '/' + parts.join('/');
            } else if (target.startsWith('/')) {
                this.currentDirectory = target;
            } else {
                this.currentDirectory = this.currentDirectory + '/' + target;
            }
        }
    }
    
    cmdCat(args) {
        if (args.length === 0) {
            this.printLine('Usage: cat <filename>');
            return;
        }
        
        const filename = args[0];
        const fileContents = this.getFileContents(filename);
        
        if (fileContents) {
            this.printLine(fileContents);
        } else {
            this.printLine(`File not found: ${filename}`);
        }
    }
    
    cmdGrep(args) {
        if (args.length < 2) {
            this.printLine('Usage: grep <pattern> <filename>');
            return;
        }
        
        const pattern = args[0];
        const filename = args[1];
        const fileContents = this.getFileContents(filename);
        
        if (fileContents) {
            const lines = fileContents.split('\n');
            const matches = lines.filter(line => 
                line.toLowerCase().includes(pattern.toLowerCase())
            );
            
            if (matches.length > 0) {
                matches.forEach(match => this.printLine(match));
            } else {
                this.printLine('No matches found.');
            }
        } else {
            this.printLine(`File not found: ${filename}`);
        }
    }
    
    cmdPs(args) {
        this.printLine('  PID TTY          TIME CMD');
        this.printLine('  1234 pts/0    00:00:01 unsolved-game');
        this.printLine('  1235 pts/0    00:00:00 audio-engine');
        this.printLine('  1236 pts/0    00:00:00 night-mode');
        this.printLine('  1237 pts/0    00:00:00 sanity-monitor');
        this.printLine('  1238 pts/0    00:00:00 whisper-system');
    }
    
    cmdKill(args) {
        if (args.length === 0) {
            this.printLine('Usage: kill <pid>');
            return;
        }
        
        const pid = args[0];
        this.printLine(`Terminating process ${pid}...`);
        
        // Simulate process termination effects
        if (pid === '1237') { // sanity-monitor
            this.printLine('WARNING: Sanity monitoring disabled!');
            if (nightModeSystem) {
                nightModeSystem.triggerGlitch();
            }
        }
    }
    
    cmdTop(args) {
        this.printLine('top - 14:30:25 up 2:15, 1 user, load average: 0.52, 0.58, 0.59');
        this.printLine('Tasks: 5 total, 1 running, 4 sleeping, 0 stopped, 0 zombie');
        this.printLine('%Cpu(s): 12.5 us, 8.3 sy, 0.0 ni, 79.2 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st');
        this.printLine('MiB Mem : 8192.0 total, 2048.0 free, 4096.0 used, 2048.0 buff/cache');
        this.printLine('MiB Swap: 0.0 total, 0.0 free, 0.0 used. 4096.0 avail Mem');
        this.printLine('');
        this.printLine('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
        this.printLine(' 1234 detective  20   0  1024000  51200  10240 S   5.2   0.6   0:01.23 unsolved-game');
        this.printLine(' 1235 detective  20   0   512000  25600   5120 S   2.1   0.3   0:00.45 audio-engine');
        this.printLine(' 1236 detective  20   0   256000  12800   2560 S   1.8   0.2   0:00.32 night-mode');
        this.printLine(' 1237 detective  20   0   128000   6400   1280 S   1.2   0.1   0:00.18 sanity-monitor');
        this.printLine(' 1238 detective  20   0    64000   3200    640 S   0.8   0.0   0:00.12 whisper-system');
    }
    
    cmdNetstat(args) {
        this.printLine('Active Internet connections (w/o servers)');
        this.printLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
        this.printLine('tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN');
        this.printLine('tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN');
        this.printLine('tcp        0      0 192.168.1.100:443       10.0.0.50:52432         ESTABLISHED');
    }
    
    cmdWhoami(args) {
        this.printLine('detective');
    }
    
    cmdDate(args) {
        const now = new Date();
        this.printLine(now.toString());
    }
    
    cmdUname(args) {
        this.printLine('Linux unsolved-game 5.15.0-generic #1 SMP Thu Dec 2 20:13:49 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux');
    }
    
    // Secret commands
    cmdUnlock(args) {
        this.isUnlocked = true;
        this.printLine('Hidden features unlocked!');
        this.printLine('New commands available: debug, corrupt, reality');
        
        // Trigger special effects
        if (nightModeSystem) {
            nightModeSystem.triggerGlitch();
        }
        
        if (audioEngine) {
            audioEngine.playSound('glitch', { volume: 0.5 });
        }
    }
    
    cmdDebug(args) {
        this.printLine('Debug mode enabled.');
        this.printLine('Game state:');
        this.printLine(`  Sanity: ${gameState.SANITY}`);
        this.printLine(`  Current case: ${gameState.currentCase}`);
        this.printLine(`  Evidence collected: ${gameState.collectedEvidence.length}`);
        this.printLine(`  Achievements: ${gameState.achievements.size}`);
    }
    
    cmdCorrupt(args) {
        this.printLine('Corrupting system files...');
        this.printLine('WARNING: This may cause instability!');
        
        // Simulate corruption effects
        setTimeout(() => {
            this.printLine('System corruption detected!');
            if (nightModeSystem) {
                nightModeSystem.triggerCriticalSanity();
            }
        }, 2000);
    }
    
    cmdReality(args) {
        this.printLine('Reality alteration initiated...');
        this.printLine('You shouldn\'t have found this command.');
        
        // Show developer popup
        if (nightModeSystem) {
            nightModeSystem.showDeveloperMessage("You're breaking the fourth wall. This isn't supposed to happen.");
        }
    }
    
    getFileContents(filename) {
        const files = {
            'evidence.txt': `Case Evidence Report
========================
1. Torn Letter - Partial love letter to Richard, signed 'E'
2. Financial Documents - Richard had $500,000+ in gambling debts
3. Whiskey Glass - Lipstick residue matches Victoria's shade
4. Derringer - Registered to Victoria's father, found under desk

Status: Investigation ongoing`,
            
            'suspects.txt': `Suspect Profiles
=================
Victoria Hawthorne - Wife, 15 years married
James Caldwell - Business partner, financial disputes
Eleanor Vance - Maid, 7 years service
Thomas Reed - Gardener, maintains grounds

All suspects interviewed.`,
            
            'timeline.txt': `Case Timeline
==============
9:00 PM - Richard returns home
10:30 PM - James leaves (confirmed by driver)
11:00 PM - Argument heard (Victoria)
11:30 PM - Gunshot heard
11:35 PM - Eleanor discovers body
12:00 AM - Police arrive`,
            
            'processes.txt': `System Processes
=================
unsolved-game    - Main game process
audio-engine     - Audio system
night-mode       - Lighting effects
sanity-monitor   - Sanity tracking
whisper-system   - Whispering effects`,
            
            'memory.txt': `Memory Usage
=============
Total: 8192 MB
Used: 4096 MB
Free: 2048 MB
Cache: 2048 MB`,
            
            'network.txt': `Network Status
===============
Interface: eth0
IP: 192.168.1.100
Gateway: 192.168.1.1
DNS: 8.8.8.8
Status: Connected`
        };
        
        return files[filename] || null;
    }
    
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
        }
        
        if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
            this.terminalInput.value = this.commandHistory[this.historyIndex];
        }
    }
    
    // Public methods
    showTerminal() {
        this.toggleTerminal();
    }
    
    hideTerminal() {
        this.hideTerminal();
    }
    
    isTerminalVisible() {
        return !this.terminal.classList.contains('hidden');
    }
}

// Initialize terminal system
let terminalSystem;
document.addEventListener('DOMContentLoaded', () => {
    terminalSystem = new TerminalSystem();
}); 