# Guía Completa de Testing - Nexo Events

Esta documentación describe cómo ejecutar todos los tipos de pruebas para la aplicación Nexo Events.

## 📋 Tipos de Pruebas

### 1. Tests Unitarios (Mocha + Chai)
- **Ubicación:** `server/tests/unit/`
- **Herramientas:** Mocha, Chai, Sinon
- **Propósito:** Probar funciones individuales del controlador de eventos

### 2. Tests de Integración (Postman)
- **Ubicación:** `postman/Nexo_Events_API.postman_collection.json`
- **Herramientas:** Postman
- **Propósito:** Probar la API completa de creación de eventos

### 3. Tests End-to-End (Katalon)
- **Ubicación:** `katalon/EventCreationTest.groovy`
- **Herramientas:** Katalon Studio
- **Propósito:** Probar el flujo completo desde la interfaz de usuario

## 🚀 Cómo Ejecutar las Pruebas

### Tests Unitarios

```bash
# Navegar al directorio del servidor
cd server

# Ejecutar todos los tests unitarios
npm run test:unit

# Ejecutar todos los tests (unitarios)
npm test

# Ejecutar tests en modo watch (re-ejecuta al cambiar archivos)
npm run test:watch
```

**Resultado esperado:**
```
Event Controller - Unit Tests
  validateEventData
    ✔ should return empty array for valid event data
    ✔ should return errors for invalid event data
    ✔ should validate minimum length requirements
  isValidDate
    ✔ should return true for valid dates
    ✔ should return false for invalid dates
  isValidTime
    ✔ should return true for valid times
    ✔ should return false for invalid times
  isFutureDateTime
    ✔ should return true for future date and time
    ✔ should return false for past date and time
  createEvent
    ✔ should create event successfully for owner user
    ✔ should throw error for invalid event data
    ✔ should assign entity ID for owner user type
    ✔ should not assign entity ID for admin user type

13 passing (23ms)
```

### Tests de Integración (Postman)

#### Configuración Inicial:
1. Abrir Postman
2. Importar la colección: `postman/Nexo_Events_API.postman_collection.json`
3. Configurar variables de entorno:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: (opcional, para endpoints protegidos)
   - `eventId`: (se genera automáticamente)

#### Ejecución Manual:
1. Asegurarse de que el servidor esté corriendo: `npm run dev` (en carpeta server)
2. Ejecutar cada request en la colección de Postman
3. Verificar las respuestas según los criterios de aceptación

#### Ejecución Automatizada:
1. En Postman, ir a "Runner"
2. Seleccionar la colección "Nexo Events API"
3. Configurar:
   - Iterations: 1
   - Delay: 1000ms
   - Log responses: Yes
4. Hacer clic en "Run Nexo Events API"

#### Casos de Prueba Incluidos:
- ✅ Crear evento válido
- ❌ Crear evento con datos inválidos
- 📋 Obtener todos los eventos
- 🔍 Obtener evento por ID
- ✏️ Actualizar evento
- 🗑️ Eliminar evento

### Tests End-to-End (Katalon)

#### Configuración:
1. Abrir Katalon Studio
2. Importar el proyecto o crear uno nuevo
3. Agregar el archivo: `katalon/EventCreationTest.groovy`

#### Ejecución:
1. Asegurarse de que tanto el frontend como backend estén corriendo
2. En Katalon Studio, ejecutar el test case
3. Revisar el reporte generado

#### Flujo de Prueba:
1. Navegar a la página de creación de eventos
2. Llenar el formulario con datos válidos
3. Seleccionar fecha y hora usando el selector digital
4. Enviar el formulario
5. Verificar que el evento se crea correctamente
6. Verificar redirección a la página del evento

## 📊 Interpretación de Resultados

### Tests Unitarios
- **✅ PASSING:** Todas las funciones funcionan correctamente
- **❌ FAILING:** Revisar la función específica que falló

### Tests de Integración (Postman)
- **Status 201:** Evento creado exitosamente
- **Status 400:** Datos inválidos (esperado para casos de prueba negativos)
- **Status 500:** Error del servidor (revisar logs)

### Tests End-to-End (Katalon)
- **✅ PASSED:** Flujo completo funciona correctamente
- **❌ FAILED:** Revisar capturas de pantalla y logs para identificar el problema

## 🔧 Troubleshooting

### Problemas Comunes

#### Tests Unitarios no ejecutan:
```bash
# Verificar que estás en la carpeta correcta
cd server

# Verificar que las dependencias están instaladas
npm install

# Verificar scripts disponibles
npm run
```

#### Postman no conecta al servidor:
- Verificar que el servidor esté corriendo en puerto 5000
- Verificar que la variable `baseUrl` esté configurada correctamente
- Revisar logs del servidor para errores

#### Katalon no encuentra elementos:
- Verificar que el frontend esté corriendo en puerto 3000
- Revisar que los selectores CSS/XPath sean correctos
- Verificar que la página cargue completamente

## 📝 Reportes

### Generar Reporte de Tests Unitarios:
```bash
cd server
npm run test:unit > test-results.txt
```

### Generar Reporte de Postman:
1. Ejecutar colección en Postman Runner
2. Exportar resultados como JSON/HTML
3. Guardar en carpeta `reports/`

### Generar Reporte de Katalon:
1. Ejecutar test case
2. Revisar reporte automático generado
3. Exportar capturas de pantalla si es necesario

## 🎯 Criterios de Aceptación

### Tests Unitarios:
- ✅ Todas las validaciones funcionan correctamente
- ✅ Manejo de errores apropiado
- ✅ Mocks funcionan correctamente

### Tests de Integración:
- ✅ API responde correctamente a requests válidos
- ✅ API rechaza datos inválidos apropiadamente
- ✅ Base de datos se actualiza correctamente

### Tests End-to-End:
- ✅ Usuario puede crear evento completo
- ✅ Interfaz responde correctamente
- ✅ Flujo de navegación funciona

## 📁 Estructura de Archivos

```
nexo-server/
├── server/
│   ├── tests/
│   │   ├── unit/
│   │   │   └── eventController.test.js
│   │   └── integration/ (eliminado - usando Postman)
│   └── package.json
├── postman/
│   └── Nexo_Events_API.postman_collection.json
├── katalon/
│   └── EventCreationTest.groovy
└── TESTING_README.md
```

## 🚀 Próximos Pasos

1. **Automatización:** Configurar CI/CD para ejecutar tests automáticamente
2. **Cobertura:** Agregar más tests unitarios para otros controladores
3. **Performance:** Agregar tests de rendimiento
4. **Seguridad:** Agregar tests de seguridad

---

**Nota:** Esta documentación se actualiza según los cambios en el proyecto. Mantener actualizada según las nuevas funcionalidades agregadas. 