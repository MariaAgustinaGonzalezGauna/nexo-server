import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

// Test de Creación de Eventos End-to-End
class EventCreationTest extends TestCase {
    
    @Override
    protected void setUp() throws Exception {
        super.setUp()
        // Configurar variables globales
        GlobalVariable.baseUrl = 'http://localhost:3000'
        GlobalVariable.apiUrl = 'http://localhost:5000'
    }
    
    def "Crear Evento Completo"() {
        given: "El usuario está en la página de creación de eventos"
        WebUI.openBrowser('')
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount')
        WebUI.maximizeWindow()
        
        when: "El usuario llena el formulario con datos válidos"
        // Llenar nombre del evento
        WebUI.setText(findTestObject('BarAccount/input_nombre'), 'Concierto de Rock Test')
        
        // Llenar descripción
        WebUI.setText(findTestObject('BarAccount/textarea_descripcion'), 'Un increíble concierto de rock en vivo para testing')
        
        // Llenar lugar
        WebUI.setText(findTestObject('BarAccount/input_lugar'), 'Estadio Municipal de Testing')
        
        // Llenar URL de imagen
        WebUI.setText(findTestObject('BarAccount/input_imagenUrl'), 'https://example.com/test-image.jpg')
        
        // Seleccionar fecha
        WebUI.click(findTestObject('BarAccount/input_fecha'))
        WebUI.setText(findTestObject('BarAccount/input_fecha'), '25/12/2024')
        
        // Seleccionar hora usando el reloj digital
        WebUI.click(findTestObject('BarAccount/timePickerDisplay'))
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_hora'), '08', false)
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_minutos'), '30', false)
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_periodo'), 'PM', false)
        WebUI.click(findTestObject('BarAccount/button_aceptar'))
        
        // Llenar información
        WebUI.setText(findTestObject('BarAccount/textarea_informacion'), 'Información detallada del evento de testing con todos los detalles necesarios')
        
        // Seleccionar tipo de evento
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_tipo'), 'musical', false)
        
        // Seleccionar ubicación en el mapa
        WebUI.click(findTestObject('BarAccount/map_container'))
        WebUI.delay(2)
        
        then: "El evento se crea exitosamente"
        WebUI.click(findTestObject('BarAccount/button_crear_evento'))
        WebUI.waitForElementPresent(findTestObject('BarAccount/message_success'), 10)
        
        and: "El usuario es redirigido a la página de mis eventos"
        WebUI.verifyElementPresent(findTestObject('GestorEventos/title_mis_eventos'), 10)
        
        cleanup: "Cerrar el navegador"
        WebUI.closeBrowser()
    }
    
    def "Validar Campos Requeridos"() {
        given: "El usuario está en la página de creación de eventos"
        WebUI.openBrowser('')
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount')
        WebUI.maximizeWindow()
        
        when: "El usuario intenta crear un evento sin llenar campos requeridos"
        WebUI.click(findTestObject('BarAccount/button_crear_evento'))
        
        then: "Se muestran mensajes de error de validación"
        WebUI.verifyElementPresent(findTestObject('BarAccount/error_nombre_required'), 5)
        WebUI.verifyElementPresent(findTestObject('BarAccount/error_descripcion_required'), 5)
        WebUI.verifyElementPresent(findTestObject('BarAccount/error_lugar_required'), 5)
        
        cleanup: "Cerrar el navegador"
        WebUI.closeBrowser()
    }
    
    def "Validar Formato de Fecha y Hora"() {
        given: "El usuario está en la página de creación de eventos"
        WebUI.openBrowser('')
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount')
        WebUI.maximizeWindow()
        
        when: "El usuario ingresa datos con formato inválido"
        WebUI.setText(findTestObject('BarAccount/input_nombre'), 'Test Event')
        WebUI.setText(findTestObject('BarAccount/textarea_descripcion'), 'Descripción de prueba con suficientes caracteres')
        WebUI.setText(findTestObject('BarAccount/input_lugar'), 'Lugar de Prueba')
        WebUI.setText(findTestObject('BarAccount/input_imagenUrl'), 'https://example.com/image.jpg')
        WebUI.setText(findTestObject('BarAccount/textarea_informacion'), 'Información de prueba con suficientes caracteres')
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_tipo'), 'musical', false)
        
        // Fecha inválida
        WebUI.setText(findTestObject('BarAccount/input_fecha'), '32/13/2024')
        
        // Hora inválida
        WebUI.click(findTestObject('BarAccount/timePickerDisplay'))
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_hora'), '25', false)
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_minutos'), '60', false)
        WebUI.click(findTestObject('BarAccount/button_aceptar'))
        
        then: "Se muestran errores de validación"
        WebUI.click(findTestObject('BarAccount/button_crear_evento'))
        WebUI.verifyElementPresent(findTestObject('BarAccount/error_fecha_invalid'), 5)
        WebUI.verifyElementPresent(findTestObject('BarAccount/error_hora_invalid'), 5)
        
        cleanup: "Cerrar el navegador"
        WebUI.closeBrowser()
    }
    
    def "Editar Evento Existente"() {
        given: "El usuario está en la página de edición de un evento"
        WebUI.openBrowser('')
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount/123456789')
        WebUI.maximizeWindow()
        
        when: "El usuario modifica los datos del evento"
        WebUI.clearText(findTestObject('BarAccount/input_nombre'))
        WebUI.setText(findTestObject('BarAccount/input_nombre'), 'Evento Editado')
        
        WebUI.clearText(findTestObject('BarAccount/textarea_descripcion'))
        WebUI.setText(findTestObject('BarAccount/textarea_descripcion'), 'Descripción editada del evento')
        
        then: "Los cambios se guardan exitosamente"
        WebUI.click(findTestObject('BarAccount/button_guardar_cambios'))
        WebUI.waitForElementPresent(findTestObject('BarAccount/message_success'), 10)
        
        cleanup: "Cerrar el navegador"
        WebUI.closeBrowser()
    }
    
    def "Probar Reloj Digital"() {
        given: "El usuario está en la página de creación de eventos"
        WebUI.openBrowser('')
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/barAccount')
        WebUI.maximizeWindow()
        
        when: "El usuario interactúa con el reloj digital"
        WebUI.click(findTestObject('BarAccount/timePickerDisplay'))
        
        then: "El dropdown del reloj se abre"
        WebUI.verifyElementPresent(findTestObject('BarAccount/timePickerDropdown'), 5)
        
        when: "El usuario selecciona diferentes horas"
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_hora'), '10', false)
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_minutos'), '45', false)
        WebUI.selectOptionByValue(findTestObject('BarAccount/select_periodo'), 'AM', false)
        
        then: "La hora se actualiza en el display"
        WebUI.verifyElementText(findTestObject('BarAccount/timeDisplay'), '10:45 AM')
        
        when: "El usuario hace clic en Aceptar"
        WebUI.click(findTestObject('BarAccount/button_aceptar'))
        
        then: "El dropdown se cierra"
        WebUI.verifyElementNotPresent(findTestObject('BarAccount/timePickerDropdown'), 5)
        
        cleanup: "Cerrar el navegador"
        WebUI.closeBrowser()
    }
} 