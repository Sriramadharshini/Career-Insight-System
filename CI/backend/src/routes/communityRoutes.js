import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { CommunityPost } from "../models/CommunityPost.js";
import { Activity } from "../models/Activity.js";

const router = express.Router();

// Middleware to check if community access is enabled
router.use(async (req, res, next) => {
  try {
    const { SystemSetting } = await import("../models/SystemSetting.js");
    const settings = await SystemSetting.findOne().lean();
    if (settings && settings.communityAccess === false) {
      return res.status(403).json({ message: "Community module is currently disabled by the administrator." });
    }
    next();
  } catch (err) {
    next(err);
  }
});

// GET all posts
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const posts = await CommunityPost.find(filter)
      .populate("user", "name role")
      .populate("comments.user", "name role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// POST new post (allows optional image upload)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { type, title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newPost = new CommunityPost({
      user: req.user._id,
      type: type || "achievement",
      title,
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    const savedPost = await newPost.save();
    
    await Activity.create({
      user: req.user._id,
      action: "Shared",
      target: "Community Post",
      type: "community"
    }).catch(e => console.error("Activity logging failed:", e));
    
    // Populate user info before returning
    const populatedPost = await CommunityPost.findById(savedPost._id)
      .populate("user", "name role");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating community post:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
});

// POST toggle like on a post
router.post("/:id/like", protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId); // Add like
    } else {
      post.likes.splice(likeIndex, 1); // Remove like
    }

    await post.save();
    res.json({ message: "Like toggled", likes: post.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error toggling like" });
  }
});

// POST add comment
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.user._id,
      text
    };

    post.comments.push(newComment);
    await post.save();

    // Re-fetch to populate user names in comments
    const updatedPost = await CommunityPost.findById(req.params.id)
      .populate("user", "name role")
      .populate("comments.user", "name role");

    res.json({ message: "Comment added", comments: updatedPost.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error adding comment" });
  }
});

// DELETE a post (Admin or Author)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is author or admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error deleting post" });
  }
});

export default router;
