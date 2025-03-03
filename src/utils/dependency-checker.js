import { execSync } from "child_process";
import os from "os";
import chalk from "chalk";

const isWindows = os.platform() === "win32";

/**
 * Verifica todas las dependencias necesarias para el proyecto
 * @returns {boolean} - Devuelve true si todas las dependencias están instaladas
 */
function checkDependencies() {
  const dependencies = [
    { command: "php -v", name: "PHP" },
    { command: "composer -V", name: "Composer" },
    { command: isWindows ? "where node" : "which node", name: "Node.js" },
    { command: "npm -v", name: "NPM" },
  ];

  let allDepsInstalled = true;

  for (const dep of dependencies) {
    try {
      execSync(dep.command, { stdio: "ignore" });
      console.log(`${chalk.green("✓")} ${dep.name} instalado correctamente`);
    } catch (error) {
      console.error(
        `${chalk.red("✗")} ${dep.name} no está instalado o no está en el PATH`
      );
      allDepsInstalled = false;
    }
  }

  // Verificar Valet si no es Windows
  if (!isWindows) {
    try {
      execSync("valet -V", { stdio: "ignore" });
      console.log(`${chalk.green("✓")} Laravel Valet instalado correctamente`);
    } catch (error) {
      console.warn(
        `${chalk.yellow(
          "!"
        )} Laravel Valet no está instalado. El proyecto se preparará pero no se enlazará automáticamente.`
      );
    }
  }

  return allDepsInstalled;
}

export { checkDependencies };
