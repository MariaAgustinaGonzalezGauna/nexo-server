#!/usr/bin/env node

/**
 * Script para ejecutar todos los tests y generar reportes
 * Uso: node run-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para crear directorio si no existe
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para ejecutar comando y capturar output
function runCommand(command, cwd = process.cwd()) {
  try {
    const output = execSync(command, { 
      cwd, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

// Función para generar timestamp
function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// Función principal
async function runAllTests() {
  const timestamp = getTimestamp();
  const reportsDir = path.join(process.cwd(), 'reports', timestamp);
  
  log('🧪 INICIANDO EJECUCIÓN COMPLETA DE TESTS', 'cyan');
  log(`📁 Reportes se guardarán en: ${reportsDir}`, 'blue');
  
  ensureDir(reportsDir);
  
  // 1. Tests Unitarios
  log('\n📋 1. EJECUTANDO TESTS UNITARIOS...', 'yellow');
  log('📍 Ubicación: server/tests/unit/', 'blue');
  
  const unitTestResult = runCommand('npm run test:unit', path.join(process.cwd(), 'server'));
  
  if (unitTestResult.success) {
    log('✅ Tests unitarios PASARON', 'green');
    fs.writeFileSync(
      path.join(reportsDir, 'unit-tests.txt'), 
      unitTestResult.output
    );
  } else {
    log('❌ Tests unitarios FALLARON', 'red');
    log(unitTestResult.error, 'red');
    fs.writeFileSync(
      path.join(reportsDir, 'unit-tests-error.txt'), 
      `${unitTestResult.output}\n\nERROR:\n${unitTestResult.error}`
    );
  }
  
  // 2. Verificar servidor
  log('\n🔍 2. VERIFICANDO ESTADO DEL SERVIDOR...', 'yellow');
  
  const serverCheck = runCommand('netstat -an | findstr :5000', process.cwd());
  if (serverCheck.success && serverCheck.output.includes('LISTENING')) {
    log('✅ Servidor está corriendo en puerto 5000', 'green');
  } else {
    log('⚠️  Servidor no está corriendo en puerto 5000', 'yellow');
    log('💡 Para ejecutar tests de integración, inicia el servidor con: cd server && npm run dev', 'blue');
  }
  
  // 3. Generar reporte de Postman
  log('\n📮 3. PREPARANDO TESTS DE INTEGRACIÓN (POSTMAN)...', 'yellow');
  log('📍 Colección: postman/Nexo_Events_API.postman_collection.json', 'blue');
  
  const postmanInstructions = `
INSTRUCCIONES PARA EJECUTAR TESTS DE INTEGRACIÓN CON POSTMAN:

1. Abrir Postman
2. Importar la colección: postman/Nexo_Events_API.postman_collection.json
3. Configurar variables de entorno:
   - baseUrl: http://localhost:5000
   - authToken: (opcional)
   - eventId: (se genera automáticamente)

4. Ejecutar manualmente:
   - Ir a cada request en la colección
   - Ejecutar y verificar respuestas

5. Ejecutar automáticamente:
   - Ir a "Runner" en Postman
   - Seleccionar colección "Nexo Events API"
   - Configurar: Iterations: 1, Delay: 1000ms
   - Hacer clic en "Run Nexo Events API"

CASOS DE PRUEBA INCLUIDOS:
- ✅ Crear evento válido (esperar 201)
- ❌ Crear evento con datos inválidos (esperar 400)
- 📋 Obtener todos los eventos (esperar 200)
- 🔍 Obtener evento por ID (esperar 200)
- ✏️ Actualizar evento (esperar 200)
- 🗑️ Eliminar evento (esperar 200)

RESULTADOS ESPERADOS:
- Status 201: Evento creado exitosamente
- Status 400: Datos inválidos (esperado para casos negativos)
- Status 500: Error del servidor (revisar logs)
`;

  fs.writeFileSync(
    path.join(reportsDir, 'postman-instructions.txt'), 
    postmanInstructions
  );
  
  log('📝 Instrucciones de Postman guardadas en: postman-instructions.txt', 'green');
  
  // 4. Generar reporte de Katalon
  log('\n🎯 4. PREPARANDO TESTS END-TO-END (KATALON)...', 'yellow');
  log('📍 Test: katalon/EventCreationTest.groovy', 'blue');
  
  const katalonInstructions = `
INSTRUCCIONES PARA EJECUTAR TESTS END-TO-END CON KATALON:

1. Abrir Katalon Studio
2. Importar el proyecto o crear uno nuevo
3. Agregar el archivo: katalon/EventCreationTest.groovy

4. Configurar el entorno:
   - Asegurarse de que el frontend esté corriendo en puerto 3000
   - Asegurarse de que el backend esté corriendo en puerto 5000

5. Ejecutar el test:
   - Seleccionar el test case en Katalon Studio
   - Hacer clic en "Run"
   - Revisar el reporte generado automáticamente

FLUJO DE PRUEBA:
1. Navegar a la página de creación de eventos
2. Llenar el formulario con datos válidos
3. Seleccionar fecha y hora usando el selector digital
4. Enviar el formulario
5. Verificar que el evento se crea correctamente
6. Verificar redirección a la página del evento

RESULTADOS ESPERADOS:
- ✅ PASSED: Flujo completo funciona correctamente
- ❌ FAILED: Revisar capturas de pantalla y logs

TROUBLESHOOTING:
- Si Katalon no encuentra elementos, verificar selectores CSS/XPath
- Si la página no carga, verificar que ambos servidores estén corriendo
- Revisar capturas de pantalla para identificar problemas visuales
`;

  fs.writeFileSync(
    path.join(reportsDir, 'katalon-instructions.txt'), 
    katalonInstructions
  );
  
  log('📝 Instrucciones de Katalon guardadas en: katalon-instructions.txt', 'green');
  
  // 5. Generar reporte resumen
  log('\n📊 5. GENERANDO REPORTE RESUMEN...', 'yellow');
  
  const summary = `
REPORTE DE TESTS - NEXO EVENTS
Fecha: ${new Date().toLocaleString()}
Timestamp: ${timestamp}

RESULTADOS:
${unitTestResult.success ? '✅ Tests Unitarios: PASARON' : '❌ Tests Unitarios: FALLARON'}

ARCHIVOS GENERADOS:
- unit-tests.txt: Resultados detallados de tests unitarios
- postman-instructions.txt: Instrucciones para tests de integración
- katalon-instructions.txt: Instrucciones para tests end-to-end

PRÓXIMOS PASOS:
1. Ejecutar tests de integración con Postman siguiendo las instrucciones
2. Ejecutar tests end-to-end con Katalon siguiendo las instrucciones
3. Revisar todos los reportes generados
4. Documentar cualquier problema encontrado

ESTADO DEL SERVIDOR:
${serverCheck.success && serverCheck.output.includes('LISTENING') ? '✅ Servidor corriendo' : '⚠️ Servidor no corriendo'}

CRITERIOS DE ACEPTACIÓN:
- Tests Unitarios: Todas las validaciones y funciones funcionan correctamente
- Tests de Integración: API responde correctamente a requests válidos e inválidos
- Tests End-to-End: Usuario puede crear evento completo desde la interfaz

---
Generado automáticamente por run-tests.js
`;

  fs.writeFileSync(
    path.join(reportsDir, 'summary.txt'), 
    summary
  );
  
  // 6. Mostrar resumen final
  log('\n🎉 EJECUCIÓN COMPLETADA', 'cyan');
  log(`📁 Reportes guardados en: ${reportsDir}`, 'green');
  log('\n📋 ARCHIVOS GENERADOS:', 'yellow');
  log('  - summary.txt: Resumen general', 'blue');
  log('  - unit-tests.txt: Resultados de tests unitarios', 'blue');
  log('  - postman-instructions.txt: Instrucciones para Postman', 'blue');
  log('  - katalon-instructions.txt: Instrucciones para Katalon', 'blue');
  
  log('\n🚀 PRÓXIMOS PASOS:', 'yellow');
  log('  1. Revisar el reporte resumen en summary.txt', 'blue');
  log('  2. Ejecutar tests de integración con Postman', 'blue');
  log('  3. Ejecutar tests end-to-end con Katalon', 'blue');
  log('  4. Documentar resultados y problemas encontrados', 'blue');
  
  if (!unitTestResult.success) {
    log('\n⚠️  ADVERTENCIA: Los tests unitarios fallaron. Revisar unit-tests-error.txt', 'red');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests().catch(error => {
    log(`❌ Error ejecutando tests: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAllTests }; 