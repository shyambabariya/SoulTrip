const User = require("../models/user");

module.exports.signupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      username,
      email,
    });
    const registerdUser = await User.register(newUser, password);
    req.login(registerdUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to SoulTrip!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back to SoulTrip!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out Successfully");
    res.redirect("/listings");
  });
};
