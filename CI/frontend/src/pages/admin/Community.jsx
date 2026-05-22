import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { communityApi } from "../../api";
import { Trash2, AlertTriangle, MessageSquare, Heart, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "../../styles/admin.css";
import communityIllustration from "../../assets/admin-illustrations/community.png";

const AdminCommunity = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await communityApi.getPosts(token); // Fetch all posts regardless of type
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to remove this post? This action cannot be undone.")) return;
    try {
      await communityApi.deletePost(token, postId);
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success("Post successfully removed");
    } catch (err) {
      toast.error("Failed to remove post");
    }
  };

  return (
    <div className="page-container page-fade-in" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Toaster position="top-right" />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <img src={communityIllustration} alt="Community Illustration" style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "var(--radius-md)" }} />
          <div>
            <h2 className="admin-page-title" style={{ fontSize: "1.85rem", marginBottom: "0.4rem" }}>Community Moderation</h2>
            <p className="admin-page-subtitle" style={{ fontSize: "0.95rem", color: "#94a3b8" }}>
              Monitor user posts, manage spam, and maintain community guidelines. Private user data is hidden.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", color: "#10b981", fontWeight: 700 }}>
          <CheckCircle size={18} />
          {posts.length} Active Posts
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "var(--radius-xl)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "rgba(13,17,33,0.5)", borderRadius: "var(--radius-lg)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>📭</div>
          <h3 style={{ color: "#e2e8f0", fontSize: "1.25rem", margin: "0 0 0.5rem" }}>No posts available</h3>
          <p style={{ color: "#64748b", margin: 0 }}>The community feed is currently empty.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {posts.map((post) => (
            <div key={post._id} style={{ background: "rgba(13,17,33,0.6)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#38bdf8" }}>
                    {post.type}
                  </div>
                  <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{post.user?.name || "Anonymous User"}</span>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>•</span>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#fff" }}>{post.title}</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 1.25rem", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
                  {post.description}
                </p>

                {post.imageUrl && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <img src={`http://localhost:5002${post.imageUrl}`} alt="Post Attachment" style={{ maxHeight: "150px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                )}

                <div style={{ display: "flex", gap: "1.25rem", color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Heart size={16} /> {post.likes?.length || 0} Likes
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <MessageSquare size={16} /> {post.comments?.length || 0} Comments
                  </div>
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "0.6rem 1rem", borderRadius: "var(--radius-md)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)" }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)" }}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default AdminCommunity;
