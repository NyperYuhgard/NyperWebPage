/* NEXUS_CRT_SYSTEM | Toggle & Persistence Enabled */
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #crt-global-glass {
            position: fixed;
            inset: 0;
            z-index: 999998;
            pointer-events: none;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
            background-size: 100% 2px;
            box-shadow: inset 0 0 80px rgba(0,0,0,0.4);
            display: none; /* Oculto por defecto */
        }

        /* Clase para activar el filtro */
        #crt-global-glass.active {
            display: block;
        }

        #boot-screen-container {
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #nexus-taskbar {
            z-index: 1000000;
        }
    `;
    document.head.appendChild(style);

    const glass = document.createElement('div');
    glass.id = 'crt-global-glass';
    document.body.appendChild(glass);

    // Función global para alternar el filtro
    window.toggleCRT = function() {
        const isActive = glass.classList.toggle('active');
        localStorage.setItem('crt_enabled', isActive);
        console.log(`CRT Mode: ${isActive ? 'ON' : 'OFF'}`);
    };

    // Verificar preferencia guardada al cargar
    if (localStorage.getItem('crt_enabled') === 'true') {
        glass.classList.add('active');
    }
})();
