// UNSOLVED SPA main.js
// All game logic, UI, and sound system
// Loads cases from JSON/TXT in cases/ folder
// No images, only CSS/emoji visuals
// No in-app mod/case creation
// Mod import is a stub

// --- DOM Elements ---
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const screens = {
  caseSelect: $('#case-select'),
  mainGame: $('#main-game'),
  evidenceModal: $('#evidence-modal'),
  suspectsModal: $('#suspects-modal'),
  accuseModal: $('#accuse-modal'),
  modImportModal: $('#mod-import-modal'),
};

// --- Game State ---
const gameState = {
  cases: [], // List of case meta info
  currentCase: null, // { id, title, ... }
  evidence: {}, // { name: description }
  suspects: {}, // { name: { topic: response } }
  solution: {}, // { killer, motive }
  sanity: 100,
  dialogue: [],
  soundEnabled: true,
};

// --- SPA Navigation ---
function showScreen(screen) {
  $$('.spa-screen').forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function showModal(modal) {
  modal.style.display = 'flex';
}
function hideModal(modal) {
  modal.style.display = 'none';
}

// --- Case Loading ---
async function loadCaseList() {
  // Scan cases/ for folders (simulate with hardcoded list for now)
  // In real deployment, you may need a manifest or pre-known list
  const caseFolders = ['case1', 'case2', 'case3'];
  gameState.cases = await Promise.all(caseFolders.map(async id => {
    // Try to load a title from options.json or fallback
    try {
      const res = await fetch(`./cases/${id}/options.json`);
      const opts = await res.json();
      return { id, title: opts.title || id, difficulty: opts.difficulty || 'Unknown' };
    } catch {
      return { id, title: id, difficulty: 'Unknown' };
    }
  }));
  renderCaseList();
}

function renderCaseList() {
  const list = $('#case-list');
  list.innerHTML = '';
  gameState.cases.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'case-btn';
    btn.textContent = `${c.title} (${c.difficulty})`;
    btn.onclick = () => startCase(c.id);
    list.appendChild(btn);
  });
}

async function startCase(caseId) {
  // Load evidence, suspects, solution
  const [evidence, suspects, solution] = await Promise.all([
    fetch(`./cases/${caseId}/evidence.json`).then(r => r.json()),
    fetch(`./cases/${caseId}/suspects.json`).then(r => r.json()),
    fetch(`./cases/${caseId}/solution.json`).then(r => r.json()),
  ]);
  gameState.currentCase = gameState.cases.find(c => c.id === caseId);
  gameState.evidence = evidence;
  gameState.suspects = suspects;
  gameState.solution = solution;
  gameState.sanity = 100;
  gameState.dialogue = [];
  renderGame();
  showScreen(screens.mainGame);
}

// --- Main Game Rendering ---
function renderGame() {
  $('#game-case-title').textContent = gameState.currentCase.title;
  $('#game-sanity').textContent = `🧠 ${gameState.sanity}%`;
  $('#game-clock').textContent = `🕒 ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  renderSuspectList();
  renderEvidenceList();
  $('#dialogue-box').textContent = 'Select a suspect or evidence to begin.';
}

function renderSuspectList() {
  const list = $('#suspect-list');
  list.innerHTML = '';
  Object.keys(gameState.suspects).forEach(name => {
    const li = document.createElement('li');
    li.innerHTML = `👤 <button class="suspect-btn">${name}</button>`;
    li.querySelector('button').onclick = () => showSuspectModal(name);
    list.appendChild(li);
  });
}

function renderEvidenceList() {
  const list = $('#evidence-list');
  list.innerHTML = '';
  Object.entries(gameState.evidence).forEach(([name, desc]) => {
    const li = document.createElement('li');
    li.innerHTML = `🔎 <button class="evidence-btn">${name}</button>`;
    li.querySelector('button').onclick = () => showEvidenceModal(name);
    list.appendChild(li);
  });
}

// --- Suspect Modal ---
function showSuspectModal(name) {
  const modal = screens.suspectsModal;
  const list = $('#modal-suspect-list');
  list.innerHTML = '';
  const suspect = gameState.suspects[name];
  Object.entries(suspect).forEach(([topic, response]) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${topic}:</b> <span>${response}</span>`;
    list.appendChild(li);
  });
  showModal(modal);
  $('#close-suspects-modal').onclick = () => hideModal(modal);
}

// --- Evidence Modal ---
function showEvidenceModal(name) {
  const modal = screens.evidenceModal;
  const list = $('#modal-evidence-list');
  list.innerHTML = '';
  if (name) {
    // Show just one
    const desc = gameState.evidence[name];
    const li = document.createElement('li');
    li.innerHTML = `<b>${name}:</b> <span>${desc}</span>`;
    list.appendChild(li);
  } else {
    // Show all
    Object.entries(gameState.evidence).forEach(([ename, desc]) => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${ename}:</b> <span>${desc}</span>`;
      list.appendChild(li);
    });
  }
  showModal(modal);
  $('#close-evidence-modal').onclick = () => hideModal(modal);
}

// --- Accuse Modal ---
function showAccuseModal() {
  const modal = screens.accuseModal;
  const list = $('#accuse-list');
  list.innerHTML = '';
  Object.keys(gameState.suspects).forEach(name => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => handleAccusation(name);
    li.appendChild(btn);
    list.appendChild(li);
  });
  showModal(modal);
  $('#close-accuse-modal').onclick = () => hideModal(modal);
}

function handleAccusation(name) {
  hideModal(screens.accuseModal);
  const correct = name === gameState.solution.killer;
  showToast(correct ? '✅ Correct! You solved the case.' : '❌ Wrong suspect!');
  playSound(correct ? 'success' : 'failure');
}

// --- Sound System ---
const soundBuffers = {};
let audioContext = null;

async function loadSound(name) {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (soundBuffers[name]) return soundBuffers[name];
  const url = `./sounds/${name}`;
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  const buf = await audioContext.decodeAudioData(arr);
  soundBuffers[name] = buf;
  return buf;
}

async function playSound(name) {
  if (!gameState.soundEnabled) return;
  try {
    const ext = name.endsWith('.mp3') || name.endsWith('.wav') ? '' : '.wav';
    const buf = await loadSound(name + ext);
    const src = audioContext.createBufferSource();
    src.buffer = buf;
    src.connect(audioContext.destination);
    src.start();
  } catch (e) {
    // Ignore missing sound
  }
}

// --- Toast/Notification ---
function showToast(msg, ms = 2000) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), ms);
}

// --- Event Listeners ---
window.addEventListener('DOMContentLoaded', () => {
  // Initial screen
  showScreen(screens.caseSelect);
  loadCaseList();

  // Navigation
  $('#back-to-cases').onclick = () => showScreen(screens.caseSelect);
  $('#view-evidence-btn').onclick = () => showEvidenceModal();
  $('#view-suspects-btn').onclick = () => showSuspectModal(Object.keys(gameState.suspects)[0]);
  $('#accuse-btn').onclick = showAccuseModal;
  $('#save-btn').onclick = () => showToast('Save feature coming soon!');

  // Mod import stub
  $('#import-mod-btn').onclick = () => showModal(screens.modImportModal);
  $('#close-mod-import-modal').onclick = () => hideModal(screens.modImportModal);

  // Modal close on background click
  $$('.spa-modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) hideModal(modal);
    });
  });
}); 