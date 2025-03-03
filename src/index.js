import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { checkDependencies } from "./utils/dependency-checker.js";
import { validateProject } from "./utils/project-validator.js";
import { setupEnvFile } from "./utils/env-setup.js";
import { runCommand } from "./utils/command-runner.js";
import {
  promptDatabaseConfig,
  promptAdditionalOptions,
} from "./prompts/setup-questions.js";
import os from "os";

const isWindows = os.platform() === "win32";

// Obtener la información del package.json para la versión
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

/**
 * Muestra la información de versión del CLI
 */
function displayVersion() {
  console.log(`laravel-init v${packageJson.version}`);
  console.log(`Autor: ${packageJson.author}`);
}

/**
 * Función principal para inicializar el proyecto
 */
async function initializeProject() {
  console.log("\n");
  console.log(chalk.bold.blue("🚀 Laravel Project Initializer"));
  console.log(chalk.blue("====================================="));
  console.log("\n");

  // Paso 1: Verificar si el directorio actual es un proyecto Laravel
  if (!validateProject()) {
    process.exit(1);
  }

  console.log("\n");

  // Paso 2: Verificar dependencias necesarias
  console.log(chalk.bold("📋 Verificando dependencias necesarias..."));
  const depsInstalled = checkDependencies();
  if (!depsInstalled) {
    console.error(
      chalk.red(
        "\n❌ Por favor, instala todas las dependencias requeridas antes de continuar."
      )
    );
    process.exit(1);
  }
  console.log("\n");

  // Paso 3: Configurar archivo .env
  console.log(chalk.bold("📝 Configuración del archivo .env"));
  const dbConfig = await promptDatabaseConfig();
  setupEnvFile(dbConfig);
  console.log("\n");

  // Paso 4: Instalar dependencias de Composer
  console.log(chalk.bold("📦 Instalando dependencias..."));
  const composerResult = runCommand(
    "composer install",
    "Instalando dependencias de Composer",
    "Error al instalar las dependencias de Composer",
    { critical: true }
  );

  // Paso 5: Generar clave de aplicación
  const keyResult = runCommand(
    "php artisan key:generate",
    "Generando clave de aplicación",
    "Error al generar la clave de aplicación",
    { critical: true }
  );

  // Paso 6: Instalar dependencias de Node.js
  const npmResult = runCommand(
    "npm install",
    "Instalando dependencias de Node.js",
    "Error al instalar las dependencias de Node.js",
    { critical: false }
  );

  // Paso 7: Compilar assets
  if (npmResult) {
    runCommand(
      "npm run build",
      "Compilando assets",
      "Error al compilar los assets",
      { critical: false }
    );
  }

  console.log("\n");

  // Paso 8: Configuraciones adicionales
  console.log(chalk.bold("🔍 Opciones adicionales"));
  const additionalOptions = await promptAdditionalOptions();

  // Enlazar con Valet si está disponible (sólo en macOS/Linux)
  if (!isWindows && additionalOptions.linkValet) {
    const currentDir = path.basename(process.cwd());
    runCommand(
      `valet link ${currentDir}`,
      "Enlazando con Laravel Valet",
      "Error al enlazar con Valet",
      {
        successMessage: `Proyecto enlazado con Valet. Accesible en http://${currentDir}.test`,
      }
    );
  }

  // Ejecutar migraciones si se solicitó
  if (additionalOptions.runMigrations) {
    runCommand(
      "php artisan migrate",
      "Ejecutando migraciones de la base de datos",
      "Error al ejecutar las migraciones"
    );
  }

  // Ejecutar seeders si se solicitó
  if (additionalOptions.runSeeders) {
    runCommand(
      "php artisan db:seed",
      "Ejecutando seeders",
      "Error al ejecutar los seeders"
    );
  }

  // Ejecutar tests si se solicitó
  if (additionalOptions.runTests) {
    const testCommand = "php artisan test";
    runCommand(testCommand, "Ejecutando tests", "Algunos tests han fallado", {
      showOutput: true,
    });
  }

  // Finalizar
  console.log("\n");
  console.log(
    chalk.green.bold("🎉 ¡Proyecto Laravel inicializado correctamente!")
  );
  console.log(chalk.green("Puedes comenzar a trabajar en tu proyecto ahora."));

  // Si se enlazó con Valet, mostrar la URL
  if (!isWindows && additionalOptions.linkValet) {
    const currentDir = path.basename(process.cwd());
    console.log(chalk.blue(`🌐 URL del proyecto: http://${currentDir}.test`));
  }
}

export { initializeProject, displayVersion };
