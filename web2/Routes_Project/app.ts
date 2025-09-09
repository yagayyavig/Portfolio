import express from "express";
import session from "express-session";
import passport from "./middleware/passport";

const PORT = process.env.PORT || 8000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRouters from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Route mounts
app.use("/auth", authRoute);
app.use("/posts", postsRouters);
app.use("/subs", subsRouters);
app.use("/", indexRoute);

// ❌ Removed: app.use("/web2", router);

app.listen(PORT, () =>
  console.log(`🚀 Server running: http://localhost:${PORT}/`)
);
