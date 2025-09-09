module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },

  isAdmin: function (req, res, next) {
    console.log("User Object:", req.user); // Debugging
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    console.log("Admin access denied!");
    res.redirect("/dashboard");
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  }
};