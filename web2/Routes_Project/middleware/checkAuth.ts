import { NextFunction, Request, Response } from "express";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/web2/auth/login"); // Adjusted path
}

function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/web2"); // Redirect to /web2 root if already logged in
}

export { ensureAuthenticated, forwardAuthenticated };
