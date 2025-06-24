# 🎯 Configuración Completa de Katalon Studio para Nexo Events

## 📋 Pasos para Configurar Katalon Studio

### 1. Crear un Nuevo Proyecto en Katalon Studio

1. Abrir Katalon Studio
2. Hacer clic en **"Create New Project"**
3. Seleccionar **"Web"** como tipo de proyecto
4. Nombrar el proyecto: **"NexoEvents-Tests"**
5. Hacer clic en **"OK"**

### 2. Configurar Variables Globales

1. En el panel izquierdo, expandir **"Profiles"**
2. Hacer doble clic en **"default"**
3. Agregar las siguientes variables:
   - `baseUrl` = `http://localhost:3000`
   - `apiUrl` = `http://localhost:5000`

### 3. Crear Test Objects (Elementos de la Página)

#### 3.1 Crear carpeta "BarAccount"
1. En el panel izquierdo, expandir **"Object Repository"**
2. Hacer clic derecho en **"Object Repository"**
3. Seleccionar **"New > Folder"**
4. Nombrar: **"BarAccount"**

#### 3.2 Crear Test Objects para el formulario

**input_nombre:**
- Selector: `id="nombre"` o `name="nombre"`
- Strategy: CSS Selector

**textarea_descripcion:**
- Selector: `id="descripcion"` o `name="descripcion"`
- Strategy: CSS Selector

**input_lugar:**
- Selector: `id="lugar"` o `name="lugar"`
- Strategy: CSS Selector

**input_imagenUrl:**
- Selector: `id="imagenUrl"` o `name="imagenUrl"`
- Strategy: CSS Selector

**input_fecha:**
- Selector: `id="fecha"` o `name="fecha"`
- Strategy: CSS Selector

**timePickerDisplay:**
- Selector: `[data-testid="time-picker-display"]` o `.time-picker-display`
- Strategy: CSS Selector

**select_hora:**
- Selector: `select[name="hora"]` o `#hora`
- Strategy: CSS Selector

**select_minutos:**
- Selector: `select[name="minutos"]` o `#minutos`
- Strategy: CSS Selector

**select_periodo:**
- Selector: `select[name="periodo"]` o `#periodo`
- Strategy: CSS Selector

**button_aceptar:**
- Selector: `button[type="button"]` o `.btn-aceptar`
- Strategy: CSS Selector

**textarea_informacion:**
- Selector: `id="informacion"` o `name="informacion"`
- Strategy: CSS Selector

**select_tipo:**
- Selector: `id="tipo"` o `name="tipo"`
- Strategy: CSS Selector

**button_crear_evento:**
- Selector: `button[type="submit"]` o `.btn-crear-evento`
- Strategy: CSS Selector

**message_success:**
- Selector: `.alert-success` o `.message-success`
- Strategy: CSS Selector

### 4. Crear carpeta "GestorEventos"
1. Hacer clic derecho en **"Object Repository"**
2. Seleccionar **"New > Folder"**
3. Nombrar: **"GestorEventos"**

**title_mis_eventos:**
- Selector: `h1` o `.title-mis-eventos`
- Strategy: CSS Selector

### 5. Crear Test Case

#### 5.1 Crear Test Case Manual
1. En el panel izquierdo, expandir **"Test Cases"**
2. Hacer clic derecho en **"Test Cases"**
3. Seleccionar **"New > Test Case"**
4. Nombrar: **"EventCreationTest"**

#### 5.2 Agregar Pasos Manualmente
1. En el test case creado, hacer clic en **"Add"**
2. Agregar los siguientes pasos:

**Paso 1: Abrir navegador**
- Keyword: `WebUI.openBrowser`
- Value: `''`

**Paso 2: Navegar a URL**
- Keyword: `WebUI.navigateToUrl`
- Value: `GlobalVariable.baseUrl + '/barAccount'`

**Paso 3: Maximizar ventana**
- Keyword: `WebUI.maximizeWindow`
- Value: `''`

**Paso 4: Llenar nombre**
- Keyword: `WebUI.setText`
- Object: `BarAccount/input_nombre`
- Value: `'Concierto de Rock Test'`

**Paso 5: Llenar descripción**
- Keyword: `WebUI.setText`
- Object: `BarAccount/textarea_descripcion`
- Value: `'Un increíble concierto de rock en vivo para testing'`

**Paso 6: Llenar lugar**
- Keyword: `WebUI.setText`
- Object: `BarAccount/input_lugar`
- Value: `'Estadio Municipal de Testing'`

**Paso 7: Llenar URL de imagen**
- Keyword: `WebUI.setText`
- Object: `BarAccount/input_imagenUrl`
- Value: `'https://example.com/test-image.jpg'`

**Paso 8: Llenar fecha**
- Keyword: `WebUI.setText`
- Object: `BarAccount/input_fecha`
- Value: `'25/12/2024'`

**Paso 9: Hacer clic en selector de hora**
- Keyword: `WebUI.click`
- Object: `BarAccount/timePickerDisplay`

**Paso 10: Seleccionar hora**
- Keyword: `WebUI.selectOptionByValue`
- Object: `BarAccount/select_hora`
- Value: `'08'`

**Paso 11: Seleccionar minutos**
- Keyword: `WebUI.selectOptionByValue`
- Object: `BarAccount/select_minutos`
- Value: `'30'`

**Paso 12: Seleccionar periodo**
- Keyword: `WebUI.selectOptionByValue`
- Object: `BarAccount/select_periodo`
- Value: `'PM'`

**Paso 13: Aceptar hora**
- Keyword: `WebUI.click`
- Object: `BarAccount/button_aceptar`

**Paso 14: Llenar información**
- Keyword: `WebUI.setText`
- Object: `BarAccount/textarea_informacion`
- Value: `'Información detallada del evento de testing'`

**Paso 15: Seleccionar tipo**
- Keyword: `WebUI.selectOptionByValue`
- Object: `BarAccount/select_tipo`
- Value: `'musical'`

**Paso 16: Crear evento**
- Keyword: `WebUI.click`
- Object: `BarAccount/button_crear_evento`

**Paso 17: Verificar mensaje de éxito**
- Keyword: `WebUI.waitForElementPresent`
- Object: `BarAccount/message_success`
- Value: `10`

**Paso 18: Verificar redirección**
- Keyword: `WebUI.verifyElementPresent`
- Object: `GestorEventos/title_mis_eventos`
- Value: `10`

**Paso 19: Cerrar navegador**
- Keyword: `WebUI.closeBrowser`
- Value: `''`

### 6. Ejecutar el Test

1. Asegurarse de que el servidor esté corriendo: `npm run test:server`
2. Asegurarse de que el cliente esté corriendo: `npm run test:client`
3. En Katalon Studio, seleccionar el test case
4. Hacer clic en **"Run"**
5. Seleccionar **"Chrome"** como navegador
6. Hacer clic en **"OK"**

## 🔧 Troubleshooting

### Si los selectores no funcionan:
1. Usar las herramientas de desarrollador del navegador (F12)
2. Inspeccionar los elementos de la página
3. Actualizar los selectores en los Test Objects

### Si el test falla:
1. Verificar que ambos servidores estén corriendo
2. Verificar que las URLs sean correctas
3. Revisar los logs de Katalon para errores específicos

### Selectores alternativos comunes:
- Por ID: `#nombre`
- Por clase: `.nombre-clase`
- Por atributo: `[name="nombre"]`
- Por texto: `//button[contains(text(),'Crear')]` (XPath)

## 📝 Notas Importantes

- Los selectores pueden variar según la implementación exacta del frontend
- Es recomendable usar IDs únicos para los elementos
- Los Test Objects deben ser mantenidos si cambia la estructura del HTML
- Siempre verificar que los servidores estén corriendo antes de ejecutar tests

---

**¡Con esta configuración, Katalon Studio debería funcionar correctamente! 🎉** 