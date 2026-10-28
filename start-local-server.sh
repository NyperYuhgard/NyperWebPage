#!/bin/bash

# Obtener la ruta donde está guardado este script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "------------------------------------------"
echo " NEXUS OS - LOCAL SERVER (Python)"
echo "------------------------------------------"
echo "Iniciando servidor en http://localhost:8080..."

# Abrir el navegador en segundo plano (espera 1 seg para que el server suba)
(sleep 1 && xdg-open http://localhost:8080) &

# Lanzar el servidor de Python
python3 -m http.server 8080
