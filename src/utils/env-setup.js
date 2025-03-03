import fs from "fs";
import chalk from "chalk";

/**
 * Crea y configura el archivo .env a partir de .env.example
 * @param {Object} dbConfig - Configuración de la base de datos
 * @returns {boolean} - true si se configuró correctamente
 */
function setupEnvFile(dbConfig = null) {
  if (!fs.existsSync(".env") && fs.existsSync(".env.example")) {
    console.log(chalk.blue("Creando archivo .env a partir de .env.example..."));

    try {
      // Copiar el archivo .env.example a .env
      fs.copyFileSync(".env.example", ".env");

      // Si se proporcionó configuración de la base de datos, actualizar el archivo
      if (dbConfig) {
        let envContent = fs.readFileSync(".env", "utf8");

        // Reemplazar la configuración de la base de datos
        envContent = envContent
          .replace(
            /DB_CONNECTION=.*/,
            `DB_CONNECTION=${dbConfig.connection || "mysql"}`
          )
          .replace(/DB_HOST=.*/, `DB_HOST=${dbConfig.host || "127.0.0.1"}`)
          .replace(/DB_PORT=.*/, `DB_PORT=${dbConfig.port || "3306"}`)
          .replace(
            /DB_DATABASE=.*/,
            `DB_DATABASE=${dbConfig.database || "laravel"}`
          )
          .replace(
            /DB_USERNAME=.*/,
            `DB_USERNAME=${dbConfig.username || "root"}`
          )
          .replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${dbConfig.password || ""}`);

        // Escribir cambios en el archivo .env
        fs.writeFileSync(".env", envContent);
        console.log(
          chalk.green(
            "✅ Archivo .env configurado con datos de la base de datos"
          )
        );
      } else {
        console.log(
          chalk.green("✅ Archivo .env creado (usando valores por defecto)")
        );
      }

      return true;
    } catch (error) {
      console.error(
        chalk.red(`❌ Error al configurar el archivo .env: ${error.message}`)
      );
      return false;
    }
  } else if (fs.existsSync(".env")) {
    console.log(
      chalk.yellow("⚠️ El archivo .env ya existe, se omitió la configuración")
    );
    return true;
  } else {
    console.error(chalk.red("❌ No se encontró el archivo .env.example"));
    return false;
  }
}

/**
 * Lee el archivo .env actual y extrae la configuración de la base de datos
 * @returns {Object|null} - Configuración de la base de datos o null si hay error
 */
function getCurrentDbConfig() {
  if (!fs.existsSync(".env")) {
    return null;
  }

  try {
    const envContent = fs.readFileSync(".env", "utf8");
    const config = {};

    // Extraer valores mediante expresiones regulares
    const connectionMatch = envContent.match(/DB_CONNECTION=(.+)/);
    const hostMatch = envContent.match(/DB_HOST=(.+)/);
    const portMatch = envContent.match(/DB_PORT=(.+)/);
    const databaseMatch = envContent.match(/DB_DATABASE=(.+)/);
    const usernameMatch = envContent.match(/DB_USERNAME=(.+)/);
    const passwordMatch = envContent.match(/DB_PASSWORD=(.+)/);

    if (connectionMatch) config.connection = connectionMatch[1].trim();
    if (hostMatch) config.host = hostMatch[1].trim();
    if (portMatch) config.port = portMatch[1].trim();
    if (databaseMatch) config.database = databaseMatch[1].trim();
    if (usernameMatch) config.username = usernameMatch[1].trim();
    if (passwordMatch) config.password = passwordMatch[1].trim();

    return config;
  } catch (error) {
    return null;
  }
}

export { setupEnvFile, getCurrentDbConfig };
