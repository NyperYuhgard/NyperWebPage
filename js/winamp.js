/**
 * NEXUS PLAYER v2.93 - Audio Engine for Nexus OS
 * Funciona de forma independiente y permite conexión de apps externas.
 * Piel clásica estilo Winamp 2.x (base2).
 */

const winampStyles = `
    #winamp-player {
        background: #31304a;
        border: 1px solid #16151f;
        box-shadow: inset 0 0 0 1px #4a4866, 4px 4px 0 rgba(0, 0, 0, 0.5);
    }

    .wa-title {
        background: #232236;
        height: 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 3px;
    }

    .wa-groove {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: repeating-linear-gradient(to bottom,
            #f5e6c4 0 1px, #c9b283 1px 2px, #8a734a 2px 4px, #3a3226 4px 6px);
    }

    .wa-title-text {
        color: #ffffff;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 2px;
        padding: 0 2px;
    }

    .wa-dot {
        width: 9px; height: 9px;
        border-radius: 50%;
        background: #c9c4b8;
        border: 1px solid #16151f;
        cursor: pointer;
    }
    .wa-dot.alt { background: #8a8678; }

    .wa-close {
        width: 14px; height: 12px;
        background: #e09040;
        border: 1px solid #16151f;
        color: #232236;
        font-size: 9px;
        font-weight: 900;
        line-height: 10px;
        text-align: center;
        cursor: pointer;
    }
    .wa-close:hover { background: #ff5030; color: #fff; }

    .wa-lcd {
        background: #0c0c0c;
        border: 1px solid #16151f;
        box-shadow: inset 0 0 0 1px #4a4866;
    }

    .winamp-display-text {
        color: #12fa12;
        font-family: 'VT323', 'Courier New', monospace;
        text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
    }

    .wa-viz-wrap { position: relative; }
    .wa-oaidu {
        position: absolute;
        left: 1px; top: 3px;
        color: #3a3a3a;
        font-size: 7px;
        line-height: 7px;
        font-family: Verdana, sans-serif;
        font-weight: bold;
    }

    .wa-seek, .wa-volume {
        position: relative;
        height: 10px;
        background: #16151f;
        border: 1px solid #4a4866;
        cursor: pointer;
    }
    #w-progress {
        position: absolute;
        top: 1px; bottom: 1px; left: 1px;
        width: 0%;
        background: linear-gradient(to bottom, #ffc080, #ff8820 45%, #a04c00);
    }
    #w-volfill {
        position: absolute;
        top: 1px; bottom: 1px; left: 1px;
        width: 70%;
        background: linear-gradient(to bottom, #80ff80, #00c000 45%, #006000);
    }

    .wa-mini {
        background: #c8c4bc;
        border-top: 1px solid #f0ece4;
        border-left: 1px solid #f0ece4;
        border-right: 1px solid #6a6860;
        border-bottom: 1px solid #6a6860;
        color: #232236;
        font-size: 7px;
        font-weight: 700;
        padding: 2px 4px;
        cursor: pointer;
        font-family: Verdana, sans-serif;
    }
    .wa-mini::before {
        content: '';
        display: inline-block;
        width: 4px; height: 4px;
        background: #12fa12;
        box-shadow: 0 0 3px #12fa12;
        margin-right: 3px;
        opacity: 0.25;
    }
    .wa-mini.on::before { opacity: 1; }

    .wa-tbtn {
        flex: 1;
        height: 22px;
        background: #c8c4bc;
        border-top: 2px solid #f0ece4;
        border-left: 2px solid #f0ece4;
        border-right: 2px solid #6a6860;
        border-bottom: 2px solid #6a6860;
        color: #232236;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .wa-tbtn:active, .wa-tbtn.active {
        border-top: 2px solid #6a6860;
        border-left: 2px solid #6a6860;
        border-right: 2px solid #f0ece4;
        border-bottom: 2px solid #f0ece4;
        background: #b8b4ac;
    }

    .wa-logo {
        color: #ff8820;
        text-shadow: 1px 1px 0 #a04c00;
        font-size: 18px;
        transform: rotate(-20deg);
    }

    .w-marquee-container {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
    .w-marquee-content {
        display: inline-block;
        padding-left: 100%;
        animation: w-marquee 10s linear infinite;
    }
    @keyframes w-marquee {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-100%, 0); }
    }
`;

// --- CONFIGURACIÓN DE TU MÚSICA ---
const playlist = [
    { name: "Split Ex But Metro And Retro Sings", url: "musica/SplitEx-MetroCover.mp3" },
    { name: "Crash Bandicoot Retro Hijinx Title Screen Extended", url: "musica/CBRH-Title.mp3" },
    { name: "Hora de demostrar-Jet Stingray Stage - Crash Bandicoot Remix", url: "musica/HDD.mp3" },
    { name: "Mystic Cave 2P Remix Sonic 2 HD", url: "musica/MCZ2P.mp3" },
    { name: "Space Mind Control-Spell Theo Mix", url: "musica/SMC.mp3" }
];

let currentTrack = 0;
let shuffleOn = false;
let repeatOn = false;
const audio = new Audio();
// IMPORTANTE: Solo activar anonymous si el servidor lo soporta.
// Si da problemas de silencio, el juego de ritmo usará un modo de compatibilidad.
// audio.crossOrigin = "anonymous";

audio.src = playlist[currentTrack].url;
audio.volume = 0.7;
window.nexusMainAudio = audio;

function initWinamp() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = winampStyles;
    document.head.appendChild(styleSheet);

    const player = document.createElement('div');
    player.id = 'winamp-player';
    player.className = 'fixed bottom-24 right-6 w-72 z-[60] select-none';
    player.innerHTML = `
        <div id="winamp-handle" class="wa-title cursor-move">
            <span class="wa-groove"></span>
            <span class="wa-title-text">NEXUSAMP</span>
            <span class="wa-groove"></span>
            <span class="wa-dot alt" title="Shade"></span>
            <span class="wa-dot" title="Mini"></span>
            <span class="wa-close" onclick="minimizeWinamp()">×</span>
        </div>
        <div class="p-1">
            <div class="flex gap-1">
                <div class="wa-viz-wrap wa-lcd">
                    <span class="wa-oaidu">O<br>A<br>I<br>D<br>U</span>
                    <canvas id="w-viz" width="100" height="36" class="block"></canvas>
                </div>
                <div class="wa-lcd flex-1 px-2 py-1 overflow-hidden">
                    <div class="w-marquee-container">
                        <div id="w-title" class="winamp-display-text w-marquee-content text-[13px] leading-tight">${playlist[currentTrack].name}</div>
                    </div>
                    <div class="flex items-baseline justify-between">
                        <span id="w-time" class="winamp-display-text text-[18px] leading-none">0:00</span>
                        <span class="winamp-display-text text-[11px]">192kbps 44khz</span>
                        <span id="w-tracknum" class="winamp-display-text text-[14px]">1.</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 mt-1">
                <div class="wa-seek flex-1" id="w-seek"><div id="w-progress"></div></div>
                <div class="wa-volume w-16" id="w-volume"><div id="w-volfill"></div></div>
                <button class="wa-mini" title="Ecualizador">EQ</button>
                <button class="wa-mini on" title="Playlist">PL</button>
            </div>
            <div class="flex gap-1 mt-1">
                <button onclick="prevTrack()" class="wa-tbtn" title="Anterior">|◀</button>
                <button onclick="togglePlay()" id="btn-play" class="wa-tbtn" title="Play/Pausa">▶</button>
                <button onclick="audio.pause()" class="wa-tbtn" title="Pausa">❚❚</button>
                <button onclick="stopTrack()" class="wa-tbtn" title="Stop">■</button>
                <button onclick="nextTrack()" class="wa-tbtn" title="Siguiente">▶|</button>
                <button onclick="toggleShuffle()" id="btn-shuffle" class="wa-mini self-stretch" title="Aleatorio">SHUFFLE</button>
                <button onclick="toggleRepeat()" id="btn-repeat" class="wa-mini self-stretch" title="Repetir">LOOP</button>
                <span class="wa-logo self-center px-1">⚡</span>
            </div>
        </div>
    `;
    document.body.appendChild(player);

    audio.ontimeupdate = () => {
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const timeDisplay = document.getElementById('w-time');
        if(timeDisplay) timeDisplay.innerText = `${mins}:${secs}`;

        const progress = document.getElementById('w-progress');
        const percent = (audio.currentTime / audio.duration) * 100;
        if(progress) progress.style.width = (percent || 0) + "%";
    };

    audio.onended = () => {
        if (repeatOn) {
            audio.currentTime = 0;
            audio.play();
            return;
        }
        nextTrack();
    };

    document.getElementById('w-seek').onclick = (e) => {
        if (!audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    };

    document.getElementById('w-volume').onclick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        audio.volume = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        document.getElementById('w-volfill').style.width = (audio.volume * 100) + '%';
    };

    setupViz();
    setupDraggable(player);
}

function setupViz() {
    const canvas = document.getElementById('w-viz');
    const ctx = canvas.getContext('2d');
    const bars = Array(12).fill(1);

    const draw = () => {
        ctx.fillStyle = '#0c0c0c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#12fa12';
        bars.forEach((h, i) => {
            const target = audio.paused ? 1 : Math.random() * (canvas.height - 8);
            bars[i] = Math.max(target, h * 0.72);
            ctx.fillRect(10 + i * 7.5, canvas.height - 5 - bars[i], 5, bars[i]);
        });
        ctx.fillStyle = '#2060c0';
        for (let x = 8; x < canvas.width; x += 4) ctx.fillRect(x, canvas.height - 4, 2, 2);
        requestAnimationFrame(draw);
    };
    draw();
}

// --- CONTROLES MEJORADOS ---
function togglePlay() {
    const btn = document.getElementById('btn-play');
    if (audio.paused) {
        // Promesa para manejar bloqueos de navegador
        audio.play().catch(err => console.log("Esperando interacción..."));
        btn.classList.add('active');
    } else {
        audio.pause();
        btn.classList.remove('active');
    }
}

function stopTrack() {
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('btn-play').classList.remove('active');
}

function nextTrack() {
    if (shuffleOn && playlist.length > 1) {
        let r;
        do { r = Math.floor(Math.random() * playlist.length); } while (r === currentTrack);
        currentTrack = r;
    } else {
        currentTrack = (currentTrack + 1) % playlist.length;
    }
    loadTrack();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack();
}

function toggleShuffle() {
    shuffleOn = !shuffleOn;
    document.getElementById('btn-shuffle').classList.toggle('on', shuffleOn);
}

function toggleRepeat() {
    repeatOn = !repeatOn;
    document.getElementById('btn-repeat').classList.toggle('on', repeatOn);
}

function loadTrack() {
    audio.src = playlist[currentTrack].url;
    const titleEl = document.getElementById('w-title');
    if(titleEl) {
        titleEl.classList.remove('w-marquee-content');
        void titleEl.offsetWidth;
        titleEl.classList.add('w-marquee-content');
        titleEl.innerText = playlist[currentTrack].name;
    }
    const numEl = document.getElementById('w-tracknum');
    if(numEl) numEl.innerText = (currentTrack + 1) + '.';
    audio.play();
    document.getElementById('btn-play').classList.add('active');
}

function minimizeWinamp() {
    document.getElementById('winamp-player').style.display = 'none';
    const taskButton = document.getElementById('task-nexus');
    if (taskButton) taskButton.style.display = 'flex';
}

function setupDraggable(el) {
    let isDragging = false; let offset = [0, 0];
    const handle = document.getElementById('winamp-handle');
    handle.onmousedown = (e) => {
        isDragging = true;
        offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
    };
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        el.style.left = (e.clientX + offset[0]) + 'px';
        el.style.top = (e.clientY + offset[1]) + 'px';
        el.style.bottom = 'auto'; el.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => isDragging = false);
}

document.addEventListener('DOMContentLoaded', initWinamp);
