// ===== Settings panel wiring =====
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsClose = document.getElementById('settings-close');
const settingsReset = document.getElementById('settings-reset');
const accentSwatches = document.getElementById('accent-swatches');

const setName = document.getElementById('set-name');
const setTabTitle = document.getElementById('set-tab-title');
const setFocus = document.getElementById('set-focus');
const setFocusLen = document.getElementById('set-focus-len');
const setBreakLen = document.getElementById('set-break-len');
const togGreeting = document.getElementById('tog-greeting');
const togQuote = document.getElementById('tog-quote');
const togPomo = document.getElementById('tog-pomo');
const togEmbers = document.getElementById('tog-embers');
const togSeconds = document.getElementById('tog-seconds');
const togSpotify = document.getElementById('tog-spotify');
const setSpotifyToken = document.getElementById('set-spotify-token');
const togBackgroundTimeline = document.getElementById('tog-background-timeline');
const backgroundSlotsEl = document.getElementById('background-slots');
const timelineHint = document.querySelector('.timeline-hint');

const aboutBtn = document.getElementById('about-btn');
const aboutOverlay = document.getElementById('about-overlay');
const aboutClose = document.getElementById('about-close');

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
    setTabTitle.value = settings.tabTitle;
    setFocus.value = settings.focus;
    setFocusLen.value = settings.focusLen;
    setBreakLen.value = settings.breakLen;
    togGreeting.checked = settings.showGreeting;
    togQuote.checked = settings.showQuote;
    togPomo.checked = settings.showPomodoro;
    togEmbers.checked = settings.showEmbers;
    togSeconds.checked = settings.showSeconds;
    togSpotify.checked = settings.showSpotify;
    setSpotifyToken.value = settings.spotifyToken;
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

// Text fields that allow spaces while typing, normalised (trimmed + collapsed) on blur
const NORMALIZED_INPUTS = { name: setName, spotifyToken: setSpotifyToken, tabTitle: setTabTitle };
KEYS_TO_NORMALIZE.forEach((key) => {
    const input = NORMALIZED_INPUTS[key];
    if (!input) return;
    input.addEventListener('input', () => {
        settings[key] = input.value;
        saveSettings();
        applySettings();
    });
    input.addEventListener('blur', () => {
        settings[key] = normaliseString(settings[key]);
        input.value = settings[key];
        saveSettings();
        applySettings();
    });
});

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
    [togSpotify, 'showSpotify'],
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

function openAbout() {
    aboutOverlay.classList.add('active');
    aboutOverlay.setAttribute('aria-hidden', 'false');
}
function closeAbout() {
    aboutOverlay.classList.remove('active');
    aboutOverlay.setAttribute('aria-hidden', 'true');
}

aboutBtn.addEventListener('click', openAbout);
aboutClose.addEventListener('click', closeAbout);
aboutOverlay.addEventListener('mousedown', (e) => { if (e.target === aboutOverlay) closeAbout(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutOverlay.classList.contains('active')) closeAbout();
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
