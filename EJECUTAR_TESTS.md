# 🚀 Guía Rápida para Ejecutar Tests - Nexo Events

## ⚡ Ejecución Rápida

### 1. Ejecutar TODOS los tests automáticamente:
```bash
npm run test:all
```

### 2. Ejecutar solo tests unitarios:
```bash
npm run test:unit
```

### 3. Iniciar servidor para tests de integración:
```bash
npm run test:server
```

### 4. Iniciar cliente para tests end-to-end:
```bash
npm run test:client
```

---

## 📋 Estado Actual de Tests

### ✅ Tests Unitarios - COMPLETADOS
- **Ubicación:** `server/tests/unit/eventController.test.js`
- **Estado:** ✅ PASANDO (13/13 tests)
- **Herramientas:** Mocha + Chai + Sinon
- **Ejecutar:** `npm run test:unit`

### 🔄 Tests de Integración - LISTOS PARA EJECUTAR
- **Ubicación:** `postman/Nexo_Events_API.postman_collection.json`
- **Estado:** 📋 CONFIGURADOS
- **Herramientas:** Postman
- **Ejecutar:** Seguir instrucciones en `reports/[timestamp]/postman-instructions.txt`

### 🎯 Tests End-to-End - LISTOS PARA EJECUTAR
- **Ubicación:** `katalon/EventCreationTest.groovy`
- **Estado:** 📋 CONFIGURADOS
- **Herramientas:** Katalon Studio
- **Ejecutar:** Seguir instrucciones en `reports/[timestamp]/katalon-instructions.txt`

---

## 🎯 Próximos Pasos Recomendados

### 1. Ejecutar Tests de Integración (Postman):
1. Abrir Postman
2. Importar colección: `postman/Nexo_Events_API.postman_collection.json`
3. Importar entorno: `postman/Nexo_Events_Environment.postman_environment.json`
4. Asegurarse de que el servidor esté corriendo (`npm run test:server`)
5. Ejecutar cada request en la colección
6. Verificar respuestas según criterios de aceptación

### 2. Ejecutar Tests End-to-End (Katalon):
1. Abrir Katalon Studio
2. Importar archivo: `katalon/EventCreationTest.groovy`
3. Asegurarse de que tanto frontend como backend estén corriendo
4. Ejecutar el test case
5. Revisar reporte generado

### 3. Documentar Resultados:
1. Revisar reportes generados en `reports/[timestamp]/`
2. Documentar cualquier problema encontrado
3. Actualizar esta guía según sea necesario

---

## 📊 Reportes Generados

Los reportes se guardan automáticamente en:
```
reports/[timestamp]/
├── summary.txt              # Resumen general
├── unit-tests.txt           # Resultados de tests unitarios
├── postman-instructions.txt # Instrucciones para Postman
└── katalon-instructions.txt # Instrucciones para Katalon
```

---

## 🔧 Troubleshooting Rápido

### Tests Unitarios no ejecutan:
```bash
cd server
npm install
npm run test:unit
```

### Postman no conecta:
- Verificar que `npm run test:server` esté corriendo
- Verificar que la variable `baseUrl` sea `http://localhost:5000`

### Katalon no encuentra elementos:
- Verificar que `npm run test:client` esté corriendo
- Verificar que `npm run test:server` esté corriendo
- Revisar selectores en el archivo de test

---

## 📞 Comandos Útiles

```bash
# Ejecutar todo automáticamente
npm run test:all

# Solo tests unitarios
npm run test:unit

# Iniciar servidor
npm run test:server

# Iniciar cliente
npm run test:client

# Ver scripts disponibles
npm run
```

---

**¡Happy Testing! 🎉**

*Última actualización: 24/06/2025* 