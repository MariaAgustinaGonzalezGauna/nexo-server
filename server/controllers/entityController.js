const Entity = require('../models/Entity');
const User = require('../models/User');

const getEntities = async () => {
  const entities = await Entity.find();
  return entities;
};

const createEntity = async (entityData, userId, userType) => {
  const newEntity = new Entity(entityData);
  await newEntity.save();
  return newEntity;
};

const getEntityById = async (entityId) => {
  const entity = await Entity.findById(entityId);
  return entity;
};

const updateEntity = async (entityId, entityData, userId, userType) => {
  const entity = await Entity.findById(entityId);
  if (!entity) {
    throw new Error('Entidad no encontrada');
  }
  if (userType === 2 && entity.duenioId && entity.duenioId.toString() !== userId) {
    throw new Error('No tienes permiso para actualizar esta entidad');
  }
  await entity.updateOne(entityData);
  return entity;
};

const deleteEntity = async (entityId, userId, userType) => {
  const entity = await Entity.findById(entityId);
  if (!entity) {
    throw new Error('Entidad no encontrada');
  }
  if (userType === 2 && entity.duenioId && entity.duenioId.toString() !== userId) {
    throw new Error('No tienes permiso para eliminar esta entidad');
  }
  await entity.deleteOne();
  return { message: 'Entidad eliminada' };
};

module.exports = {
  getEntities,
  createEntity,
  getEntityById,
  updateEntity,
  deleteEntity
}; 