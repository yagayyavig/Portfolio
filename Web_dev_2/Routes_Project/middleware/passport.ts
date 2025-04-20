import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// Yagayya 
interface User {
  id: number;
  uname: string;
  password: string;
}

// Local strategy login
const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: string, password: string, done) => {
    try {
      const user = await getUserByEmailIdAndPassword(uname, password);
      if (!user) {
        return done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Serialize user for the session
passport.serializeUser<number>((user: User, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser<number>(async (id: number, done) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return done({ message: "User not found" }, null);
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

export default passport.use(localLogin);
