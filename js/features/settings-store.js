// ===== Settings store =====
const SETTINGS_KEY = 'dashboardSettings';

const DEFAULT_SETTINGS = {
    name: '',
    tabTitle: '',
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
    spotifyToken: "",
    showSpotify: false
};

const KEYS_TO_NORMALIZE = ['name', 'spotifyToken', 'tabTitle']

const ACCENTS = [
    { name: 'Gold', color: '#f5c000' },
    { name: "Cloud Dancer", color: "#F0EEE9"},
    { name: 'Ember', color: '#ff7849' },
    { name: 'Rose', color: '#ff5b8a' },
    { name: 'Lilac', color: '#c879ff' },
    { name: 'Sky', color: '#5b9dff' },
    { name: 'Mint', color: '#4fd39a' },
];

function normaliseString(string) {
    return string ? string.trim().replace(/\s+/g, ' ') : string;
}

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
