// ===== Settings button & live sync =====
const settingsBtn = document.getElementById('settings-btn');

if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open('options/options.html', '_blank');
        }
    });
}

// Keep page in sync when settings change in options
window.addEventListener('storage', (event) => {
    if (event.key === SETTINGS_KEY) {
        settings = loadSettings();
        applySettings();
        applyBackground();
    }
});

function syncSettingsPanel() {
    // No-op for compatibility
}
