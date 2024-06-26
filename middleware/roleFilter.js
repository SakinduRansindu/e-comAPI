function roleFilter(roles) {
    return async (req, res, next) => {
      try {

        const userRole = req.user.role.toLowerCase(); 
        console.log('userRole:+++++', userRole);
  
        if (!roles.includes(userRole)) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        next();
      } catch (error) {
        console.error('Error during role filtering:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  }
  
  module.exports = roleFilter;
  