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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Create a /web2 router and mount all inside it
import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRouters from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";

const web2Router = express.Router();
web2Router.use("/auth", authRoute);
web2Router.use("/posts", postsRouters);
web2Router.use("/subs", subsRouters);
web2Router.use("/", indexRoute);

// ✅ Mount under /web2
app.use("/web2", web2Router);

app.listen(PORT, () =>
  console.log(`🚀 Server running: http://localhost:${PORT}/web2`)
);
