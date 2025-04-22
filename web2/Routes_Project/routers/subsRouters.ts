import express from "express";
import { getSubs, getPosts } from "../fake-db";
import { Request, Response } from "express";

const router = express.Router();

// GET /subs/list
router.get("/list", (req: Request, res: Response) => {
  const subgroups = getSubs(); // returns array of subgroup strings
  res.render("subs", { subgroups, user: req.user });
});

// GET /subs/show/:subname
router.get("/show/:subname", (req: Request, res: Response) => {
  const subname = req.params.subname;
  const posts = getPosts(20); // gets top 20 posts in this subgroup
  res.render("sub", { subname, posts, user: req.user });
});

export default router;
