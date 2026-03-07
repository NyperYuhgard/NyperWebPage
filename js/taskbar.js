const taskbarStyles = `
    :root {
        --tb-bg: #c0c0c0;
        --tb-border-light: #ffffff;
        --tb-border-dark: #404040;
        --tb-text: #000000;
        --start-bg: #000080;
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

    /* Estilos del Reloj */
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
                    <div class="start-menu-item" onclick="alert('Terminal lista.')">
                        <i class="fas fa-terminal"></i> Terminal
                    </div>
                    <div class="start-menu-item" onclick="alert('Nyper: Dragon-Fox Maker')">
                        <i class="fas fa-paw"></i> Fursona Info
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
    document.body.appendChild(bar);

    const startBtn = document.getElementById('start-btn-trigger');
    const menu = document.getElementById('start-menu');

    startBtn.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };

    document.onclick = (e) => {
        if (!menu.contains(e.target)) menu.style.display = 'none';
    };

    // Inicializar actualización del reloj
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

window.toggleThemeSubmenu = function() {
    const sub = document.getElementById('theme-links');
    sub.style.display = sub.style.display === 'flex' ? 'none' : 'flex';
};

window.restoreWinampFromTaskbar = function() {
    document.getElementById('winamp-player').style.display = 'block';
    document.getElementById('task-nexus').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', initTaskbar);
