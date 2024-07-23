
# Cómo Publicar Actualizaciones de la Extensión

Este documento detalla los pasos necesarios para publicar una actualización de tu extensión en el Marketplace de Visual Studio Code utilizando la línea de comandos.

## Requisitos Previos

1. **Node.js y npm**: Asegúrate de tener instalados Node.js y npm.
2. **Visual Studio Code Extension Manager (vsce)**: Instala vsce si aún no lo tienes.
   ```sh
   npm install -g vsce
   ```
3. **Cuenta en el Marketplace**: Debes tener una cuenta en el Visual Studio Code Marketplace.
4. **Token de Acceso Personal (PAT)**: Genera un token con los permisos adecuados siguiendo las instrucciones en [Azure DevOps](https://dev.azure.com/).

## Pasos para Publicar una Actualización

### 1. Configuración Inicial

Si es la primera vez que publicas o si has generado un nuevo token de acceso personal, debes iniciar sesión con vsce:

1. Abre tu terminal.
2. Inicia sesión con vsce usando tu nombre de publicador y el token de acceso personal:
   ```sh
   vsce login <publisher-name>
   ```
   Reemplaza `<publisher-name>` con tu nombre de publicador. Ingresa el token de acceso personal cuando se te solicite.

### 2. Actualizar la Versión de la Extensión

1. Abre tu proyecto de extensión.
2. Actualiza la versión de la extensión en `package.json` siguiendo el esquema de versionado semántico (major.minor.patch).
   ```json
   {
     "version": "1.0.1"
   }
   ```

### 3. Compilar el Proyecto

1. Compila el proyecto para generar los archivos necesarios en el directorio de salida (`out`):
   ```sh
   yarn run compile
   ```

### 4. Empaquetar y Publicar la Extensión

1. Empaqueta la extensión:
   ```sh
   vsce package
   ```
   Esto generará un archivo `.vsix` en el directorio del proyecto.

2. Publica la extensión:
   ```sh
   vsce publish
   ```
   Asegúrate de que la versión en `package.json` sea única y no se haya usado anteriormente en el Marketplace.

### 5. Verificar la Publicación

1. Visita [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode) y asegúrate de que la nueva versión de tu extensión esté disponible.

## Notas Adicionales

- **Errores Comunes**: Si encuentras errores al publicar, asegúrate de que tu token tenga los permisos necesarios y que tu `package.json` esté configurado correctamente.
- **Más Información**: Para más detalles sobre cómo crear y publicar extensiones, visita la [Documentación de VS Code](https://code.visualstudio.com/api).

---

**¡Listo! Tu extensión ahora debería estar actualizada en el Marketplace de Visual Studio Code!**
