import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./common/BrandLogo";
import ModernHomeIcon from "./common/ModernHomeIcon";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);
  const isLandingPage = location.pathname === "/";

  return (
    <div className="app-shell">
      <header className={`topbar ${isPublicPage ? "topbar-public" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" className="brand-block">
            <BrandLogo />
          </Link>
          {!isLandingPage && (
            <div id="navbar-page-title" style={{ display: "flex", alignItems: "center" }}></div>
          )}
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div id="navbar-page-actions" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}></div>
          <Link
            to="/"
            title="Home"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.18)',
              color: '#38bdf8',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(56,189,248,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(56,189,248,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(56,189,248,0.08)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ModernHomeIcon size={18} />
          </Link>
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
