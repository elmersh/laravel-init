import fs from "fs";
import chalk from "chalk";

/**
 * Verifica si el directorio actual es un proyecto Laravel válido
 * @returns {boolean} - true si es un proyecto Laravel, false si no lo es
 */
function isLaravelProject() {
  // Verificar si existe el archivo artisan (característico de Laravel)
  const hasArtisan = fs.existsSync("artisan");

  // Verificar si existe el directorio app con algunos archivos clave
  const hasAppDir = fs.existsSync("app") && fs.existsSync("app/Http");

  // Verificar composer.json para confirmar que es Laravel
  let isLaravel = false;
  if (fs.existsSync("composer.json")) {
    try {
      const composerJson = JSON.parse(fs.readFileSync("composer.json", "utf8"));
      isLaravel =
        composerJson.require &&
        (composerJson.require["laravel/framework"] ||
          composerJson.name === "laravel/laravel");
    } catch (error) {
      // Si hay un error al leer el archivo, usamos los otros indicadores
    }
  }

  return (hasArtisan && hasAppDir) || isLaravel;
}

/**
 * Verifica la versión de Laravel del proyecto
 * @returns {string|null} - Versión de Laravel o null si no se puede determinar
 */
function getLaravelVersion() {
  if (fs.existsSync("composer.json")) {
    try {
      const composerJson = JSON.parse(fs.readFileSync("composer.json", "utf8"));
      if (composerJson.require && composerJson.require["laravel/framework"]) {
        // Extraer la versión de la cadena (ej. "^8.0" -> "8")
        const versionStr = composerJson.require["laravel/framework"];
        const match = versionStr.match(/[0-9]+/);
        return match ? match[0] : null;
      }
    } catch (error) {
      return null;
    }
  }
  return null;
}

/**
 * Realiza una validación completa del proyecto y muestra información relevante
 * @returns {boolean} - true si es un proyecto Laravel válido
 */
function validateProject() {
  if (!isLaravelProject()) {
    console.error(
      chalk.red("❌ El directorio actual no parece ser un proyecto Laravel.")
    );
    console.error(
      chalk.red("Asegúrate de estar en la raíz del proyecto Laravel.")
    );
    return false;
  }

  console.log(chalk.green("✅ Proyecto Laravel detectado"));

  const version = getLaravelVersion();
  if (version) {
    console.log(chalk.blue(`ℹ️ Versión de Laravel detectada: ${version}`));
  }

  return true;
}

export { isLaravelProject, getLaravelVersion, validateProject };
