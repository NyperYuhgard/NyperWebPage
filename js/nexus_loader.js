/**
 * NEXUS LOADER - Puente para archivos locales
 */
const NexusLoader = {
    openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.nexus';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                // Verificamos que el Kernel esté cargado antes de enviar
                if (window.NexusKernel) {
                    window.NexusKernel.executeRaw(event.target.result, file.name);
                } else {
                    console.error("Kernel no detectado.");
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }
};

window.NexusLoader = NexusLoader;
