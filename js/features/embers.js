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
