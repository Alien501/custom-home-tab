// ===== Spotify status widget =====
const musicContainerEl = document.getElementById('music-container');
const spotifyFrameEl = document.getElementById('spotify-frame');

function spotifyFrameSrc(uid) {
    const params = new URLSearchParams({
        uid,
        cover_image: 'true',
        theme: 'novatorem',
        show_offline: 'true',
        background_color: '1f1f1f',
        interchange: 'true',
        bar_color: '53b14f',
        bar_color_cover: 'false',
    });
    return `https://spotify-github-profile.kittinanx.com/api/view?${params.toString()}`;
}

function applySpotify() {
    const visible = settings.showSpotify && settings.spotifyToken;
    musicContainerEl.classList.toggle('hidden', !visible);
    spotifyFrameEl.src = visible ? spotifyFrameSrc(settings.spotifyToken) : '';
}
