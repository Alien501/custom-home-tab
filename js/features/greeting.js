// ===== DOM refs =====
const greetingEl = document.getElementById('greeting');
const focusLineEl = document.getElementById('focus-line');
const dailyQuote = QUOTES[dayOfYear() % QUOTES.length];

// ===== Apply settings to the UI =====
function applySettings() {
    document.documentElement.style.setProperty('--color-orange', settings.accent);
    document.title = settings.tabTitle || settings.name || 'Custom Home tab - By Alien501';

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

    applySpotify();

    if (typeof applyParallax === 'function') applyParallax();

    if (typeof syncSettingsPanel === 'function') syncSettingsPanel();
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
