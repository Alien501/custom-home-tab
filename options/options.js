// ===== Extensible Options Configuration =====
const TABS = [
    {
        id: 'general',
        text: 'General',
        fields: [
            {
                type: 'text',
                key: 'name',
                label: 'Your Name',
                placeholder: 'Add your name',
                maxlength: 24,
                normalize: true,
            },
            {
                type: 'text',
                key: 'tabTitle',
                label: 'Tab Title',
                placeholder: 'Custom Home tab - By Alien501',
                maxlength: 60,
                hint: 'Shown in the browser tab. Falls back to your name, then "Custom Home tab - By Alien501".',
                normalize: true,
            },
            {
                type: 'text',
                key: 'focus',
                label: "Today's Focus",
                placeholder: 'What matters most today?',
                maxlength: 80,
            },
            {
                type: 'accent-swatches',
                label: 'Accent Colour',
            },
        ],
    },
    {
        id: 'media',
        text: 'Media',
        fields: [
            {
                type: 'background-media',
                label: 'Background Media',
            },
            {
                type: 'text',
                key: 'spotifyToken',
                label: 'Spotify UID',
                placeholder: 'spotify-github-profile UID',
                hint: 'From <a href="https://github.com/kittinan/spotify-github-profile" target="_blank" rel="noopener noreferrer">spotify-github-profile</a>. Leave blank to hide the widget.',
                normalize: true,
            },
        ],
    },
    {
        id: 'config',
        text: 'Config',
        fields: [
            {
                type: 'number-group',
                label: 'Pomodoro lengths (min)',
                items: [
                    { key: 'focusLen', label: 'Focus', min: 1, max: 120, default: 25 },
                    { key: 'breakLen', label: 'Break', min: 1, max: 60, default: 5 },
                ],
            },
            {
                type: 'toggles',
                label: 'Show',
                items: [
                    { key: "enableParallax", label: "Enable Parallax"},
                    { key: 'showSeconds', label: 'Seconds on clock' },
                    { key: 'showGreeting', label: 'Greeting' },
                    { key: 'showQuote', label: 'Daily quote' },
                    { key: 'showPomodoro', label: 'Pomodoro timer' },
                    { key: 'showEmbers', label: 'Ambient embers' },
                    { key: 'showSpotify', label: 'Spotify status' },
                ],
            },
            {
                type: 'reset-defaults',
            },
        ],
    },
    {
        id: 'about',
        text: 'About',
        fields: [
            {
                type: 'about-card',
            },
        ],
    },
];

// References
const tabWrapper = document.getElementById('options-tab-wrapper');
const contentWrapper = document.getElementById('options-content-wrapper');
const tabIndicator = document.getElementById('tab-indicator');

// ===== Render Tabs =====
function renderTabs(tabs) {
    const html = tabs.map((tab, i) => `
        <input type="radio" ${i === 0 ? 'checked' : ''} name="tab" id="tab-${tab.id}" class="tab" data-index="${i}" data-tab="${tab.id}" />
        <label class="tab_label ${i === 0 ? 'active' : ''}" for="tab-${tab.id}" data-index="${i}">${tab.text}</label>
    `).join('');

    tabWrapper.insertAdjacentHTML('afterbegin', html);

    tabWrapper.querySelectorAll('.tab').forEach((radio) => {
        radio.addEventListener('change', () => {
            const index = Number(radio.dataset.index);
            switchTab(index, radio.dataset.tab);
        });
    });

    tabWrapper.querySelectorAll('.tab_label').forEach((label) => {
        label.addEventListener('click', () => {
            const index = Number(label.dataset.index);
            const radio = document.getElementById(label.getAttribute('for'));
            if (radio) radio.checked = true;
            switchTab(index, radio ? radio.dataset.tab : tabs[index].id);
        });
    });
}

function switchTab(index, tabId) {
    // Slide indicator dynamically based on tab index
    if (tabIndicator) {
        tabIndicator.style.left = `${index * 80 + 2}px`;
    }

    // Toggle active label
    tabWrapper.querySelectorAll('.tab_label').forEach((lbl, i) => {
        lbl.classList.toggle('active', i === index);
    });

    // Toggle active panel
    contentWrapper.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });
}

// ===== Render Field Types =====
function renderTextField(field) {
    const section = document.createElement('div');
    section.className = 'options-section';

    const label = document.createElement('label');
    label.className = 'options-label';
    label.htmlFor = `opt-${field.key}`;
    label.textContent = field.label;
    section.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `opt-${field.key}`;
    input.className = 'options-input';
    input.placeholder = field.placeholder || '';
    if (field.maxlength) input.maxLength = field.maxlength;
    input.value = settings[field.key] || '';

    input.addEventListener('input', () => {
        settings[field.key] = input.value;
        saveSettings();
    });

    if (field.normalize) {
        input.addEventListener('blur', () => {
            settings[field.key] = normaliseString(settings[field.key]);
            input.value = settings[field.key];
            saveSettings();
        });
    }

    section.appendChild(input);

    if (field.hint) {
        const hint = document.createElement('p');
        hint.className = 'options-hint';
        hint.innerHTML = field.hint;
        section.appendChild(hint);
    }

    return section;
}

function renderAccentSwatches(field) {
    const section = document.createElement('div');
    section.className = 'options-section';

    const label = document.createElement('span');
    label.className = 'options-label';
    label.textContent = field.label;
    section.appendChild(label);

    const swatchesContainer = document.createElement('div');
    swatchesContainer.className = 'accent-swatches';
    swatchesContainer.id = 'accent-swatches';

    ACCENTS.forEach((accent) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `accent-swatch ${accent.color === settings.accent ? 'active' : ''}`;
        btn.style.backgroundColor = accent.color;
        btn.title = accent.name;
        btn.dataset.color = accent.color;

        btn.addEventListener('click', () => {
            settings.accent = accent.color;
            saveSettings();
            document.documentElement.style.setProperty('--color-orange', accent.color);
            swatchesContainer.querySelectorAll('.accent-swatch').forEach((s) => {
                s.classList.toggle('active', s.dataset.color === accent.color);
            });
        });

        swatchesContainer.appendChild(btn);
    });

    section.appendChild(swatchesContainer);
    return section;
}

function renderNumberGroup(field) {
    const section = document.createElement('div');
    section.className = 'options-section';

    const title = document.createElement('span');
    title.className = 'options-label';
    title.textContent = field.label;
    section.appendChild(title);

    const group = document.createElement('div');
    group.className = 'pomo-lengths';

    field.items.forEach((item) => {
        const label = document.createElement('label');
        label.textContent = item.label;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `opt-${item.key}`;
        input.className = 'options-input pomo-num';
        input.min = item.min;
        input.max = item.max;
        input.value = settings[item.key] ?? item.default;

        input.addEventListener('change', () => {
            const val = Math.min(item.max, Math.max(item.min, parseInt(input.value) || item.default));
            input.value = val;
            settings[item.key] = val;
            saveSettings();

            // Update pomo remaining time if timer is idle
            try {
                const stored = JSON.parse(localStorage.getItem('pomodoroState'));
                if (stored && !stored.running) {
                    if (item.key === 'focusLen' && stored.mode === 'focus') stored.remaining = val * 60;
                    if (item.key === 'breakLen' && stored.mode === 'break') stored.remaining = val * 60;
                    localStorage.setItem('pomodoroState', JSON.stringify(stored));
                }
            } catch {}
        });

        label.appendChild(input);
        group.appendChild(label);
    });

    section.appendChild(group);
    return section;
}

function renderToggles(field) {
    const section = document.createElement('div');
    section.className = 'options-section';

    if (field.label) {
        const title = document.createElement('span');
        title.className = 'options-label';
        title.textContent = field.label;
        section.appendChild(title);
    }

    field.items.forEach((item) => {
        const row = document.createElement('label');
        row.className = 'toggle-row';

        const span = document.createElement('span');
        span.textContent = item.label;
        row.appendChild(span);

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = `opt-${item.key}`;
        toggle.className = 'toggle';
        toggle.checked = Boolean(settings[item.key]);

        toggle.addEventListener('change', () => {
            settings[item.key] = toggle.checked;
            saveSettings();
        });

        row.appendChild(toggle);
        section.appendChild(row);
    });

    return section;
}

function renderBackgroundMedia(field) {
    const section = document.createElement('div');
    section.className = 'options-section';

    const title = document.createElement('span');
    title.className = 'options-label';
    title.textContent = field.label;
    section.appendChild(title);

    // Media container (preview + default slot)
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'background-media-settings';

    const preview = document.createElement('div');
    preview.className = 'background-preview';
    preview.id = 'bg-preview';
    mediaContainer.appendChild(preview);

    const currentMedia = document.createElement('div');
    currentMedia.className = 'background-current';

    const currentLabel = document.createElement('span');
    currentLabel.className = 'options-label';
    currentLabel.textContent = 'Current media';
    currentMedia.appendChild(currentLabel);

    const currentHint = document.createElement('p');
    currentHint.className = 'options-hint';
    currentHint.textContent = 'Upload an image, GIF, or video.';
    currentMedia.appendChild(currentHint);

    const defaultSlot = document.createElement('label');
    defaultSlot.className = 'background-slot';
    defaultSlot.innerHTML = `
        <span>Update</span>
        <input type="file" id="bg-default" accept="image/*,video/*">
        <small id="bg-default-status">Default</small>
    `;
    currentMedia.appendChild(defaultSlot);
    mediaContainer.appendChild(currentMedia);
    section.appendChild(mediaContainer);

    // Timeline toggle
    const timelineLabel = document.createElement('label');
    timelineLabel.className = 'toggle-row background-timeline-toggle';
    timelineLabel.innerHTML = `
        <span>Use timeline</span>
        <input type="checkbox" id="tog-background-timeline" class="toggle" ${settings.useBackgroundTimeline ? 'checked' : ''}>
    `;
    section.appendChild(timelineLabel);

    const timelineHint = document.createElement('p');
    timelineHint.className = `options-hint timeline-hint ${settings.useBackgroundTimeline ? '' : 'is-hidden'}`;
    timelineHint.textContent = 'Empty periods use the media from the previous period.';
    section.appendChild(timelineHint);

    // Slots container
    const slotsEl = document.createElement('div');
    slotsEl.className = `background-slots ${settings.useBackgroundTimeline ? '' : 'is-hidden'}`;
    slotsEl.id = 'background-slots';

    BACKGROUND_SLOTS.forEach((slot) => {
        const slotRow = document.createElement('label');
        slotRow.className = 'background-slot';
        const labelName = slot.charAt(0).toUpperCase() + slot.slice(1);
        slotRow.innerHTML = `
            <span>${labelName}</span>
            <input type="file" id="bg-${slot}" accept="image/*,video/*">
            <small id="bg-${slot}-status">Default</small>
        `;
        slotsEl.appendChild(slotRow);
    });
    section.appendChild(slotsEl);

    // Wire timeline toggle
    const togTimeline = timelineLabel.querySelector('#tog-background-timeline');
    togTimeline.addEventListener('change', async () => {
        settings.useBackgroundTimeline = togTimeline.checked;
        saveSettings();
        slotsEl.classList.toggle('is-hidden', !settings.useBackgroundTimeline);
        timelineHint.classList.toggle('is-hidden', !settings.useBackgroundTimeline);
        updateBackgroundPreview();
        syncSlotStatuses();
    });

    // Wire file inputs for all media slots
    MEDIA_SLOTS.forEach((slot) => {
        const input = section.querySelector(`#bg-${slot}`);
        if (!input) return;

        input.addEventListener('change', async () => {
            const [file] = input.files;
            if (!file) return;
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;

            try {
                await backgroundDb('put', slot, file);
                settings.backgroundSlots = settings.backgroundSlots || {};
                settings.backgroundSlots[slot] = { name: file.name, type: file.type };
                saveSettings();
                syncSlotStatuses();
                await updateBackgroundPreview();
            } catch {
                const status = section.querySelector(`#bg-${slot}-status`);
                if (status) status.textContent = 'Could not save file';
            } finally {
                input.value = '';
            }
        });
    });

    return section;
}

function syncSlotStatuses() {
    MEDIA_SLOTS.forEach((slot) => {
        const status = document.getElementById(`bg-${slot}-status`);
        if (!status) return;
        const media = settings.backgroundSlots?.[slot];
        status.textContent = media ? media.name : (slot === 'default' ? 'Default' : `Uses ${resolveBackgroundSlot() || 'default'}`);
    });
}

function renderResetDefaults() {
    const section = document.createElement('div');
    section.className = 'options-section';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'settings-reset';
    btn.id = 'settings-reset';
    btn.textContent = 'Reset to defaults';

    btn.addEventListener('click', async () => {
        if (!confirm('Reset all settings to default values?')) return;

        try {
            await Promise.all(MEDIA_SLOTS.map((slot) => backgroundDb('delete', slot)));
        } catch {}

        settings = { ...DEFAULT_SETTINGS, backgroundSlots: {} };
        saveSettings();
        localStorage.removeItem('pomodoroState');

        document.documentElement.style.setProperty('--color-orange', settings.accent);
        syncAllFields();
    });

    section.appendChild(btn);
    return section;
}

function renderAboutCard() {
    const section = document.createElement('div');
    section.className = 'options-section about-section';

    section.innerHTML = `
        <div class="author-pfp">
            <img src="https://avatars.githubusercontent.com/u/97647867?s=400&u=e66d423a605f8055ce282cd96a3c24000e540ae7&v=4" alt="Alien501">
        </div>
        <p class="options-hint about-intro">Custom Home Tab is a personal project by <a href="https://alien501.in" target="_blank" rel="noopener noreferrer">Alien501</a>.</p>
        <div class="about-links">
            <div class="link-group">
                <a class="about-link" id="link-source-code" href="https://github.com/Alien501/custom-home-tab" target="_blank" rel="noopener noreferrer">Source code ↗</a>
                <a class="about-link" id="link-issue" href="https://github.com/Alien501/custom-home-tab/issues/new" target="_blank" rel="noopener noreferrer">Report a bug ↗</a>
            </div>
            <a class="about-link" href="https://github.com/Alien501" target="_blank" rel="noopener noreferrer">Developer profile ↗</a>
            <a class="about-link" id="buy-me-coffe" href="https://buymeacoffee.com/alien501" target="_blank" rel="noopener noreferrer">Buy me a coffee ☕</a>
        </div>
    `;

    return section;
}

// ===== Render All Panels =====
function renderPanels(tabs) {
    contentWrapper.innerHTML = '';

    tabs.forEach((tab, index) => {
        const panel = document.createElement('div');
        panel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
        panel.id = `panel-${tab.id}`;

        tab.fields.forEach((field) => {
            switch (field.type) {
                case 'text':
                    panel.appendChild(renderTextField(field));
                    break;
                case 'accent-swatches':
                    panel.appendChild(renderAccentSwatches(field));
                    break;
                case 'number-group':
                    panel.appendChild(renderNumberGroup(field));
                    break;
                case 'toggles':
                    panel.appendChild(renderToggles(field));
                    break;
                case 'background-media':
                    panel.appendChild(renderBackgroundMedia(field));
                    break;
                case 'reset-defaults':
                    panel.appendChild(renderResetDefaults());
                    break;
                case 'about-card':
                    panel.appendChild(renderAboutCard());
                    break;
                default:
                    break;
            }
        });

        contentWrapper.appendChild(panel);
    });
}

// ===== Sync All Fields From State =====
function syncAllFields() {
    TABS.forEach((tab) => {
        tab.fields.forEach((field) => {
            if (field.type === 'text') {
                const input = document.getElementById(`opt-${field.key}`);
                if (input) input.value = settings[field.key] || '';
            } else if (field.type === 'number-group') {
                field.items.forEach((item) => {
                    const input = document.getElementById(`opt-${item.key}`);
                    if (input) input.value = settings[item.key] ?? item.default;
                });
            } else if (field.type === 'toggles') {
                field.items.forEach((item) => {
                    const toggle = document.getElementById(`opt-${item.key}`);
                    if (toggle) toggle.checked = Boolean(settings[item.key]);
                });
            }
        });
    });

    const togTimeline = document.getElementById('tog-background-timeline');
    if (togTimeline) togTimeline.checked = Boolean(settings.useBackgroundTimeline);

    const slotsEl = document.getElementById('background-slots');
    if (slotsEl) slotsEl.classList.toggle('is-hidden', !settings.useBackgroundTimeline);

    const timelineHint = document.querySelector('.timeline-hint');
    if (timelineHint) timelineHint.classList.toggle('is-hidden', !settings.useBackgroundTimeline);

    const swatches = document.querySelectorAll('.accent-swatch');
    swatches.forEach((s) => s.classList.toggle('active', s.dataset.color === settings.accent));

    syncSlotStatuses();
    updateBackgroundPreview();
}

// ===== Initialization =====
function initOptions() {
    document.documentElement.style.setProperty('--color-orange', settings.accent || '#f5c000');
    renderTabs(TABS);
    renderPanels(TABS);
    syncSlotStatuses();
    updateBackgroundPreview();
}

initOptions();