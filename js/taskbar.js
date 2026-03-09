const taskbarStyles = `
    :root {
        --tb-bg: #c0c0c0;
        --tb-border-light: #ffffff;
        --tb-border-dark: #404040;
        --tb-text: #000000;
        --start-bg: #000080;
    }

    /* --- CAPA NEON ESTABLE --- */
    body.neon-active::after {
        content: "";
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        backdrop-filter: hue-rotate(90deg) contrast(1.2);
        z-index: 9999;
    }

    body.theme-win2k { --tb-bg: #d4d0c8; --tb-text: #000; --start-bg: #000080; }
    body.theme-winxp { --tb-bg: #245edb; --tb-text: #fff; --start-bg: #388e3c; }
    body.theme-matrix { --tb-bg: #000; --tb-text: #0f0; --tb-border-light: #0f0; --tb-border-dark: #050; --start-bg: #050; }

    #nexus-taskbar {
        position: fixed;
        bottom: 0; left: 0;
        width: 100%; height: 40px;
        background: var(--tb-bg);
        border-top: 2px solid var(--tb-border-light);
        display: flex; align-items: center;
        padding: 2px 10px;
        z-index: 1000;
        box-shadow: inset 1px 1px 0 var(--tb-border-light);
    }

    .start-button {
        background: var(--start-bg);
        color: white;
        border: 2px solid;
        border-color: var(--tb-border-light) var(--tb-border-dark) var(--tb-border-dark) var(--tb-border-light);
        padding: 2px 12px;
        font-weight: bold;
        font-style: italic;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    #task-nexus {
        display: none;
        background: var(--tb-bg);
        border: 2px solid;
        border-color: var(--tb-border-light) var(--tb-border-dark) var(--tb-border-dark) var(--tb-border-light);
        color: var(--tb-text);
        padding: 2px 10px;
        font-size: 11px;
        min-width: 120px;
        cursor: pointer;
    }

    #nexus-clock-tray {
        margin-left: auto;
        padding: 2px 8px;
        border: 2px solid;
        border-color: var(--tb-border-dark) var(--tb-border-light) var(--tb-border-light) var(--tb-border-dark);
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        color: var(--tb-text);
        min-width: 60px;
        text-align: center;
    }

    #start-menu {
        position: fixed;
        bottom: 40px; left: 0;
        width: 240px;
        background: var(--tb-bg);
        border: 2px solid var(--tb-border-light);
        display: none;
        flex-direction: column;
        z-index: 1001;
        box-shadow: 2px -2px 10px rgba(0,0,0,0.5);
    }

    .start-menu-item {
        padding: 8px 15px;
        color: var(--tb-text);
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .start-menu-item:hover {
        background: var(--start-bg);
        color: white;
    }

    .theme-submenu {
        display: none;
        flex-direction: column;
        background: rgba(0,0,0,0.05);
        border-left: 2px solid var(--start-bg);
        margin-left: 10px;
    }

    .start-sidebar {
        width: 25px;
        background: linear-gradient(to top, #000080, #1cb5e0);
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        color: white; font-weight: bold;
        padding: 10px 5px; text-align: center;
    }

    #nexus-terminal {
        position: fixed;
        top: 20%; left: 20%;
        width: 500px; height: 300px;
        background: #000;
        border: 2px solid var(--tb-border-light);
        display: none;
        flex-direction: column;
        z-index: 2000;
        box-shadow: 10px 10px 0 rgba(0,0,0,0.3);
    }
    #term-header {
        background: var(--start-bg);
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        cursor: move;
        user-select: none;
    }
    #term-body {
        flex-grow: 1;
        padding: 10px;
        color: #0f0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        overflow-y: auto;
    }
    #term-input-line {
        display: flex;
        gap: 5px;
    }
    #term-input {
        background: transparent;
        border: none;
        color: #0f0;
        font-family: inherit;
        font-size: inherit;
        outline: none;
        flex-grow: 1;
    }
`;

function initTaskbar() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = taskbarStyles;
    document.head.appendChild(styleSheet);

    const bar = document.createElement('div');
    bar.id = 'nexus-taskbar';
    bar.innerHTML = `
        <button class="start-button" id="start-btn-trigger">
            <i class="fas fa-compact-disc"></i> NEXUS
        </button>
        <div style="width: 2px; height: 80%; background: #404040; margin: 0 10px; border-right: 1px solid #fff;"></div>
        <div id="task-nexus" onclick="restoreWinampFromTaskbar()">
            <i class="fas fa-music"></i> NexusPlayer
        </div>
        
        <div id="nexus-clock-tray">
            <span id="nexus-clock">00:00</span>
        </div>
        
        <div id="start-menu">
            <div class="flex">
                <div class="start-sidebar">NEXUS OS</div>
                <div class="flex-grow">
                    <div class="start-menu-item" onclick="toggleTerminal()">
                        <i class="fas fa-terminal"></i> Terminal
                    </div>
                    <div class="start-menu-item" onclick="alert('Nyper: Dragon-Fox Maker')">
                        <i class="fas fa-paw"></i> Fursona Info
                    </div>
                    <div class="start-menu-item" onclick="toggleCRT()">
                        <i class="fas fa-monitor"></i> Modo CRT
                    </div>
                    
                    <hr class="border-gray-400 my-1">
                    
                    <div class="start-menu-item" onclick="toggleThemeSubmenu()">
                        <i class="fas fa-paint-roller"></i> Cambiar Tema...
                    </div>
                    <div id="theme-links" class="theme-submenu">
                        <div class="start-menu-item" onclick="setTheme('default')">○ Original</div>
                        <div class="start-menu-item" onclick="setTheme('theme-win2k')">○ Windows 2000</div>
                        <div class="start-menu-item" onclick="setTheme('theme-winxp')">○ Windows XP</div>
                        <div class="start-menu-item" onclick="setTheme('theme-matrix')">○ Matrix Mode</div>
                    </div>

                    <hr class="border-gray-400 my-1">
                    
                    <div class="start-menu-item" onclick="location.reload()">
                        <i class="fas fa-power-off"></i> Reboot
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const term = document.createElement('div');
    term.id = 'nexus-terminal';
    term.innerHTML = `
        <div id="term-header">
            <span>NexusOS Command Prompt</span>
            <span onclick="toggleTerminal()" style="cursor:pointer; padding: 0 5px;">X</span>
        </div>
        <div id="term-body">
            <div>Nexus OS [Version 1.0.26]</div>
            <div>(c) Nyper Corporation. All rights reserved.</div><br>
            <div id="term-output"></div>
            <div id="term-input-line">
                <span>C:\\></span><input type="text" id="term-input" autofocus>
            </div>
        </div>
    `;

    document.body.appendChild(bar);
    document.body.appendChild(term);

    // Activar arrastre en la terminal
    setupTerminalDraggable(term);

    const startBtn = document.getElementById('start-btn-trigger');
    const menu = document.getElementById('start-menu');

    startBtn.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };

    document.onclick = (e) => {
        if (!menu.contains(e.target)) menu.style.display = 'none';
    };

    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = termInput.value.toLowerCase().trim();
            const line = document.createElement('div');
            line.innerHTML = `C:\\>${termInput.value}`;
            termOutput.appendChild(line);
            
            processCommand(val, termOutput);
            
            termInput.value = '';
            document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
        }
    });

    const updateClock = () => {
        const now = new Date();
        const clock = document.getElementById('nexus-clock');
        if (clock) {
            clock.innerText = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');
        }
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// LÓGICA DE ARRASTRE PARA LA TERMINAL
function setupTerminalDraggable(el) {
    let isDragging = false;
    let offset = [0, 0];
    const header = document.getElementById('term-header');

    header.onmousedown = (e) => {
        // No arrastrar si se hace clic en la 'X' de cerrar
        if (e.target.innerText === 'X') return;
        
        isDragging = true;
        offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
        header.style.cursor = 'grabbing';
    };

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        el.style.left = (e.clientX + offset[0]) + 'px';
        el.style.top = (e.clientY + offset[1]) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'move';
    });
}

function processCommand(cmd, output) {
    const res = document.createElement('div');
    res.style.color = "#aaa";
    
    if (cmd === 'help') {
        res.innerHTML = "Available commands: HELP, CLS, DATE, VER, EXIT, THEME [name], NEON, SYSTEM, LOAD";
    } else if (cmd === 'cls') {
        output.innerHTML = '';
        return;
    } else if (cmd === 'ver') {
        res.innerHTML = "Nexus Operating System v1.0.26 [Custom Kernel]";
    } else if (cmd === 'date') {
        res.innerHTML = "Current date: " + new Date().toLocaleDateString();
    } else if (cmd.startsWith('theme ')) {
        const t = cmd.split(' ')[1];
        if (['winxp', 'win2k', 'matrix', 'default'].includes(t)) {
            setTheme(t === 'default' ? 'default' : 'theme-' + t);
            res.innerHTML = "Updating system UI parameters...";
        } else {
            res.innerHTML = "Error: Theme not found.";
        }
    } else if (cmd === 'neon') {
        document.body.classList.toggle('neon-active');
        const isActive = document.body.classList.contains('neon-active');
        res.innerHTML = isActive ? "Experimental visual drivers loaded." : "Standard visual drivers restored.";
    } else if (cmd === 'system') {
        res.innerHTML = "CPU: 6502 @ 1MHz | RAM: 64KB | GPU: NexusVGA";
    } else if (cmd === 'exit') {
        toggleTerminal();
    } else if (cmd === 'load' || cmd === 'run') {
        // Ahora está antes del error, así que sí se ejecutará
        res.innerHTML = "Opening Nexus Loader...";
        NexusLoader.openFileDialog();
    } else if (cmd !== '') {
        // Este siempre debe ir al final de la cadena de comandos
        res.innerHTML = `'${cmd}' is not recognized as an internal or external command.`;
    }
    
    output.appendChild(res);
}

window.toggleTerminal = function() {
    const term = document.getElementById('nexus-terminal');
    term.style.display = term.style.display === 'flex' ? 'none' : 'flex';
    if (term.style.display === 'flex') {
        document.getElementById('term-input').focus();
    }
};

window.toggleThemeSubmenu = function() {
    const sub = document.getElementById('theme-links');
    sub.style.display = sub.style.display === 'flex' ? 'none' : 'flex';
};

window.restoreWinampFromTaskbar = function() {
    document.getElementById('winamp-player').style.display = 'block';
    document.getElementById('task-nexus').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', initTaskbar);


/**
 * NEXUS TASKBAR PROCESS MONITOR
 * Añade botones dinámicamente a la barra de tareas cuando se abren procesos.
 */
const TaskbarMonitor = {
    init() {
        // Observar cuando el Kernel abre una nueva ventana
        window.addEventListener('nexus_process_started', (e) => {
            const { id, title, windowRef } = e.detail;
            this.createTaskButton(id, title, windowRef);
        });

        // Observar cuando el Kernel cierra un proceso para limpiar la barra
        window.addEventListener('nexus_process_stopped', (e) => {
            const btn = document.getElementById(`task-btn-${e.detail.id}`);
            if (btn) btn.remove();
        });
    },

    createTaskButton(id, title, windowRef) {
        const taskContainer = document.getElementById('nexus-taskbar');
        const btn = document.createElement('div');
        
        btn.id = `task-btn-${id}`;
        btn.className = 'taskbar-app-btn';
        btn.style.cssText = `
            background: var(--tb-bg);
            border: 2px solid;
            border-color: var(--tb-border-light) var(--tb-border-dark) var(--tb-border-dark) var(--tb-border-light);
            color: var(--tb-text);
            padding: 2px 10px;
            font-size: 11px;
            min-width: 100px;
            max-width: 150px;
            cursor: pointer;
            margin-right: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        btn.innerHTML = `<i class="fas fa-window-maximize"></i> ${title.toUpperCase()}`;

        // Lógica de conmutación (Click para enfocar/minimizar)
        btn.onclick = () => {
            if (windowRef.style.display === 'none') {
                windowRef.style.display = 'flex';
                if(window.NexusKernel) window.NexusKernel.focusWindow(id);
                btn.style.borderColor = 'var(--tb-border-dark) var(--tb-border-light) var(--tb-border-light) var(--tb-border-dark)';
                btn.style.backgroundColor = 'rgba(0,0,0,0.1)';
            } else {
                // Si ya está visible, podrías elegir entre minimizarla o simplemente enfocarla
                if (windowRef.style.zIndex === "100" || !window.NexusKernel) {
                    windowRef.style.display = 'none';
                    btn.style.borderColor = 'var(--tb-border-light) var(--tb-border-dark) var(--tb-border-dark) var(--tb-border-light)';
                    btn.style.backgroundColor = 'var(--tb-bg)';
                } else {
                    window.NexusKernel.focusWindow(id);
                }
            }
        };

        // Insertar antes del reloj
        taskContainer.insertBefore(btn, document.getElementById('nexus-clock-tray'));
    }
};

// Iniciar el monitor al cargar
document.addEventListener('DOMContentLoaded', () => TaskbarMonitor.init());
