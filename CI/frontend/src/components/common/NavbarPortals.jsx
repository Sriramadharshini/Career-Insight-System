import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const NavbarTitle = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const el = document.getElementById('navbar-page-title');
  if (!el) return null;

  return createPortal(
    <>
      <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 0.5rem" }} />
      {children}
    </>, 
    el
  );
};

export const NavbarActions = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const el = document.getElementById('navbar-page-actions');
  if (!el) return null;

  return createPortal(children, el);
};
