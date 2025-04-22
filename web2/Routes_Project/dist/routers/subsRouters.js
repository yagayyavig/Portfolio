"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fake_db_1 = require("../fake-db");
const router = express_1.default.Router();
// GET /subs/list
router.get("/list", (req, res) => {
    const subgroups = (0, fake_db_1.getSubs)(); // returns array of subgroup strings
    res.render("subs", { subgroups, user: req.user });
});
// GET /subs/show/:subname
router.get("/show/:subname", (req, res) => {
    const subname = req.params.subname;
    const posts = (0, fake_db_1.getPosts)(20); // gets top 20 posts in this subgroup
    res.render("sub", { subname, posts, user: req.user });
});
exports.default = router;
//# sourceMappingURL=subsRouters.js.map