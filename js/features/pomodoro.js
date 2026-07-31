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
