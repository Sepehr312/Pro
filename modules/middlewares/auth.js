
module.exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("errors", [{ message: "لطفاً ابتدا وارد شوید." }]);
    res.redirect('/auth'); 
  };
  

  module.exports.ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash("errors", [{ message: "شما اجازه دسترسی به این مسیر را ندارید." }]);
    res.redirect('/');
  };
  

  module.exports.ensureUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') {
      return next();
    }
    req.flash("errors", [{ message: "شما اجازه دسترسی به این مسیر را ندارید." }]);
    res.redirect('/admin/dashboard'); 
  };
  

  module.exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next();
  };
  