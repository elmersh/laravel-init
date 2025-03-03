# Laravel Init

[![npm version](https://img.shields.io/npm/v/@elmersh/laravel-init.svg)](https://www.npmjs.com/package/@elmersh/laravel-init)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Una herramienta CLI para inicializar rápidamente proyectos Laravel descargados de GitHub.

## Características

- ✅ Compatible con Windows, macOS y Linux
- ✅ Configuración interactiva del archivo .env
- ✅ Instalación automática de dependencias de Composer y NPM
- ✅ Generación de la clave de aplicación de Laravel
- ✅ Compilación de assets
- ✅ Integración con Laravel Valet (macOS/Linux)
- ✅ Ejecución de migraciones y seeders
- ✅ Verificación de tests

## Instalación

```bash
npm install -g @elmersh/laravel-init
```

## Uso

Simplemente navega a la raíz de tu proyecto Laravel descargado de GitHub y ejecuta:

```bash
laravel-init
```

Sigue las instrucciones en pantalla para completar la configuración.

## Flujo de trabajo

El inicializador realiza las siguientes acciones:

1. **Verifica** si el directorio actual es un proyecto Laravel válido
2. **Comprueba** que todas las dependencias necesarias estén instaladas
3. **Configura** el archivo `.env` de forma interactiva
4. **Instala** las dependencias de Composer
5. **Genera** la clave de aplicación de Laravel
6. **Instala** las dependencias de Node.js
7. **Compila** los assets con npm run dev
8. **Enlaza** el proyecto con Laravel Valet (si está disponible y se selecciona)
9. **Ejecuta** las migraciones de la base de datos (opcional)
10. **Ejecuta** los seeders (opcional)
11. **Verifica** el funcionamiento con tests (opcional)

## Ejemplo de uso

```bash
# Clonar un proyecto desde GitHub
git clone https://github.com/usuario/proyecto-laravel.git
cd proyecto-laravel

# Ejecutar el inicializador
laravel-init
```

## Requisitos

- Node.js 12.0 o superior
- PHP 8.0 o superior
- Composer
- NPM
- Laravel Valet (opcional, solo para macOS/Linux)

## Desarrollo

Para contribuir al desarrollo de esta herramienta:

1. Clona el repositorio
```bash
git clone https://github.com/elmersh/laravel-init.git
cd laravel-init
```

2. Instala las dependencias
```bash
npm install
```

3. Enlaza el paquete localmente para pruebas
```bash
npm link
```

## Licencia

MIT © [elmersh](https://github.com/elmersh)