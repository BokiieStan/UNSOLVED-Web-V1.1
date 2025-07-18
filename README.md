# UNSOLVED - Detective Game v2.0

**The Nightmare Files** - A fully enhanced detective game with advanced features, smart suspects, and immersive atmosphere.

## 🎭 New Features in v2.0

### 1. Night Mode / Sanity FX Overhaul
- **Dynamic Lighting**: The game world changes based on time of day and your sanity level
- **VHS Glitch Effects**: Visual distortions intensify as your sanity decreases
- **Whispering Audio**: Layered audio effects with real-time whispering of names and clues
- **Custom Cursor**: Cursor changes based on your mental state (stabby, shaky, etc.)

### 2. Enhanced Evidence Types
- **🔐 Encrypted Files**: Evidence that must be decoded using in-game logic
- **🔍 Scratched Documents**: Drag-and-drop puzzle to reconstruct torn documents
- **🧬 DNA Reports**: Interactive reports with redacted sections that reveal based on choices

### 3. Smart Suspects
- **Memory System**: Suspects remember what you say and can call out your lies
- **Branching Dialogue**: Emotional reactions and meta-awareness that increases over time
- **Fourth Wall Breaking**: Some suspects become aware they're in a game

### 4. Desktop Simulation
- **Fake Browser**: Access case files through a terminal-style browser (Ctrl+B)
- **Email System**: Read case communications and updates (Ctrl+E)
- **Terminal Interface**: Full command-line interface with unlockable features (Ctrl+T)

### 5. Modding Tools
- **Case Creation Wizard**: Create your own cases with a step-by-step interface
- **JSON Import/Export**: Share cases with other players
- **External Case Support**: Load custom cases from JSON files

### 6. Advanced Audio System
- **Layered Music**: Music reacts to dialogue and evidence discovery
- **Whispering Effects**: Random TTS whispers names, dates, and corrupted strings
- **Sound Effects**: Rewind/fast-forward effects for timeline navigation

### 7. Save System 2.0
- **Autosaves**: Automatic saves every 30 seconds
- **Save Scumming Detection**: Warnings if you reload too frequently
- **Corrupted Saves**: Visual corruption effects for dramatic tension

### 8. Bonus Features
- **Developer Popups**: Random messages from the "developer"
- **NFC Support**: Ready for real-world evidence scanning
- **Meta Commentary**: Suspects that break the fourth wall

## 🎮 Controls

### Keyboard Shortcuts
- **Ctrl+B**: Toggle Browser Window
- **Ctrl+E**: Toggle Email System
- **Ctrl+T**: Toggle Terminal
- **Ctrl+M**: Open Mod Manager

### Terminal Commands
- `help` - Show available commands
- `ls` - List files and directories
- `cat <filename>` - Display file contents
- `unlock` - Unlock hidden features
- `debug` - Show game state
- `corrupt` - Simulate system corruption
- `reality` - Alter game reality

## 🔧 Modding Guide

### Creating Your Own Case

1. Click "🔧 CREATE CASE" on the main menu
2. Follow the wizard through 4 steps:
   - **Step 1**: Basic information (name, difficulty, description)
   - **Step 2**: Evidence (normal, encrypted, scratched, DNA)
   - **Step 3**: Suspects (name and dialogue topics)
   - **Step 4**: Solution (correct suspect and explanation)

### Importing Cases

1. Open the Mod Manager (Ctrl+M)
2. Go to the "Import" tab
3. Either paste JSON data or select a file
4. Your case will be available to play

### Case JSON Format

```json
{
  "name": "Case Name",
  "difficulty": "Medium",
  "description": "Case description",
  "evidence": [
    {
      "name": "Evidence Name",
      "description": "Evidence description",
      "type": "normal"
    }
  ],
  "suspects": {
    "Suspect Name": {
      "Topic 1": "Response 1",
      "Topic 2": "Response 2"
    }
  },
  "correctSuspect": "Suspect Name",
  "solution": "Why this suspect is guilty"
}
```

## 🎵 Audio Features

### Music Layers
- **Neutral**: Standard background music
- **Tension**: Added atmospheric layers
- **Danger**: Intense music for critical moments
- **Victory/Failure**: Special tracks for case resolution

### Whispering System
- Triggers when sanity is below 60%
- Frequency increases as sanity decreases
- Whispers names, dates, and thematic words
- Visual whisper effects appear on screen

## 🌙 Night Mode System

### Time Phases
- **Day (6 AM - 6 PM)**: Normal lighting
- **Evening (6 PM - 9 PM)**: Slight darkness
- **Night (9 PM - 12 AM)**: Moderate darkness
- **Midnight (12 AM - 6 AM)**: Intense darkness

### Sanity Effects
- **100-60%**: Normal experience
- **59-30%**: Visual distortions, increased whispers
- **29-0%**: Critical effects, intense glitches, meta-awareness

## 🕵️ Smart Suspect System

### Memory Features
- Suspects remember all conversations
- They can detect if you're lying
- Emotional states change based on interactions
- Meta-awareness increases over time

### Emotional States
- **Neutral**: Standard responses
- **Defensive**: Suspicious of your questions
- **Aggressive**: Confrontational responses
- **Confused**: Starting to question reality
- **Panicked**: Full meta-awareness

## 💾 Save System Features

### Autosave
- Saves every 30 seconds automatically
- Keeps last 5 autosaves
- Corruption chance increases with save scumming

### Corruption Effects
- Visual corruption screen
- Repair attempts may fail
- Continue with corrupted data for extra challenge
- Developer warnings about instability

## 🎭 Developer Messages

Random popups from the "developer" include:
- "Your sanity is critically low. The game is becoming unstable..."
- "Reality is beginning to blur. Are you sure you want to continue?"
- "You're breaking the fourth wall. This isn't supposed to happen."
- "Save file corruption detected. Your progress may be lost."

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Click "START" to begin
3. Select a case or create your own
4. Use the enhanced features to solve mysteries
5. Try the terminal commands for hidden features

## 🎯 Tips for Players

- **Low Sanity**: Pay attention to visual and audio changes
- **Smart Suspects**: Be careful about lying - they remember
- **Terminal**: Use `unlock` command to access hidden features
- **Modding**: Create cases to share with friends
- **Save Scumming**: The game will warn you about excessive reloading

## 🔮 Future Features

- NFC evidence scanning
- Multiplayer case solving
- Advanced AI suspect behavior
- Virtual reality support
- More evidence types and puzzles

---

**© BokiieStan, 2025** - *The Nightmare Files*
