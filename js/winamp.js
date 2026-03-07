/**
 * NEXUS PLAYER v2.93 - Audio Engine for Nexus OS
 * Funciona de forma independiente y permite conexión de apps externas.
 */

const winampStyles = `
    .winamp-btn {
        background: #c0c0c0;
        border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
        border-right: 2px solid #404040; border-bottom: 2px solid #404040;
        color: black; font-size: 8px; font-weight: bold;
        padding: 4px 6px; flex: 1; text-align: center; cursor: pointer;
    }
    .winamp-btn:active, .winamp-btn.active {
        border-top: 2px solid #404040; border-left: 2px solid #404040;
        border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;
        background: #b0b0b0;
    }
    .winamp-display-text {
        color: #00ff00; font-family: 'Courier New', monospace;
        text-shadow: 0 0 5px rgba(0,255,0,0.5);
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
const audio = new Audio();
// IMPORTANTE: Solo activar anonymous si el servidor lo soporta. 
// Si da problemas de silencio, el juego de ritmo usará un modo de compatibilidad.
// audio.crossOrigin = "anonymous"; 

audio.src = playlist[currentTrack].url;
window.nexusMainAudio = audio;

function initWinamp() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = winampStyles;
    document.head.appendChild(styleSheet);

    const player = document.createElement('div');
    player.id = 'winamp-player';
    player.className = 'fixed bottom-24 right-6 w-72 bg-[#2a2a2a] border-2 border-[#4a4a4a] shadow-[4px_4px_0px_#000] p-2 z-[60] select-none';
    player.innerHTML = `
        <div id="winamp-handle" class="bg-gradient-to-r from-[#000080] to-[#080808] text-[10px] px-2 py-1 flex justify-between items-center cursor-move border-b border-[#1a1a1a]">
            <span class="text-white tracking-widest font-bold uppercase italic">NexusPlayer 2.93</span>
            <button onclick="minimizeWinamp()" class="w-3 h-3 bg-[#c0c0c0] text-black flex items-center justify-center text-[8px] border border-black font-bold hover:bg-red-500 hover:text-white transition-colors">X</button>
        </div>
        <div class="bg-black p-2 mt-1 border border-[#3a3a3a] flex gap-3 h-16">
            <div id="w-time" class="winamp-display-text text-xl font-bold flex items-center italic">00:00</div>
            <div class="flex-1 flex flex-col justify-center overflow-hidden text-[9px]">
                <div class="w-marquee-container">
                    <div id="w-title" class="winamp-display-text w-marquee-content">${playlist[currentTrack].name}</div>
                </div>
                <div class="w-full bg-[#1a1a1a] h-1 mt-1 border border-[#3a3a3a]">
                    <div id="w-progress" class="h-full bg-blue-600" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <div class="flex justify-between mt-2 gap-1">
            <button onclick="prevTrack()" class="winamp-btn">PREV</button>
            <button onclick="togglePlay()" id="btn-play" class="winamp-btn font-black">PLAY</button>
            <button onclick="audio.pause()" class="winamp-btn">PAUSE</button>
            <button onclick="stopTrack()" class="winamp-btn">STOP</button>
            <button onclick="nextTrack()" class="winamp-btn">NEXT</button>
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

    audio.onended = () => nextTrack();
    setupDraggable(player);
}

// --- CONTROLES MEJORADOS ---
function togglePlay() {
    if (audio.paused) {
        // Promesa para manejar bloqueos de navegador
        audio.play().catch(err => console.log("Esperando interacción..."));
        document.getElementById('btn-play').innerText = "PLAYING";
    } else {
        audio.pause();
        document.getElementById('btn-play').innerText = "PLAY";
    }
}

function stopTrack() {
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('btn-play').innerText = "PLAY";
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack();
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
    audio.play();
    document.getElementById('btn-play').innerText = "PLAYING";
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
