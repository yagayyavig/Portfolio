const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.redirect("/auth/login");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

const userController = require("../controllers/userController"); // add this at the top

router.get("/admin", ensureAuthenticated, isAdmin, (req, res) => {
  req.sessionStore.all((error, sessions) => {
    if (error) {
      console.error("Error retrieving sessions:", error);
      return res.status(500).send("Error retrieving sessions");
    }

    // Enrich sessions with full user data
    const enhancedSessions = {};
    for (const sid in sessions) {
      const session = sessions[sid];
      const userId = session?.passport?.user;
      if (userId) {
        const user = userController.getUserById(userId); // fetch full user
        enhancedSessions[sid] = {
          userId: userId,
          name: user?.name || "Unknown",
        };
      }
    }

    res.render("admin", {
      sessions: enhancedSessions,
      user: req.user,
    });
  });
});


router.get("/deauth/:sessionId", ensureAuthenticated, isAdmin, (req, res) => {
  const sessionId = req.params.sessionId;

  req.sessionStore.get(sessionId, (err, session) => {
    if (err || !session) {
      console.error(`Session ${sessionId} not found:`, err);
      return res.status(404).send("Session not found");
    }

    console.log(`Revoking session: ${sessionId}`);

    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        console.error(`Error destroying session ${sessionId}:`, err);
        return res.status(500).send("Error revoking session");
      }
      console.log(`Session ${sessionId} revoked successfully`);
      res.redirect("/admin");
    });
  });
});

module.exports = router;
