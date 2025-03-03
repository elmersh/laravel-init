import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

/**
 * Ejecuta un comando del sistema con una animación de espera
 * @param {string} command - Comando a ejecutar
 * @param {string} loadingText - Texto que se muestra durante la ejecución
 * @param {string} errorMessage - Mensaje en caso de error
 * @param {Object} options - Opciones adicionales
 * @returns {boolean} - true si se ejecutó correctamente, false si hubo error
 */
function runCommand(command, loadingText, errorMessage, options = {}) {
  const spinner = ora(loadingText).start();

  try {
    // Capturar o no la salida según las opciones
    const stdio = options.silent ? "ignore" : "pipe";

    // Ejecutar el comando
    const result = execSync(command, { stdio });

    // Mostrar la salida si se solicita y está disponible
    if (options.showOutput && result) {
      console.log(result.toString());
    }

    spinner.succeed(options.successMessage || `${loadingText} - Completado`);
    return true;
  } catch (error) {
    spinner.fail(`${errorMessage}`);

    if (options.verbose) {
      console.error(chalk.red(`Error: ${error.message}`));
      if (error.stderr) {
        console.error(chalk.red(`Salida de error: ${error.stderr.toString()}`));
      }
    }

    // Si es un error crítico, terminar el proceso
    if (options.critical) {
      process.exit(1);
    }

    return false;
  }
}

/**
 * Ejecuta un comando y devuelve la salida como string
 * @param {string} command - Comando a ejecutar
 * @returns {string|null} - Salida del comando o null si hay error
 */
function getCommandOutput(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (error) {
    return null;
  }
}

export { runCommand, getCommandOutput };
