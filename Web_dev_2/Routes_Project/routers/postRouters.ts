import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getPost, addPost, editPost, deletePost, addComment, posts } from "../fake-db";




router.get("/", async (req, res) => {
  const posts = getPosts(20);
  const user = req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", {user: req.user});
});

// Yagayya 
router.post("/create", ensureAuthenticated, async (req, res) => {
  try {
    const { title, link, creator, description, subgroup } = req.body;

    if (!title || !link || !creator || !description || !subgroup) {
      return res.render("createPosts", {
        error: "All fields are required",
        formData: req.body,
        user: req.user,
      });
    }

    addPost(title, link, creator , description, subgroup);
    res.redirect("/posts");
  } catch (err) {
    console.error("There is an error", err);
    res.render("createPosts", {
      error: "Failed to create post. Please try again.",
      formData: req.body,
      user: req.user,
    });
  }
});

// yagayya
router.get("/show/:postid", async (req, res) => {
  try {
    const postId = Number(req.params.postid);
    const post = getPost(postId);

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
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).render("error", {
      message: "Unable to retrieve post",
      user: req.user,
    });
  }
});

// Martin
router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postId = Number(req.params.postid);
  const post = getPost(postId);

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
    formData: {} // prevents ReferenceError in EJS when accessing formData
  });
});

// Martin
router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postId = Number(req.params.postid);
  const post = getPost(postId);

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

  // check for missing fields
  if (!title || !link || !description || !subgroup) {
    return res.render("editPost", {
      post: { ...post, title, link, description, subgroup },
      error: "All fields are required",
      user: req.user,
    });
  }

  editPost(postId, { title, link, description, subgroup });

  res.redirect(`/posts/show/${postId}`);
});

// Shrey
router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const postId = Number(req.params.postid);
  const post = posts[postId]  // this gets the post from fake-db.ts using its ID

  if (!post) {
    return res.status(404).render("error", {
      message: "Post not found",
      user: req.user,
    })
  }

// makes sure only creator of the post can delete 

  if (!req.user || post.creator !== req.user.id) {
    return res.status(403).render("error", {
      message: "ERROR, only the creator can delete the post ",
      user: req.user,
    })
  }

  // if authernticated, you can move on to confirm deletion 
  return res.render("deleteConfirm", {post})
});

//Shrey
router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  const postId = Number(req.params.postid);
  const post = posts[postId]; // from fake-db.ts

  if (!post) {
    return res.status(404).render("error", {
      message: "Post not found",
      user: req.user,
    });
  }


// makes sure only creator of the post can delete 
  if (!req.user || post.creator !== req.user.id) {
    return res.status(403).render("error", {
      message: "You are not authorized to delete this post.",
      user: req.user,
    });
  }

  deletePost(postId);
  return res.redirect("/posts");
});

  

// Yagayya
router.post("/comment-create/:postid", ensureAuthenticated, (req, res) => {
  const postId = parseInt(req.params.postid);
  const post = getPost(postId);

  if (!post) {
    return res.status(404).render("error", {
      message: "Post not found",
      user: req.user
    });
  }

  addComment(
    postId,
    (req.user as any).id,
    req.body.description
  );

  res.redirect(`/posts/show/${postId}`);
});

export default router;