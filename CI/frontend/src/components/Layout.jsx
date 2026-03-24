import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles } from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);
  const isLandingPage = location.pathname === "/";

  return (
    <div className="app-shell">
      <header className={`topbar ${isPublicPage ? "topbar-public" : ""}`}>
        <div>
          <Link to="/" className="brand-block">
            <span className="brand-mark" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <Sparkles size={24} strokeWidth={2.5} color="#38bdf8" />
            </span>
            <div>
              <h1 style={{ color: '#fff' }}>Career Insight</h1>
              <p style={{ color: '#a1a1aa' }}>Intelligent career building platform</p>
            </div>
          </Link>
        </div>
        <nav>
          <Link to="/" style={{ fontSize: '1rem', fontWeight: '500', color: '#fff', opacity: 0.8 }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.8}>Home</Link>
          <details className="nav-dropdown nav-account-dropdown">
            <summary aria-label="Account menu">
              <span className="nav-account-icon">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </summary>
            <div className="nav-dropdown-menu nav-account-menu">
              <Link to="/profile" className="nav-account-item">Profile</Link>
              <button type="button" onClick={logout} className="nav-account-item nav-account-item-danger">Logout</button>
            </div>
          </details>
        </nav>
      </header>
      <main className={`page-container ${isPublicPage ? "page-container-public" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
