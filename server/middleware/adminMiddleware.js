const adminMiddleware = (req, res, next) => {
  // El middleware de autenticación ya debería haber agregado el usuario a req
  if (!req.user || req.user.tipo !== 1) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

module.exports = adminMiddleware; 