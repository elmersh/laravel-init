import inquirer from "inquirer";
import { getCurrentDbConfig } from "../utils/env-setup.js";
import os from "os";

const isWindows = os.platform() === "win32";

/**
 * Preguntas para la configuración de la base de datos
 * @returns {Promise<Object>} - Configuración de la base de datos
 */
async function promptDatabaseConfig() {
  const currentConfig = getCurrentDbConfig() || {};

  const questions = [
    {
      type: "confirm",
      name: "configureDb",
      message: "¿Deseas configurar la base de datos ahora?",
      default: true,
    },
    {
      type: "list",
      name: "connection",
      message: "Selecciona el tipo de base de datos:",
      choices: ["mysql", "pgsql", "sqlite", "sqlsrv"],
      default: currentConfig.connection || "mysql",
      when: (answers) => answers.configureDb,
    },
    {
      type: "input",
      name: "host",
      message: "Host de la base de datos:",
      default: currentConfig.host || "127.0.0.1",
      when: (answers) => answers.configureDb && answers.connection !== "sqlite",
    },
    {
      type: "input",
      name: "port",
      message: "Puerto de la base de datos:",
      default: (answers) => {
        if (answers.connection === "mysql") return currentConfig.port || "3306";
        if (answers.connection === "pgsql") return currentConfig.port || "5432";
        if (answers.connection === "sqlsrv")
          return currentConfig.port || "1433";
        return currentConfig.port || "";
      },
      when: (answers) => answers.configureDb && answers.connection !== "sqlite",
    },
    {
      type: "input",
      name: "database",
      message: "Nombre de la base de datos:",
      default: currentConfig.database || "laravel",
      when: (answers) => answers.configureDb,
    },
    {
      type: "input",
      name: "username",
      message: "Usuario de la base de datos:",
      default: currentConfig.username || "root",
      when: (answers) => answers.configureDb && answers.connection !== "sqlite",
    },
    {
      type: "password",
      name: "password",
      message: "Contraseña de la base de datos:",
      default: currentConfig.password || "",
      when: (answers) => answers.configureDb && answers.connection !== "sqlite",
    },
  ];

  const answers = await inquirer.prompt(questions);

  if (!answers.configureDb) {
    return null;
  }

  return {
    connection: answers.connection,
    host: answers.host,
    port: answers.port,
    database: answers.database,
    username: answers.username,
    password: answers.password,
  };
}

/**
 * Preguntas para las opciones adicionales de configuración
 * @returns {Promise<Object>} - Opciones de configuración
 */
async function promptAdditionalOptions() {
  const questions = [
    {
      type: "confirm",
      name: "runMigrations",
      message: "¿Deseas ejecutar las migraciones de la base de datos?",
      default: true,
    },
    {
      type: "confirm",
      name: "runSeeders",
      message: "¿Deseas ejecutar los seeders?",
      default: false,
    },
    {
      type: "confirm",
      name: "runTests",
      message: "¿Deseas ejecutar los tests para verificar que todo funciona?",
      default: false,
    },
  ];

  // Agregar pregunta para Valet solo si no estamos en Windows
  if (!isWindows) {
    questions.unshift({
      type: "confirm",
      name: "linkValet",
      message: "¿Deseas enlazar este proyecto con Valet?",
      default: true,
    });
  }

  return inquirer.prompt(questions);
}

export { promptDatabaseConfig, promptAdditionalOptions };
