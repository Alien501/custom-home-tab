// ===== Background media =====
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
    if (!preview) return;
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
