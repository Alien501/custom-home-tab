// ===== Settings store =====
const SETTINGS_KEY = 'dashboardSettings';

const DEFAULT_SETTINGS = {
    name: '',
    focus: '',
    accent: '#f5c000',
    focusLen: 25,
    breakLen: 5,
    showGreeting: true,
    showQuote: true,
    showPomodoro: true,
    showEmbers: true,
    showSeconds: false,
};

const ACCENTS = [
    { name: 'Gold', color: '#f5c000' },
    { name: 'Ember', color: '#ff7849' },
    { name: 'Rose', color: '#ff5b8a' },
    { name: 'Lilac', color: '#c879ff' },
    { name: 'Sky', color: '#5b9dff' },
    { name: 'Mint', color: '#4fd39a' },
];

const QUOTES = [
    'Do the thing you keep putting off.',
    'Small steps every day.',
    'Focus is a superpower.',
    'Done is better than perfect.',
    'Make today count.',
    'Progress, not perfection.',
    'One task at a time.',
    'Start where you are.',
    'Discipline equals freedom.',
    'The work is the reward.',
    'Slow is smooth, smooth is fast.',
    'You have time for what matters.',
    'Less noise, more signal.',
    'Show up. That is most of it.',
];

function loadSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        return { ...DEFAULT_SETTINGS, ...(stored || {}) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

let settings = loadSettings();

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ===== Helpers =====
function hexToRgb(hex) {
    const m = hex.replace('#', '');
    const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    const int = parseInt(full, 16);
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function dayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
}

function getGreetingWord() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 22) return 'Good evening';
    return 'Still up';
}

// ===== DOM refs =====
const greetingEl = document.getElementById('greeting');
const focusLineEl = document.getElementById('focus-line');
const dailyQuote = QUOTES[dayOfYear() % QUOTES.length];

// ===== Apply settings to the UI =====
function applySettings() {
    document.documentElement.style.setProperty('--color-orange', settings.accent);

    // Greeting
    if (settings.showGreeting) {
        const word = getGreetingWord();
        greetingEl.textContent = settings.name ? `${word}, ${settings.name}` : word;
        greetingEl.style.display = '';
    } else {
        greetingEl.style.display = 'none';
    }

    // Focus / quote line
    focusLineEl.classList.remove('is-quote', 'is-focus');
    if (settings.focus) {
        focusLineEl.classList.add('is-focus');
        focusLineEl.innerHTML = `<span class="focus-tag">✦</span>${escapeHtml(settings.focus)}`;
        focusLineEl.style.display = '';
    } else if (settings.showQuote) {
        focusLineEl.classList.add('is-quote');
        focusLineEl.textContent = dailyQuote;
        focusLineEl.style.display = '';
    } else {
        focusLineEl.style.display = 'none';
    }

    // Clock seconds
    window.__showSeconds = settings.showSeconds;
    if (typeof setTime === 'function') setTime();

    // Pomodoro visibility
    pomodoroEl.classList.toggle('hidden', !settings.showPomodoro);

    // Embers
    settings.showEmbers ? startEmbers() : stopEmbers();

    syncSettingsPanel();
}

// ===== Greeting / focus inline editing =====
greetingEl.addEventListener('click', async () => {
    const result = await openModal({
        title: 'Your name',
        confirmText: 'Save',
        fields: [{ placeholder: 'Add your name', value: settings.name, optional: true }],
    });
    if (result === null) return;
    settings.name = result[0];
    saveSettings();
    applySettings();
});

focusLineEl.addEventListener('click', async () => {
    const result = await openModal({
        title: "Today's focus",
        confirmText: 'Save',
        fields: [{ placeholder: 'What matters most today? (blank to clear)', value: settings.focus, optional: true }],
    });
    if (result === null) return;
    settings.focus = result[0];
    saveSettings();
    applySettings();
});

// ===== Pomodoro =====
const pomodoroEl = document.getElementById('pomodoro');
const pomoModeEl = document.getElementById('pomo-mode');
const pomoRoundEl = document.getElementById('pomo-round');
const pomoTimeEl = document.getElementById('pomo-time');
const pomoToggleEl = document.getElementById('pomo-toggle');
const pomoResetEl = document.getElementById('pomo-reset');

const POMO_KEY = 'pomodoroState';
let pomoInterval = null;

function sessionLength(mode) {
    return (mode === 'focus' ? settings.focusLen : settings.breakLen) * 60;
}

function defaultPomo() {
    return {
        mode: 'focus',
        rounds: 0,
        running: false,
        endTime: null,                 // epoch ms when the running session ends
        remaining: sessionLength('focus'), // seconds left while paused / idle
    };
}

function loadPomo() {
    try {
        const stored = JSON.parse(localStorage.getItem(POMO_KEY));
        return stored ? { ...defaultPomo(), ...stored } : defaultPomo();
    } catch {
        return defaultPomo();
    }
}

let pomo = loadPomo();

function savePomo() {
    localStorage.setItem(POMO_KEY, JSON.stringify({
        mode: pomo.mode,
        rounds: pomo.rounds,
        running: pomo.running,
        endTime: pomo.endTime,
        remaining: pomo.remaining,
    }));
}

// Seconds left right now (computed from the end timestamp while running)
function pomoRemaining() {
    if (pomo.running && pomo.endTime) {
        return Math.max(0, Math.round((pomo.endTime - Date.now()) / 1000));
    }
    return pomo.remaining;
}

function pomoFormat(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${padZero(m)}:${padZero(s)}`;
}

function renderPomo() {
    const rem = pomoRemaining();
    pomoTimeEl.textContent = pomoFormat(rem);
    pomoModeEl.textContent = pomo.mode === 'focus' ? 'Focus' : 'Break';
    pomoRoundEl.textContent = pomo.rounds > 0 ? `#${pomo.rounds}` : '';
    pomoToggleEl.textContent = pomo.running ? 'Pause' : 'Start';
    pomodoroEl.classList.toggle('running', pomo.running);
    pomodoroEl.classList.toggle('break-mode', pomo.mode === 'break');

    document.title = pomo.running
        ? `${pomoFormat(rem)} · ${pomo.mode === 'focus' ? 'Focus' : 'Break'}`
        : 'Alien501';
}

function advanceMode() {
    if (pomo.mode === 'focus') {
        pomo.rounds += 1;
        pomo.mode = 'break';
    } else {
        pomo.mode = 'focus';
    }
    pomo.running = false;
    pomo.endTime = null;
    pomo.remaining = sessionLength(pomo.mode);
}

function chimePomo() {
    pomodoroEl.classList.add('chime');
    setTimeout(() => pomodoroEl.classList.remove('chime'), 1200);
}

function startInterval() {
    if (pomoInterval) return;
    pomoInterval = setInterval(pomoTick, 250);
}

function stopInterval() {
    if (pomoInterval) clearInterval(pomoInterval);
    pomoInterval = null;
}

function pomoTick() {
    if (!pomo.running) { stopInterval(); return; }
    if (pomoRemaining() > 0) { renderPomo(); return; }

    // Session reached zero. Re-sync first so another tab can't double-advance.
    pomo = loadPomo();
    if (!pomo.running || pomoRemaining() > 0) {
        stopInterval();
        if (pomo.running && pomoRemaining() > 0) startInterval();
        renderPomo();
        return;
    }
    stopInterval();
    advanceMode();
    savePomo();
    chimePomo();
    renderPomo();
}

function pomoStart() {
    if (pomo.running) return;
    pomo.running = true;
    pomo.endTime = Date.now() + pomo.remaining * 1000;
    savePomo();
    startInterval();
    renderPomo();
}

function pomoPause() {
    if (!pomo.running) return;
    pomo.remaining = pomoRemaining();
    pomo.running = false;
    pomo.endTime = null;
    stopInterval();
    savePomo();
    renderPomo();
}

function pomoReset() {
    stopInterval();
    pomo.mode = 'focus';
    pomo.rounds = 0;
    pomo.running = false;
    pomo.endTime = null;
    pomo.remaining = sessionLength('focus');
    savePomo();
    renderPomo();
}

// Restore state on load: if it expired while every tab was closed, advance once.
function resumePomo() {
    if (pomo.running) {
        if (pomoRemaining() <= 0) {
            advanceMode();
            savePomo();
        } else {
            startInterval();
        }
    }
    renderPomo();
}

pomoToggleEl.addEventListener('click', () => (pomo.running ? pomoPause() : pomoStart()));
pomoResetEl.addEventListener('click', pomoReset);

// Keep every open tab in sync
window.addEventListener('storage', (event) => {
    if (event.key !== POMO_KEY) return;
    pomo = loadPomo();
    stopInterval();
    if (pomo.running && pomoRemaining() > 0) startInterval();
    renderPomo();
});

// ===== Ambient embers =====
const embersCanvas = document.getElementById('embers');
const ectx = embersCanvas.getContext('2d');
let emberParticles = [];
let emberRAF = null;

function sizeCanvas() {
    embersCanvas.width = window.innerWidth;
    embersCanvas.height = window.innerHeight;
}

function makeEmber() {
    const h = embersCanvas.height || window.innerHeight;
    return {
        x: Math.random() * (embersCanvas.width || window.innerWidth),
        y: h + Math.random() * 40,
        size: 1 + Math.random() * 2.5,
        speedY: 0.3 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.6,
    };
}

function drawEmbers() {
    const { r, g, b } = hexToRgb(settings.accent);
    ectx.clearRect(0, 0, embersCanvas.width, embersCanvas.height);

    emberParticles.forEach((p) => {
        p.y -= p.speedY;
        p.phase += 0.02;
        p.x += p.drift + Math.sin(p.phase) * 0.3;
        const twinkle = p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 2));

        ectx.beginPath();
        ectx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ectx.fillStyle = `rgba(${r}, ${g}, ${b}, ${twinkle})`;
        ectx.shadowBlur = 8;
        ectx.shadowColor = `rgba(${r}, ${g}, ${b}, ${twinkle})`;
        ectx.fill();

        if (p.y < -10) Object.assign(p, makeEmber(), { y: embersCanvas.height + 10 });
    });
    ectx.shadowBlur = 0;

    emberRAF = requestAnimationFrame(drawEmbers);
}

function startEmbers() {
    if (emberRAF) return;
    sizeCanvas();
    if (emberParticles.length === 0) {
        const count = Math.round((window.innerWidth * window.innerHeight) / 32000);
        emberParticles = Array.from({ length: Math.min(70, Math.max(25, count)) }, makeEmber);
    }
    embersCanvas.style.display = '';
    drawEmbers();
}

function stopEmbers() {
    if (emberRAF) cancelAnimationFrame(emberRAF);
    emberRAF = null;
    ectx.clearRect(0, 0, embersCanvas.width, embersCanvas.height);
    embersCanvas.style.display = 'none';
}

window.addEventListener('resize', () => {
    if (emberRAF) sizeCanvas();
});

// ===== Settings panel wiring =====
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsClose = document.getElementById('settings-close');
const settingsReset = document.getElementById('settings-reset');
const accentSwatches = document.getElementById('accent-swatches');

const setName = document.getElementById('set-name');
const setFocus = document.getElementById('set-focus');
const setFocusLen = document.getElementById('set-focus-len');
const setBreakLen = document.getElementById('set-break-len');
const togGreeting = document.getElementById('tog-greeting');
const togQuote = document.getElementById('tog-quote');
const togPomo = document.getElementById('tog-pomo');
const togEmbers = document.getElementById('tog-embers');
const togSeconds = document.getElementById('tog-seconds');

// Build accent swatches once
ACCENTS.forEach((accent) => {
    const btn = document.createElement('button');
    btn.className = 'accent-swatch';
    btn.style.backgroundColor = accent.color;
    btn.title = accent.name;
    btn.dataset.color = accent.color;
    btn.addEventListener('click', () => {
        settings.accent = accent.color;
        saveSettings();
        applySettings();
    });
    accentSwatches.appendChild(btn);
});

function syncSettingsPanel() {
    setName.value = settings.name;
    setFocus.value = settings.focus;
    setFocusLen.value = settings.focusLen;
    setBreakLen.value = settings.breakLen;
    togGreeting.checked = settings.showGreeting;
    togQuote.checked = settings.showQuote;
    togPomo.checked = settings.showPomodoro;
    togEmbers.checked = settings.showEmbers;
    togSeconds.checked = settings.showSeconds;
    accentSwatches.querySelectorAll('.accent-swatch').forEach((s) => {
        s.classList.toggle('active', s.dataset.color === settings.accent);
    });
}

function openSettings() {
    settingsPanel.classList.add('open');
    settingsPanel.setAttribute('aria-hidden', 'false');
}
function closeSettings() {
    settingsPanel.classList.remove('open');
    settingsPanel.setAttribute('aria-hidden', 'true');
}

settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsPanel.classList.contains('open')) closeSettings();
});

setName.addEventListener('input', () => { settings.name = setName.value.trim(); saveSettings(); applySettings(); });
setFocus.addEventListener('input', () => { settings.focus = setFocus.value.trim(); saveSettings(); applySettings(); });

setFocusLen.addEventListener('change', () => {
    settings.focusLen = Math.min(120, Math.max(1, parseInt(setFocusLen.value) || 25));
    saveSettings();
    if (!pomo.running && pomo.mode === 'focus') { pomo.remaining = settings.focusLen * 60; savePomo(); renderPomo(); }
});
setBreakLen.addEventListener('change', () => {
    settings.breakLen = Math.min(60, Math.max(1, parseInt(setBreakLen.value) || 5));
    saveSettings();
    if (!pomo.running && pomo.mode === 'break') { pomo.remaining = settings.breakLen * 60; savePomo(); renderPomo(); }
});

[
    [togGreeting, 'showGreeting'],
    [togQuote, 'showQuote'],
    [togPomo, 'showPomodoro'],
    [togEmbers, 'showEmbers'],
    [togSeconds, 'showSeconds'],
].forEach(([el, key]) => {
    el.addEventListener('change', () => {
        settings[key] = el.checked;
        saveSettings();
        applySettings();
    });
});

settingsReset.addEventListener('click', () => {
    settings = { ...DEFAULT_SETTINGS };
    saveSettings();
    pomoReset();
    applySettings();
});

// ===== Init =====
resumePomo();
applySettings();

// Keep greeting accurate as the day progresses
setInterval(() => {
    if (!settings.showGreeting) return;
    const word = getGreetingWord();
    greetingEl.textContent = settings.name ? `${word}, ${settings.name}` : word;
}, 60000);
