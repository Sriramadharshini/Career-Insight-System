import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { communityApi } from "../api";
import { NavbarActions } from "../components/common/NavbarPortals";
import { MessageSquare, Heart, Image as ImageIcon, Award, BookOpen, HelpCircle, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const TABS = [
  { id: "achievement", label: "Achievements", icon: Award, color: "#f59e0b" },
  { id: "discussion", label: "Discussions", icon: MessageSquare, color: "#38bdf8" },
  { id: "resource", label: "Resources", icon: BookOpen, color: "#10b981" },
  { id: "qna", label: "Q&A", icon: HelpCircle, color: "#8b5cf6" },
];

const CommunityPage = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("achievement");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Post Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  // Comment State
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await communityApi.getPosts(token, activeTab);
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) {
      toast.error("Please provide both title and description");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", activeTab);
      formData.append("title", newPost.title);
      formData.append("description", newPost.description);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await communityApi.createPost(token, formData);
      toast.success("Post created successfully!");
      setIsCreating(false);
      setNewPost({ title: "", description: "" });
      setSelectedImage(null);
      setImagePreview("");
      fetchPosts();
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await communityApi.toggleLike(token, postId);
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, likes: res.likes } : p
      ));
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await communityApi.addComment(token, postId, commentText);
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, comments: res.comments } : p
      ));
      setCommentText("");
      setActiveCommentId(null);
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await communityApi.deletePost(token, postId);
      setPosts(posts.filter(p => p._id !== postId));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#06080f", color: "#f1f5f9", padding: "2rem 1rem", fontFamily: "'Outfit', sans-serif" }}>
      <Toaster position="top-right" />
      
      {/* Ambient background */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 80%)` }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <header style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 0.5rem" }}>
            Community
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Share achievements, ask questions, and grow together.</p>
        </header>

        {/* Custom Tabs */}
        <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "2rem", scrollbarWidth: "none" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.25rem", borderRadius: "12px", border: "none",
                  background: isActive ? `${tab.color}15` : "rgba(255,255,255,0.03)",
                  color: isActive ? tab.color : "#94a3b8",
                  fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: isActive ? `0 0 0 1px ${tab.color}40` : "0 0 0 1px rgba(255,255,255,0.05)"
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Create Post Header */}
        <div style={{ background: "rgba(13,17,33,0.85)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", marginBottom: "2.5rem", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
              {user?.name?.charAt(0) || "U"}
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              style={{ flex: 1, textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", color: "#94a3b8", fontSize: "1rem", cursor: "pointer", transition: "background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            >
              Share something with the community...
            </button>
          </div>

          {/* Inline Create Post Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.form 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: "hidden" }}
                onSubmit={handleCreatePost}
              >
                <input
                  type="text"
                  placeholder="Catchy Title"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.85rem", color: "#fff", marginBottom: "1rem", fontFamily: "inherit", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <textarea
                  placeholder="Share the details..."
                  value={newPost.description}
                  onChange={e => setNewPost({...newPost, description: e.target.value})}
                  style={{ width: "100%", height: 120, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.85rem", color: "#fff", marginBottom: "1rem", fontFamily: "inherit", outline: "none", resize: "none" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                
                {imagePreview && (
                  <div style={{ position: "relative", marginBottom: "1rem", display: "inline-block" }}>
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: 200, borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(""); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer" }}>✕</button>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#38bdf8", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
                    <ImageIcon size={18} />
                    Attach Image
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                  </label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="button" onClick={() => setIsCreating(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button type="submit" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}>
                      Post
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Feed */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "rgba(13,17,33,0.5)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>✨</div>
            <h3 style={{ color: "#e2e8f0", fontSize: "1.25rem", margin: "0 0 0.5rem" }}>No posts yet</h3>
            <p style={{ color: "#64748b", margin: 0 }}>Be the first to share something in {TABS.find(t=>t.id===activeTab)?.label}!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {posts.map(post => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(13,17,33,0.85)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", backdropFilter: "blur(20px)" }}>
                
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {post.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#f1f5f9" }}>{post.user?.name || "Unknown User"}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                      </div>
                    </div>
                    {post.user?._id === user?._id && (
                      <button onClick={() => handleDelete(post._id)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "0.5rem" }}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#fff" }}>{post.title}</h3>
                  <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 1rem", whiteSpace: "pre-wrap" }}>{post.description}</p>
                </div>

                {post.imageUrl && (
                  <div style={{ width: "100%", maxHeight: 400, background: "#000", display: "flex", justifyContent: "center" }}>
                    <img src={`http://localhost:5002${post.imageUrl}`} alt="Post attachment" style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }} />
                  </div>
                )}

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "1.5rem" }}>
                  <button onClick={() => handleLike(post._id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "none", color: post.likes.includes(user?._id) ? "#f43f5e" : "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", transition: "color 0.2s" }}>
                    <Heart size={18} fill={post.likes.includes(user?._id) ? "#f43f5e" : "none"} />
                    {post.likes.length}
                  </button>
                  <button onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" }}>
                    <MessageSquare size={18} />
                    {post.comments?.length || 0}
                  </button>
                </div>

                <AnimatePresence>
                  {activeCommentId === post._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                      <div style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                          <input type="text" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => { if(e.key === 'Enter') handleComment(post._id); }}
                            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "0.75rem 1.25rem", color: "#fff", outline: "none", fontSize: "0.9rem" }} />
                          <button onClick={() => handleComment(post._id)} disabled={!commentText.trim()}
                            style={{ background: "#38bdf8", border: "none", color: "#000", padding: "0 1.25rem", borderRadius: "20px", fontWeight: 700, cursor: commentText.trim() ? "pointer" : "not-allowed", opacity: commentText.trim() ? 1 : 0.5 }}>
                            Reply
                          </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {post.comments.map(comment => (
                            <div key={comment._id} style={{ display: "flex", gap: "0.75rem" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold", flexShrink: 0 }}>
                                {comment.user?.name?.charAt(0) || "U"}
                              </div>
                              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem 1rem", borderRadius: "0 12px 12px 12px" }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e2e8f0" }}>{comment.user?.name || "User"}</span>
                                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default CommunityPage;
