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
