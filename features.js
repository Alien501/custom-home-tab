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
    useBackgroundTimeline: false,
    backgroundSlots: {},
};

const ACCENTS = [
    { name: 'Gold', color: '#f5c000' },
    { name: "Cloud Dancer", color: "#F0EEE9"},
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
    // Action & Starting
    'Action cures fear.',
    'Begin anywhere.',
    'Just start.',
    'Take the first step.',
    'Motion beats meditation.',
    'Do what you can.',
    'Move the needle.',
    'Create momentum.',
    'Do not wait for inspiration.',
    'Execute on the idea.',
    'Make it happen.',
    'Act before you are ready.',
    'Momentum is magic.',
    'Put in the reps.',
    'Talk less, do more.',
    'Actions express priority.',
    'Do it badly, but do it.',
    'Start small, think big.',
    'Keep moving forward.',
    'Inertia is the enemy.',
    'Decide and act.',
    'Do the hard thing first.',
    'Eat the frog.',
    'Bias toward action.',
    'Hesitation kills progress.',
    'Action is the foundational key.',
    'Start before you feel ready.',
    'The time is now.',
    'Do not overthink it.',
    'Build it as you fly.',
    'Take massive action.',
    'Do the work.',
    'Stop planning, start doing.',
    'Leap and the net will appear.',
    'Action is the best teacher.',
    'Be a maker.',
    'Ship it.',
    'Do not wait for tomorrow.',
    'Make your own luck.',
    'Initiative is everything.',
    'Strike the match.',
    'Action precedes motivation.',
    'Get out of your own way.',
    'Dive in.',
    'Commit and figure it out.',
    'Turn intention into action.',
    'Cross the starting line.',
    'Do something today.',
    'Effort is a choice.',
    'Show your work.',
    
    // Focus & Attention
    'Ignore the noise.',
    'Protect your attention.',
    'Do one thing well.',
    'Starve distractions.',
    'Feed your focus.',
    'Keep the main thing the main thing.',
    'Say no to almost everything.',
    'Deep work matters.',
    'Focus is a choice.',
    'Where attention goes, energy flows.',
    'Eliminate the non-essential.',
    'Unplug to connect.',
    'Multitasking is a myth.',
    'Guard your time.',
    'Clarity over speed.',
    'Silence the notifications.',
    'Direction is more important than speed.',
    'Focus on the step, not the mountain.',
    'Be here now.',
    'Distraction is the death of art.',
    'Look at what matters.',
    'Zoom in.',
    'Subtract the obvious.',
    'Add the meaningful.',
    'Attention is your greatest asset.',
    'One screen at a time.',
    'Focus creates reality.',
    'Block out the world.',
    'Choose your focus.',
    'Stay in your lane.',
    'Bore down on the task.',
    'Keep your eyes on the prize.',
    'Ruthless prioritization.',
    'Clear your desk, clear your mind.',
    'Protect your peace.',
    'Focus is saying no.',
    'Master your attention.',
    'Do it with purpose.',
    'Give it your full self.',
    'Stop scrolling, start creating.',
    'Be ruthlessly focused.',
    'Avoid the shiny objects.',
    'Stay the course.',
    'A narrow focus brings broad results.',
    'Center yourself.',
    'Zero in on the target.',
    'Defend your flow state.',
    'Concentration is power.',
    'Do not scatter your energy.',
    'Focus on what you can control.',
    
    // Discipline & Consistency
    'Consistency beats intensity.',
    'Show up every day.',
    'Build the habit.',
    'Never miss twice.',
    'Drop by drop fills the bucket.',
    'Routine sets you free.',
    'Do it especially when you do not want to.',
    'Repetition is the mother of skill.',
    'Keep the streak alive.',
    'Patience and persistence.',
    'Brick by brick.',
    'Habits compound over time.',
    'Trust the process.',
    'Fall in love with boredom.',
    'Stay in the game.',
    'Endurance wins the race.',
    'Be aggressively patient.',
    'Outlast the critics.',
    'Keep chopping wood.',
    'Carry the water.',
    'Consistency is the ultimate hack.',
    'Do not break the chain.',
    'Little by little becomes a lot.',
    'Play the long game.',
    'Commit to the long term.',
    'Small daily gains.',
    'Discipline bridges the gap.',
    'Routines remove resistance.',
    'Be undeniably consistent.',
    'Weather the storm.',
    'Keep your promises to yourself.',
    'Show up for yourself.',
    'It adds up.',
    'Time in the market beats timing the market.',
    'Stay on the path.',
    'Do the daily work.',
    'Results follow consistency.',
    'Master the mundane.',
    'Do not quit on a bad day.',
    'Forge the habit.',
    'Repetition breeds mastery.',
    'Every day is day one.',
    'Pace yourself.',
    'Keep laying bricks.',
    'Outwork your yesterday.',
    'Discipline over motivation.',
    'The magic is in the daily routine.',
    'Consistent action creates consistent results.',
    'Do it again.',
    'Keep pushing.',
    
    // Overcoming Perfectionism & Completion
    'Good enough is good enough.',
    'Perfect is the enemy of good.',
    'Finished is beautiful.',
    'Launch it ugly.',
    'Iterate, iterate, iterate.',
    'Embrace the messy middle.',
    'You can edit a bad page.',
    'You cannot edit a blank page.',
    'Volume precedes quality.',
    'Let go of perfect.',
    'Done clears the mind.',
    'Finish what you start.',
    'Fail fast, learn faster.',
    'Your first draft will suck.',
    'Progress requires failure.',
    'Stop tweaking.',
    'Hit publish.',
    'Put it out there.',
    'Completion over perfection.',
    'Learn by doing.',
    'Embrace constraints.',
    'Deadlines are magic.',
    'Version one is better than version none.',
    'Make mistakes quickly.',
    'Ship the work.',
    'Art is never finished, only abandoned.',
    'Do not let perfect ruin good.',
    'Accept the flaws.',
    'Refine it later.',
    'Release the pressure.',
    'Celebrate the finish line.',
    'Drafts are meant to be dirty.',
    'Cross it off the list.',
    'Close the loop.',
    'Endings are just beginnings.',
    'Do not polish a rough draft.',
    'Get it on paper.',
    'Allow yourself to be a beginner.',
    'There is no perfect time.',
    'There is no perfect plan.',
    'Act > Perfect.',
    'Do not overcook it.',
    'Let the work breathe.',
    'The world needs your rough draft.',
    'Strive for excellence, not perfection.',
    'Embrace the process of becoming.',
    'Quantity leads to quality.',
    'Tolerate imperfection.',
    'Deliver the goods.',
    'Check the box.',
    
    // Simplicity & Minimalism
    'Keep it simple.',
    'Less is more.',
    'Simplify your life.',
    'Cut the clutter.',
    'Remove the friction.',
    'Subtract until it breaks.',
    'Clarity is power.',
    'Declutter your mind.',
    'Essentialism is key.',
    'Do less, but better.',
    'Optimize for simplicity.',
    'Avoid the complex.',
    'Find the elegant solution.',
    'Strip away the inessential.',
    'Protect your whitespace.',
    'Make it easy.',
    'Reduce the steps.',
    'Keep the overhead low.',
    'Live lightly.',
    'Clear space, clear mind.',
    'Only keep what serves you.',
    'Automate the routine.',
    'Delegate the rest.',
    'Find the shortest path.',
    'Say no to extra features.',
    'Master the basics.',
    'Fundamentals first.',
    'A confused mind says no.',
    'Keep the rules simple.',
    'Less baggage, more speed.',
    'Edit your life.',
    'Trim the fat.',
    'Seek quiet.',
    'Less stress, more success.',
    'Curate your inputs.',
    'Protect your bandwidth.',
    'Stop adding, start subtracting.',
    'Value space over stuff.',
    'Simplicity scales.',
    'Complexity fails.',
    'Focus on the core.',
    'Embrace the minimalist mindset.',
    'Travel light.',
    'Make room for what matters.',
    'Do not complicate it.',
    'The simple way is the hard way.',
    'Seek clarity above all.',
    'Quiet the mind.',
    'Rest is productive.',
    'Breathe.',
    
    // Mindset & Resilience
    'Obstacles are the way.',
    'Embrace the suck.',
    'Growth happens outside comfort.',
    'Be your own rescue.',
    'Mind over matter.',
    'Choose your attitude.',
    'You are what you repeatedly do.',
    'Take extreme ownership.',
    'No excuses.',
    'Victimhood is a trap.',
    'Focus on the solution.',
    'Pain is temporary.',
    'Quitting lasts forever.',
    'Hard choices, easy life.',
    'Easy choices, hard life.',
    'Be antifragile.',
    'Fail forward.',
    'Learn from the losses.',
    'Keep your head down.',
    'Stay humble.',
    'Do the work in the dark.',
    'Let your results talk.',
    'Confidence comes from competence.',
    'Believe in your capacity.',
    'Comparison is the thief of joy.',
    'Run your own race.',
    'You are enough.',
    'Doubt kills more dreams than failure.',
    'Be fiercely independent.',
    'Adapt and overcome.',
    'Seek discomfort.',
    'Toughen up.',
    'Control your emotions.',
    'Respond, do not react.',
    'Be a student of reality.',
    'Your perspective is your reality.',
    'Protect your energy.',
    'Gratitude grounds you.',
    'Stay hungry.',
    'Stay foolish.',
    'Rejection is redirection.',
    'Thrive under pressure.',
    'Turn pain into power.',
    'The mind is the limit.',
    'Choose courage over comfort.',
    'Stand firm.',
    'Be a force of nature.',
    'Expect nothing, appreciate everything.',
    'Your mind is a weapon.',
    'Keep the fire burning.',
    
    // Time & Priorities
    'Time is your only currency.',
    'Spend time, do not kill it.',
    'Prioritize ruthlessly.',
    'First things first.',
    'Tomorrow is a myth.',
    'Own your morning.',
    'Win the morning, win the day.',
    'Time blocks work.',
    'Manage your energy, not time.',
    'The future is built today.',
    'Saying yes to one thing is saying no to another.',
    'Value your time, others will too.',
    'Do not major in minor things.',
    'Urgent is rarely important.',
    'Important is rarely urgent.',
    'Audit your time.',
    'Schedule your priorities.',
    'Life is short, do the work.',
    'Maximize the present moment.',
    'Make it count.',
    'Every minute matters.',
    'Invest your hours.',
    'Create before you consume.',
    'Protect your peak hours.',
    'Now is all you have.'
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
settings.backgroundSlots = settings.backgroundSlots || {};

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const BACKGROUND_DB = 'dashboardBackgrounds';
const BACKGROUND_STORE = 'media';
const DEFAULT_BACKGROUND_URL = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGpjajMyNHNycXN5M2p0d2ZwcjNuejlyeWRuZW5nZWZqcjYwYXBuZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uFmH8za4E6M5STIiTu/giphy.gif';
const BACKGROUND_SLOTS = ['morning', 'afternoon', 'evening', 'night'];
const MEDIA_SLOTS = ['default', ...BACKGROUND_SLOTS];
const BACKGROUND_HOURS = { morning: 5, afternoon: 12, evening: 17, night: 22 };
let backgroundUrl = null;
let previewUrl = null;
let appliedBackgroundSlot = null;
let backgroundRenderId = 0;

function openBackgroundDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(BACKGROUND_DB, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(BACKGROUND_STORE);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function backgroundDb(action, key, value) {
    const db = await openBackgroundDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(BACKGROUND_STORE, action === 'get' ? 'readonly' : 'readwrite');
        const store = transaction.objectStore(BACKGROUND_STORE);
        const request = action === 'put' ? store.put(value, key) : store[action](key);
        let result;
        request.onsuccess = () => { result = request.result; };
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => reject(transaction.error || request.error);
        transaction.onabort = () => reject(transaction.error || request.error);
    });
}

function currentBackgroundSlot() {
    const hour = new Date().getHours();
    return BACKGROUND_SLOTS.reduce((active, slot) => hour >= BACKGROUND_HOURS[slot] ? slot : active, 'night');
}

function resolveBackgroundSlot() {
    if (!settings.useBackgroundTimeline) return settings.backgroundSlots.default ? 'default' : null;
    const current = BACKGROUND_SLOTS.indexOf(currentBackgroundSlot());
    for (let offset = 0; offset < BACKGROUND_SLOTS.length; offset += 1) {
        const slot = BACKGROUND_SLOTS[(current - offset + BACKGROUND_SLOTS.length) % BACKGROUND_SLOTS.length];
        if (settings.backgroundSlots[slot]) return slot;
    }
    return settings.backgroundSlots.default ? 'default' : null;
}

async function applyBackground() {
    const renderId = ++backgroundRenderId;
    const slot = resolveBackgroundSlot();
    const media = slot && await backgroundDb('get', slot);
    if (renderId !== backgroundRenderId) return;
    if (!media) return restoreDefaultBackground();

    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    backgroundUrl = URL.createObjectURL(media);
    const previous = document.getElementById('bgVideo');
    const element = document.createElement(media.type.startsWith('video/') ? 'video' : 'img');
    element.id = 'bgVideo';
    element.className = 'background-media';
    element.src = backgroundUrl;
    if (element.tagName === 'VIDEO') {
        element.autoplay = true;
        element.loop = true;
        element.muted = true;
        element.playsInline = true;
    } else {
        element.alt = '';
    }
    previous.replaceWith(element);
    appliedBackgroundSlot = slot;
    document.dispatchEvent(new CustomEvent('backgroundmediachange', { detail: element }));
}

async function updateBackgroundPreview() {
    const slot = resolveBackgroundSlot();
    const media = slot && await backgroundDb('get', slot);
    const preview = document.getElementById('bg-preview');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = media ? URL.createObjectURL(media) : null;
    const element = document.createElement(media?.type.startsWith('video/') ? 'video' : 'img');
    element.src = previewUrl || DEFAULT_BACKGROUND_URL;
    element.alt = '';
    if (element.tagName === 'VIDEO') {
        element.autoplay = true;
        element.loop = true;
        element.muted = true;
        element.playsInline = true;
    }
    preview.replaceChildren(element);
}

function restoreDefaultBackground() {
    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    backgroundUrl = null;
    appliedBackgroundSlot = null;
    const previous = document.getElementById('bgVideo');
    if (previous.tagName === 'IMG' && previous.src === DEFAULT_BACKGROUND_URL) return;
    const element = document.createElement('img');
    element.id = 'bgVideo';
    element.className = 'background-media';
    element.src = DEFAULT_BACKGROUND_URL;
    element.alt = '';
    previous.replaceWith(element);
    document.dispatchEvent(new CustomEvent('backgroundmediachange', { detail: element }));
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
const togBackgroundTimeline = document.getElementById('tog-background-timeline');
const backgroundSlotsEl = document.getElementById('background-slots');
const timelineHint = document.querySelector('.timeline-hint');

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
    togBackgroundTimeline.checked = settings.useBackgroundTimeline;
    backgroundSlotsEl.classList.toggle('is-hidden', !settings.useBackgroundTimeline);
    timelineHint.classList.toggle('is-hidden', !settings.useBackgroundTimeline);
    MEDIA_SLOTS.forEach((slot) => {
        const status = document.getElementById(`bg-${slot}-status`);
        const media = settings.backgroundSlots[slot];
        status.textContent = media ? media.name : (slot === 'default' ? 'Default' : `Uses ${resolveBackgroundSlot() || 'default'}`);
    });
    updateBackgroundPreview();
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

togBackgroundTimeline.addEventListener('change', async () => {
    settings.useBackgroundTimeline = togBackgroundTimeline.checked;
    saveSettings();
    await applyBackground();
    syncSettingsPanel();
});

MEDIA_SLOTS.forEach((slot) => {
    const input = document.getElementById(`bg-${slot}`);
    input.addEventListener('change', async () => {
        const [file] = input.files;
        if (!file) return;
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;

        try {
            await backgroundDb('put', slot, file);
            settings.backgroundSlots[slot] = { name: file.name, type: file.type };
            saveSettings();
            syncSettingsPanel();
            await applyBackground();
            await updateBackgroundPreview();
        } catch {
            document.getElementById(`bg-${slot}-status`).textContent = 'Could not save file';
        } finally {
            input.value = '';
        }
    });
});

settingsReset.addEventListener('click', async () => {
    await Promise.all(MEDIA_SLOTS.map((slot) => backgroundDb('delete', slot)));
    settings = { ...DEFAULT_SETTINGS, backgroundSlots: {} };
    saveSettings();
    pomoReset();
    restoreDefaultBackground();
    applySettings();
    updateBackgroundPreview();
});

// ===== Init =====
resumePomo();
applySettings();
applyBackground();
updateBackgroundPreview();

// Keep greeting accurate as the day progresses
setInterval(() => {
    const activeSlot = resolveBackgroundSlot();
    if (activeSlot !== appliedBackgroundSlot) applyBackground();
    if (!settings.showGreeting) return;
    const word = getGreetingWord();
    greetingEl.textContent = settings.name ? `${word}, ${settings.name}` : word;
}, 60000);
