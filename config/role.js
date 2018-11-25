// middleware for doing role-based permissions
exports.permit = (...allowed) => {
    const isAllowed = role => allowed.indexOf(role) > -1;
    
    // return a middleware
    return (req, res, next) => {
        console.log(req.user.roleId);
      if (req.user && isAllowed(req.user.roleId)){
        console.log(req.user);
        next();
      } else {
        res.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
  }