import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject as TestObject
import internal.GlobalVariable as GlobalVariable

// Test Case Simple para Creación de Eventos
// Este archivo debe ser importado como Test Case en Katalon Studio

// Configurar variables globales
GlobalVariable.baseUrl = 'http://localhost:3000'
GlobalVariable.apiUrl = 'http://localhost:5000'

// Paso 1: Abrir navegador y navegar a la página
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount')
WebUI.maximizeWindow()

// Paso 2: Llenar el formulario con datos válidos
// Nombre del evento
WebUI.setText(findTestObject('Object Repository/BarAccount/input_nombre'), 'Concierto de Rock Test')

// Descripción
WebUI.setText(findTestObject('Object Repository/BarAccount/textarea_descripcion'), 'Un increíble concierto de rock en vivo para testing')

// Lugar
WebUI.setText(findTestObject('Object Repository/BarAccount/input_lugar'), 'Estadio Municipal de Testing')

// URL de imagen
WebUI.setText(findTestObject('Object Repository/BarAccount/input_imagenUrl'), 'https://example.com/test-image.jpg')

// Fecha
WebUI.click(findTestObject('Object Repository/BarAccount/input_fecha'))
WebUI.setText(findTestObject('Object Repository/BarAccount/input_fecha'), '25/12/2024')

// Hora usando el reloj digital
WebUI.click(findTestObject('Object Repository/BarAccount/timePickerDisplay'))
WebUI.selectOptionByValue(findTestObject('Object Repository/BarAccount/select_hora'), '08', false)
WebUI.selectOptionByValue(findTestObject('Object Repository/BarAccount/select_minutos'), '30', false)
WebUI.selectOptionByValue(findTestObject('Object Repository/BarAccount/select_periodo'), 'PM', false)
WebUI.click(findTestObject('Object Repository/BarAccount/button_aceptar'))

// Información
WebUI.setText(findTestObject('Object Repository/BarAccount/textarea_informacion'), 'Información detallada del evento de testing con todos los detalles necesarios')

// Tipo de evento
WebUI.selectOptionByValue(findTestObject('Object Repository/BarAccount/select_tipo'), 'musical', false)

// Paso 3: Crear el evento
WebUI.click(findTestObject('Object Repository/BarAccount/button_crear_evento'))

// Paso 4: Verificar que el evento se creó exitosamente
WebUI.waitForElementPresent(findTestObject('Object Repository/BarAccount/message_success'), 10)

// Paso 5: Verificar redirección a la página de mis eventos
WebUI.verifyElementPresent(findTestObject('Object Repository/GestorEventos/title_mis_eventos'), 10)

// Paso 6: Cerrar el navegador
WebUI.closeBrowser() 