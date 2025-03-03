#!/usr/bin/env node

// Este archivo es el punto de entrada ejecutable del paquete CLI
import { initializeProject, displayVersion } from "../src/index.js";
import { displayHelp } from "../src/utils/cli-help.js";

// Capturar errores no controlados para una mejor experiencia de usuario
process.on("uncaughtException", (error) => {
  console.error("\n❌ Error inesperado:");
  console.error(error.message);
  console.error(
    "\nPor favor, reporta este error en: https://github.com/elmersh/laravel-init/issues"
  );
  process.exit(1);
});

// Procesar argumentos de línea de comando
const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  // Mostrar la versión
  displayVersion();
} else if (args.includes("--help") || args.includes("-h")) {
  // Mostrar la ayuda
  displayHelp();
} else {
  // Iniciar la aplicación normalmente
  initializeProject();
}
