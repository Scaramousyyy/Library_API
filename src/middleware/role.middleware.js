export const requireRole = (roles) => {
  return (req, res, next) => {
    
    if (!req.user) {
        return res.status(500).json({ 
            success: false, 
            message: "Authorization middleware failed: User data not attached." 
        });
    }

    const userRole = req.user.role;

    if (userRole === 'ADMIN' || roles.includes(userRole)) {
      
      next();
    
    } else {
      
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient privileges to access this resource."
      });
    }
  };
};