const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const userController = require("../controllers/userController");
const { isAdmin } = require("./checkAuth");
require("dotenv").config();

const githubAdminId = process.env.GITHUB_ADMIN_ID;
const githublogin = new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://auth.yagayyaportfolio.xyz/auth/github/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    const user = userController.getUserById(profile.id);
    console.log("GitHub profile:", profile);

    if (user) {
      return done(null, user);
    }

    const newUser = {
      id: profile.id,
      name: profile.displayName || profile.username,
      username: profile.username,
      isAdmin: profile.id === githubAdminId,
    };
    console.log("New user created:", newUser);


    userController.addUser(newUser);
    return done(null, newUser);
  }
);

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.use(localLogin);
passport.use(githublogin);

passport.serializeUser((user, done) => {
  done(null, user); // Store the full user object
});

passport.deserializeUser((user, done) => {
  done(null, user); // Use the full object directly
});



module.exports = passport;