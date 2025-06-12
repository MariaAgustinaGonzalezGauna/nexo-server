const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.tipo;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: 'No tienes permisos para realizar esta acción'
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar permisos' });
    }
  };
};

module.exports = checkRole; 