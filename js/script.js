// --- VARIABLES GLOBALES ---
let matrixInterval = null;
let typedKeys = ""; 
const helpMessages = [
    "Pulsa ? para pedir ayuda",
    "Has intentado apagarlo y volverlo a encender",
    "Lo siento, hoy no hay ayuda",
    "Comunícate con Nyper Yuhgard para más información",
    "Removed Herobrine"
];

// --- GESTIÓN DE TEMAS ---
function setTheme(themeName) {
    document.body.classList.remove('theme-win2k', 'theme-matrix', 'theme-winxp');
    const canvas = document.getElementById('matrixCanvas');
    
    if (themeName === 'theme-matrix') {
        document.body.classList.add('theme-matrix');
        canvas.classList.remove('hidden');
        startMatrixEffect();
    } else {
        canvas.classList.add('hidden');
        stopMatrixEffect();
        if (themeName !== 'default') document.body.classList.add(themeName);
    }
    localStorage.setItem('selected-theme', themeName);
}

// --- EFECTO MATRIX ---
function startMatrixEffect() {
    if (matrixInterval) return;
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
    const fontSize = 16;
    const drops = Array(Math.floor(canvas.width / fontSize)).fill(1);

    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00FF41";
        ctx.font = fontSize + "px monospace";

        drops.forEach((y, i) => {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 35);
}

function stopMatrixEffect() {
    clearInterval(matrixInterval);
    matrixInterval = null;
}

// --- EASTER EGG (HELP) ---
window.addEventListener('keydown', (e) => {
    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-4);
    if (typedKeys === "help") {
        const msg = helpMessages[Math.floor(Math.random() * helpMessages.length)];
        const toast = document.createElement('div');
        toast.className = "fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-black/90 border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-xl font-mono shadow-2xl animate-bounce text-center min-w-[300px]";
        toast.innerHTML = `<span class="text-white font-bold">[SYSTEM]</span><br>${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.8s';
            setTimeout(() => toast.remove(), 800);
        }, 3500);
        typedKeys = "";
    }
});

// --- MODALES ---
function openModal(key) {
    const cat = categories[key];
    const content = document.getElementById('modalContent');
    let listHTML = `
        <div class="rounded-xl overflow-hidden mb-6 border border-white/10">
            <img src="${cat.mainImg}" class="w-full h-48 object-cover">
        </div>
        <h2 class="text-3xl font-bold text-blue-400 mb-2">${cat.title}</h2>
        <p class="text-gray-400 text-sm mb-8">${cat.desc}</p>
        <div class="space-y-3">
    `;
    cat.items.forEach(item => {
        listHTML += `
            <a href="${item.link}" target="_blank" class="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-blue-500/20 border border-white/5 transition group">
                <div class="flex flex-col">
                    <span class="font-bold text-gray-200 group-hover:text-blue-400">${item.name}</span>
                    <span class="text-[9px] uppercase tracking-tighter text-gray-500 font-mono italic">${item.tag}</span>
                </div>
                <i class="fas fa-arrow-right text-xs text-gray-700 group-hover:translate-x-1 transition group-hover:text-blue-400"></i>
            </a>
        `;
    });
    content.innerHTML = listHTML + `</div>`;
    document.getElementById('projectModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// --- INICIALIZACIÓN ---
window.onload = () => {
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) setTheme(savedTheme);
};

window.onresize = () => {
    const canvas = document.getElementById('matrixCanvas');
    if (canvas && !canvas.classList.contains('hidden')) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
};

window.onclick = (e) => { if (e.target.id === 'projectModal') closeModal(); }
