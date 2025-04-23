import { NextFunction, Request, Response } from "express";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/web2/auth/login");  // fixed for subpath
}

function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/web2/posts");  // or /web2 if you prefer
}

export { ensureAuthenticated, forwardAuthenticated };
