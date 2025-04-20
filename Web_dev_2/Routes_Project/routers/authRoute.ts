import express from "express";
import passport from "../middleware/passport";
const router = express.Router();
const devMode = process.env.MODE === "dev";

router.get("/login", async (req, res) => {
  res.render("login", { devMode });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/web2/posts",
    failureRedirect: "/web2/auth/login",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});


export default router;
