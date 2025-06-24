const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Event = require('../../models/Event');
const User = require('../../models/User');
const {
  createEvent,
  validateEventData,
  isValidDate,
  isValidTime,
  isFutureDateTime
} = require('../../controllers/eventController');

describe('Event Controller - Unit Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('validateEventData', () => {
    it('should return empty array for valid event data', () => {
      // Usar una fecha futura para que pase la validación
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;

      const validEventData = {
        nombre: 'Concierto de Rock',
        descripcion: 'Un increíble concierto de rock en vivo',
        lugar: 'Estadio Municipal',
        imagenUrl: 'https://example.com/image.jpg',
        fecha: dateStr,
        hora: '20:00',
        informacion: 'Información adicional del evento',
        tipo: 'musical'
      };

      const errors = validateEventData(validEventData);
      expect(errors).to.be.an('array').that.is.empty;
    });

    it('should return errors for invalid event data', () => {
      const invalidEventData = {
        nombre: 'A', // Muy corto
        descripcion: 'Corto', // Muy corto
        lugar: 'X', // Muy corto
        imagenUrl: 'invalid-url', // URL inválida
        fecha: 'invalid-date', // Fecha inválida
        hora: '25:00', // Hora inválida
        informacion: 'Corto', // Muy corto
        tipo: 'X' // Muy corto
      };

      const errors = validateEventData(invalidEventData);
      expect(errors).to.be.an('array').that.is.not.empty;
      expect(errors).to.have.lengthOf(9); // Ahora esperamos 9 errores
    });

    it('should validate minimum length requirements', () => {
      const eventData = {
        nombre: 'AB', // Menos de 3 caracteres
        descripcion: 'Corto', // Menos de 10 caracteres
        lugar: 'XY', // Menos de 3 caracteres
        imagenUrl: 'https://example.com/image.jpg',
        fecha: '25/12/2024',
        hora: '20:00',
        informacion: 'Corto', // Menos de 10 caracteres
        tipo: 'XY' // Menos de 3 caracteres
      };

      const errors = validateEventData(eventData);
      expect(errors).to.include('El nombre del evento debe tener al menos 3 caracteres');
      expect(errors).to.include('La descripción debe tener al menos 10 caracteres');
      expect(errors).to.include('El lugar debe tener al menos 3 caracteres');
      expect(errors).to.include('La información del evento debe tener al menos 10 caracteres');
      expect(errors).to.include('El tipo de evento debe tener al menos 3 caracteres');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate('25/12/2024')).to.be.true;
      expect(isValidDate('01/01/2024')).to.be.true;
      expect(isValidDate('31/12/2024')).to.be.true;
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('32/12/2024')).to.be.false; // Día inválido
      expect(isValidDate('25/13/2024')).to.be.false; // Mes inválido
      expect(isValidDate('25/12/24')).to.be.false; // Año corto
      expect(isValidDate('invalid')).to.be.false; // Formato inválido
      expect(isValidDate('')).to.be.false; // Vacío
    });
  });

  describe('isValidTime', () => {
    it('should return true for valid times', () => {
      expect(isValidTime('20:00')).to.be.true;
      expect(isValidTime('09:30')).to.be.true;
      expect(isValidTime('23:59')).to.be.true;
      expect(isValidTime('00:00')).to.be.true;
    });

    it('should return false for invalid times', () => {
      expect(isValidTime('25:00')).to.be.false; // Hora inválida
      expect(isValidTime('20:60')).to.be.false; // Minutos inválidos
      expect(isValidTime('invalid')).to.be.false; // Formato inválido
      expect(isValidTime('')).to.be.false; // Vacío
    });
  });

  describe('isFutureDateTime', () => {
    it('should return true for future date and time', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Mañana
      const dateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;
      
      expect(isFutureDateTime(dateStr, '20:00')).to.be.true;
    });

    it('should return false for past date and time', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Ayer
      const dateStr = `${pastDate.getDate().toString().padStart(2, '0')}/${(pastDate.getMonth() + 1).toString().padStart(2, '0')}/${pastDate.getFullYear()}`;
      
      expect(isFutureDateTime(dateStr, '20:00')).to.be.false;
    });
  });

  describe('createEvent', () => {
    it('should create event successfully for owner user', async () => {
      // Usar una fecha futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;

      const eventData = {
        nombre: 'Concierto de Rock',
        descripcion: 'Un increíble concierto de rock en vivo',
        lugar: 'Estadio Municipal',
        imagenUrl: 'https://example.com/image.jpg',
        fecha: dateStr,
        hora: '20:00',
        informacion: 'Información adicional del evento',
        tipo: 'musical'
      };

      const userId = '507f1f77bcf86cd799439011';
      const userType = 2; // Owner

      // Mock del método populate
      const mockPopulate = sandbox.stub().resolves({
        ...eventData,
        entidad: { _id: userId, nombre: 'Test Owner', email: 'owner@test.com' }
      });
      // Mock del modelo Event
      const mockEvent = {
        ...eventData,
        entidad: userId,
        save: sandbox.stub().resolves({ populate: mockPopulate })
      };

      sandbox.stub(Event.prototype, 'save').resolves({ populate: mockPopulate });

      const result = await createEvent(eventData, userId, userType);
      expect(result).to.have.property('entidad');
      expect(result.entidad).to.have.property('_id', userId);
    });

    it('should throw error for invalid event data', async () => {
      const invalidEventData = {
        nombre: 'A', // Muy corto
        descripcion: 'Corto',
        lugar: 'X',
        imagenUrl: 'invalid-url',
        fecha: 'invalid-date',
        hora: '25:00',
        informacion: 'Corto',
        tipo: 'X'
      };

      try {
        await createEvent(invalidEventData, 'userId', 2);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Errores de validación');
      }
    });

    it('should assign entity ID for owner user type', async () => {
      // Usar una fecha futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;

      const eventData = {
        nombre: 'Test Event',
        descripcion: 'Test description with enough characters',
        lugar: 'Test Place',
        imagenUrl: 'https://example.com/image.jpg',
        fecha: dateStr,
        hora: '20:00',
        informacion: 'Test information with enough characters',
        tipo: 'musical'
      };

      const userId = '507f1f77bcf86cd799439011';
      const userType = 2; // Owner

      const mockPopulate = sandbox.stub().resolves({
        ...eventData,
        entidad: { _id: userId, nombre: 'Test Owner', email: 'owner@test.com' }
      });
      const mockEvent = {
        ...eventData,
        entidad: userId,
        save: sandbox.stub().resolves({ populate: mockPopulate })
      };

      sandbox.stub(Event.prototype, 'save').resolves({ populate: mockPopulate });

      const result = await createEvent(eventData, userId, userType);
      expect(result.entidad._id).to.equal(userId);
    });

    it('should not assign entity ID for admin user type', async () => {
      // Usar una fecha futura
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;

      const eventData = {
        nombre: 'Test Event',
        descripcion: 'Test description with enough characters',
        lugar: 'Test Place',
        imagenUrl: 'https://example.com/image.jpg',
        fecha: dateStr,
        hora: '20:00',
        informacion: 'Test information with enough characters',
        tipo: 'musical'
      };

      const userId = '507f1f77bcf86cd799439011';
      const userType = 1; // Admin

      const mockPopulate = sandbox.stub().resolves({
        ...eventData,
        entidad: null
      });
      const mockEvent = {
        ...eventData,
        save: sandbox.stub().resolves({ populate: mockPopulate })
      };

      sandbox.stub(Event.prototype, 'save').resolves({ populate: mockPopulate });

      const result = await createEvent(eventData, userId, userType);
      expect(result.entidad).to.be.null;
    });
  });
}); 