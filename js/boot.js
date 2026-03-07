const bootSequence = () => {
    // 1. Crear el CSS inyectado para la pantalla de boot
    document.body.style.visibility = 'visible';
    const style = document.createElement('style');
    style.innerHTML = `
        #boot-screen {
            position: fixed; inset: 0; background: #000; z-index: 9999;
            font-family: 'Courier New', Courier, monospace; color: #ccc;
            padding: 2rem; overflow: hidden; display: flex; flex-direction: column;
        }
        .scanlines {
            position: absolute; inset: 0; pointer-events: none;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
        }
        #boot-logo {
            position: absolute; inset: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: #000;
            opacity: 0; transition: opacity 1s ease;
        }
        .progress-bar {
            width: 200px; height: 4px; background: #1a1a1a;
            border-radius: 10px; margin-top: 20px; overflow: hidden;
        }
        #progress-fill { width: 0%; height: 100%; background: #3b82f6; transition: width 2s ease; }
    `;
    document.head.appendChild(style);

    // 2. Crear el HTML del boot
    const bootDiv = document.createElement('div');
    bootDiv.id = 'boot-screen';
    bootDiv.innerHTML = `
        <div class="scanlines"></div>
        <div id="boot-text">
            <p>> NEXUS BIOS v4.0.26 (C) 2026</p>
            <p>> CPU: Dragon-Fox Hybrid @ 4.20GHz</p>
            <p>> RAM: 65536KB OK...</p>
            <p>> DISK: IDE 0 [OK]</p>
            <p>> SYSTEM: Loading NexusOS.sys...</p>
        </div>
        <div id="boot-logo">
            <h1 style="font-size: 3.5rem; font-weight: 900; font-style: italic; color: #3b82f6; letter-spacing: -2px;">NEXUS OS</h1>
            <div class="progress-bar"><div id="progress-fill"></div></div>
            <p style="font-size: 10px; color: #60a5fa; margin-top: 15px; letter-spacing: 5px; text-transform: uppercase;">Iniciando Sistema...</p>
        </div>
    `;
    document.body.appendChild(bootDiv);

    // 3. Secuencia de tiempos
    const text = document.getElementById('boot-text');
    const logo = document.getElementById('boot-logo');
    const fill = document.getElementById('progress-fill');

    // Fase 1: Mostrar BIOS y luego pasar al Logo
    setTimeout(() => {
        text.style.display = 'none';
        logo.style.opacity = '1';
        
        // Fase 2: Llenar barra
        setTimeout(() => {
            fill.style.width = '100%';
        }, 100);

    }, 2500);

    // Fase 3: Desvanecer pantalla de boot completa
    setTimeout(() => {
        bootDiv.style.transition = 'opacity 1s ease';
        bootDiv.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.visibility = 'visible';
            bootDiv.remove(); // Eliminar del DOM para limpiar
        }, 1000);
    }, 5500);
};

// Ejecutar lo más pronto posible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSequence);
} else {
    bootSequence();
}
