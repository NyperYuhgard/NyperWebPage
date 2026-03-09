/**
 * NEXUS OS - DESKTOP MANAGER v3.0
 * Carga dinámica mediante programs.txt y VFS.
 */

const DesktopManager = {
    async init() {
        let desktop = document.getElementById('nexus-desktop');
        if (!desktop) {
            desktop = document.createElement('main');
            desktop.id = 'nexus-desktop';
            // Grid de escritorio estilo Windows (iconos de arriba a abajo)
            desktop.className = 'fixed inset-0 p-10 flex flex-col flex-wrap gap-8 items-start align-content-start';
            document.body.appendChild(desktop);
        }

        await this.loadAndRender();
    },

    async loadAndRender() {
        const desktop = document.getElementById('nexus-desktop');
        desktop.innerHTML = "";

        // 1. LEER programs.txt DESDE EL SERVIDOR
        try {
            const response = await fetch('programs/programs.txt');
            if (response.ok) {
                const text = await response.text();
                const files = text.split('\n').map(f => f.trim()).filter(f => f.length > 0);
                
                for (const fileName of files) {
                    this.createShortcut(desktop, `programs/${fileName}`, fileName, true);
                }
            }
        } catch (err) {
            console.warn("No se pudo cargar programs.txt o la carpeta está vacía.");
        }

        // 2. LEER PROGRAMAS DEL VFS (Persistencia local)
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('nexus_vfs_') && key.endsWith('.nexus')) {
                const fileName = key.replace('nexus_vfs_', '');
                this.createShortcut(desktop, key, fileName, false);
            }
        }
    },

    createShortcut(container, path, name, isServerFile) {
        const shortcut = document.createElement('div');
        shortcut.className = 'shortcut-icon flex flex-col items-center w-24 cursor-pointer group';
        
        let displayName = name.replace('.nexus', '').toUpperCase();
        let iconClass = isServerFile ? 'fa-window-restore' : 'fa-file-code';

        shortcut.innerHTML = `
            <div class="icon-wrapper w-14 h-14 flex items-center justify-center rounded-xl transition-all border-2 border-transparent group-hover:bg-blue-600/20 group-hover:border-blue-400/50">
                <i class="fas ${iconClass} text-4xl text-blue-400 group-hover:text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"></i>
            </div>
            <span class="text-[10px] mt-2 text-center font-bold text-white drop-shadow-md px-2 py-0.5 rounded group-hover:bg-blue-700 leading-tight">
                ${displayName}
            </span>
        `;

        // Doble click para ejecutar
        shortcut.ondblclick = () => {
            if (!window.NexusKernel) return;
            
            if (isServerFile) {
                window.NexusKernel.execute(path);
            } else {
                const rawData = localStorage.getItem(path);
                try {
                    const parsed = JSON.parse(rawData);
                    window.NexusKernel.executeRaw(parsed.content || parsed, name);
                } catch(e) {
                    window.NexusKernel.executeRaw(rawData, name);
                }
            }
        };

        container.appendChild(shortcut);
    }
};

window.addEventListener('load', () => DesktopManager.init());
