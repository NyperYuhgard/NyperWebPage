/**
 * NEXUS OS - KERNEL RUNTIME v1.2 (Persistence Patch)
 * Gestión de procesos, ventanas redimensionables y ejecución de binarios .nexus
 */

const NexusKernel = {
    activeProcesses: new Map(),

    // --- MÓDULO DE PERSISTENCIA ---
    VFS: {
        save: (key, data) => localStorage.setItem(`nexus_vfs_${key}`, JSON.stringify(data)),
        read: (key) => {
            const data = localStorage.getItem(`nexus_vfs_${key}`);
            return data ? JSON.parse(data) : null;
        }
    },

    async execute(fileUrl) {
        try {
            const response = await fetch(fileUrl);
            const code = await response.text();
            this.runProcess(code, fileUrl);
        } catch (err) {
            console.error("Error al ejecutar .nexus:", err);
            alert("Nexus Runtime Error: " + err.message);
        }
    },

    async executeRaw(code, fileName) {
        this.runProcess(code, fileName);
    },

    runProcess(code, sourceName) {
        try {
            const cleanCode = code.trim();

            if (!cleanCode.startsWith("/* NEXUS_EXECUTABLE")) {
                throw new Error("Formato de archivo .nexus no válido o encabezado corrupto.");
            }

            const headerLine = cleanCode.split('\n')[0];
            const meta = {
                id: (headerLine.match(/ID:\s*([^|]+)/) || [null, "app_" + Date.now()])[1].trim(),
                title: (headerLine.match(/Title:\s*([^|]+)/) || [null, "Nexus App"])[1].trim(),
                width: (headerLine.match(/Width:\s*([^|]+)/) || [null, "400px"])[1].trim(),
                height: (headerLine.match(/Height:\s*([^|)]+)/) || [null, "300px"])[1].trim()
            };

            if (this.activeProcesses.has(meta.id)) {
                console.warn(`[Kernel] ${meta.id} ya está en ejecución.`);
                return;
            }

            const win = this.createWindow(meta);
            
            const processApi = {
                getContainer: () => win.querySelector('.win-body'),
                onExit: (callback) => { win.onClose = callback; },
                vfs: this.VFS 
            };

            const run = new Function('NexusAPI', cleanCode);
            run(processApi);

            this.activeProcesses.set(meta.id, win);

            // --- NOTIFICAR A TASKBAR.JS ---
            window.dispatchEvent(new CustomEvent('nexus_process_started', {
                detail: { id: meta.id, title: meta.title, windowRef: win }
            }));

            console.log(`[Kernel] Proceso cargado con éxito: ${meta.title}`);

        } catch (err) {
            console.error("Kernel Panic:", err);
            alert("Error de ejecución: " + err.message);
        }
    },

    createWindow(meta) {
        const win = document.createElement('div');
        win.className = 'nexus-window';
        const offset = this.activeProcesses.size * 25;
        
        win.style.cssText = `
            width: ${meta.width}; 
            height: ${meta.height}; 
            top: ${120 + offset}px; 
            left: ${120 + offset}px; 
            position: fixed; 
            z-index: 2000;
            display: flex;
            flex-direction: column;
            resize: both;
            overflow: hidden;
            min-width: 200px;
            min-height: 100px;
            border: 2px solid #fff;
            box-shadow: 3px 3px 15px rgba(0,0,0,0.5);
        `;
        
        win.innerHTML = `
            <div class="win-header" style="display: flex; justify-content: space-between; align-items: center; background: var(--start-bg, #000080); color: white; padding: 5px 10px; cursor: move; user-select: none; flex-shrink: 0;">
                <span><i class="fas fa-microchip"></i> ${meta.title}</span>
                <div class="win-controls" style="display: flex; gap: 3px;">
                    <span class="max-btn" style="cursor:pointer; font-weight: bold; padding: 0 6px; background: #c0c0c0; color: black; border: 1px solid #fff; font-size: 10px;">▢</span>
                    <span class="close-btn" style="cursor:pointer; font-weight: bold; padding: 0 7px; background: #c0c0c0; color: black; border: 1px solid #fff; font-size: 10px;">X</span>
                </div>
            </div>
            <div class="win-body" style="flex-grow: 1; overflow: auto; background: #000; color: #0f0; padding: 0; font-family: monospace; position: relative;"></div>
        `;

        document.body.appendChild(win);

        const maxBtn = win.querySelector('.max-btn');
        let isMaximized = false;
        let oldPos = {};

        maxBtn.onclick = () => {
            if (!isMaximized) {
                oldPos = { t: win.style.top, l: win.style.left, w: win.style.width, h: win.style.height };
                win.style.top = "0";
                win.style.left = "0";
                win.style.width = "100vw";
                win.style.height = "calc(100vh - 40px)";
                win.style.resize = "none";
            } else {
                win.style.top = oldPos.t;
                win.style.left = oldPos.l;
                win.style.width = oldPos.w;
                win.style.height = oldPos.h;
                win.style.resize = "both";
            }
            isMaximized = !isMaximized;
        };

        win.querySelector('.close-btn').onclick = () => {
            if (win.onClose) win.onClose();
            win.remove();
            this.activeProcesses.delete(meta.id);

            // --- NOTIFICAR CIERRE A TASKBAR.JS ---
            window.dispatchEvent(new CustomEvent('nexus_process_stopped', {
                detail: { id: meta.id }
            }));
        };

        this.makeDraggable(win);
        return win;
    },

    // --- FUNCIÓN PARA ENFOCAR (Usada por Taskbar) ---
    focusWindow(id) {
        document.querySelectorAll('.nexus-window, #nexus-terminal').forEach(w => w.style.zIndex = "1500");
        const target = this.activeProcesses.get(id);
        if (target) target.style.zIndex = "3000";
    },

    makeDraggable(el) {
        const header = el.querySelector('.win-header');
        let isDragging = false;
        let offset = [0, 0];

        header.onmousedown = (e) => {
            if (e.target.closest('.win-controls')) return;
            isDragging = true;
            offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
            
            // Usamos la nueva función focusWindow para consistencia
            const metaId = Array.from(this.activeProcesses.entries()).find(([k, v]) => v === el)?.[0];
            if(metaId) this.focusWindow(metaId);
        };

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            el.style.left = (e.clientX + offset[0]) + 'px';
            el.style.top = (e.clientY + offset[1]) + 'px';
        });

        document.addEventListener('mouseup', () => isDragging = false);
    }
};

window.NexusKernel = NexusKernel;
