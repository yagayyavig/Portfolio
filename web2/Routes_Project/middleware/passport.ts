import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// Define User interface for session
interface User {
  id: number;
  uname: string;
  password: string;
}

// Setup Local Strategy
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
          message: "Invalid login. Please check your credentials.",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Serialize user to store in session
passport.serializeUser<number>((user: User, done) => {
  done(null, user.id);
});

// Deserialize user by ID stored in session
passport.deserializeUser<number>(async (id: number, done) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

// Export the strategy setup
export default passport.use(localLogin);
