"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const checkAuth_1 = require("../middleware/checkAuth");
const fake_db_1 = require("../fake-db");
const BASE_PATH = "/web2";
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = (0, fake_db_1.getPosts)(20);
    const user = req.user;
    res.render("posts", { posts, user });
}));
router.get("/create", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("createPosts", { user: req.user });
});
router.post("/create", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, creator, description, subgroup } = req.body;
        if (!title || !link || !creator || !description || !subgroup) {
            return res.render("createPosts", {
                error: "All fields are required",
                formData: req.body,
                user: req.user,
            });
        }
        (0, fake_db_1.addPost)(title, link, creator, description, subgroup);
        res.redirect(`${BASE_PATH}/posts`);
    }
    catch (err) {
        console.error("There is an error", err);
        res.render("createPosts", {
            error: "Failed to create post. Please try again.",
            formData: req.body,
            user: req.user,
        });
    }
}));
router.get("/show/:postid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.postid);
        const post = (0, fake_db_1.getPost)(postId);
        if (!post) {
            return res.status(404).render("error", {
                message: "Post Not found",
                user: req.user,
            });
        }
        res.render("individualPost", {
            post,
            user: req.user,
        });
    }
    catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).render("error", {
            message: "Unable to retrieve post",
            user: req.user,
        });
    }
}));
router.get("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    if (!post) {
        return res.status(404).render("error", {
            message: "Post not found",
            user: req.user,
        });
    }
    if (!req.user || post.creator.id !== req.user.id) {
        return res.status(403).render("error", {
            message: "Only the creator can edit this post",
            user: req.user,
        });
    }
    res.render("editPost", {
        post,
        user: req.user,
        formData: {},
    });
}));
router.post("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    if (!post) {
        return res.status(404).render("error", {
            message: "Post not found",
            user: req.user,
        });
    }
    if (!req.user || post.creator.id !== req.user.id) {
        return res.status(403).render("error", {
            message: "Only the creator can edit this post",
            user: req.user,
        });
    }
    const { title, link, description, subgroup } = req.body;
    if (!title || !link || !description || !subgroup) {
        return res.render("editPost", {
            post: Object.assign(Object.assign({}, post), { title, link, description, subgroup }),
            error: "All fields are required",
            user: req.user,
        });
    }
    (0, fake_db_1.editPost)(postId, { title, link, description, subgroup });
    res.redirect(`${BASE_PATH}/posts/show/${postId}`);
}));
router.get("/deleteconfirm/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const post = fake_db_1.posts[postId];
    if (!post) {
        return res.status(404).render("error", {
            message: "Post not found",
            user: req.user,
        });
    }
    if (!req.user || post.creator !== req.user.id) {
        return res.status(403).render("error", {
            message: "ERROR, only the creator can delete the post ",
            user: req.user,
        });
    }
    return res.render("deleteConfirm", { post });
}));
router.post("/delete/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const post = fake_db_1.posts[postId];
    if (!post) {
        return res.status(404).render("error", {
            message: "Post not found",
            user: req.user,
        });
    }
    if (!req.user || post.creator !== req.user.id) {
        return res.status(403).render("error", {
            message: "You are not authorized to delete this post.",
            user: req.user,
        });
    }
    (0, fake_db_1.deletePost)(postId);
    return res.redirect(`${BASE_PATH}/posts`);
}));
router.post("/comment-create/:postid", checkAuth_1.ensureAuthenticated, (req, res) => {
    const postId = parseInt(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    if (!post) {
        return res.status(404).render("error", {
            message: "Post not found",
            user: req.user,
        });
    }
    (0, fake_db_1.addComment)(postId, req.user.id, req.body.description);
    res.redirect(`${BASE_PATH}/posts/show/${postId}`);
});
exports.default = router;
//# sourceMappingURL=postRouters.js.map