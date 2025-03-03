import chalk from "chalk";

/**
 * Muestra la ayuda del CLI
 */
function displayHelp() {
  console.log(`
  ${chalk.bold("Laravel Project Initializer")}

  ${chalk.bold("Uso:")}
    laravel-init [opciones]

  ${chalk.bold("Opciones:")}
    --help, -h       Muestra esta ayuda
    --version, -v    Muestra la versión

  ${chalk.bold("Descripción:")}
    Esta herramienta inicializa proyectos Laravel descargados de GitHub,
    automatizando tareas comunes como la creación del archivo .env,
    instalación de dependencias, generación de claves, etc.

  ${chalk.bold("Ejemplos:")}
    laravel-init                   Inicializa el proyecto en el directorio actual
    laravel-init --version         Muestra la versión
    laravel-init --help            Muestra esta ayuda
  `);
}

export { displayHelp };
