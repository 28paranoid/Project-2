import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await apiClient.get('/settings');
        const currentTheme = res.data.theme || 'light';
        setTheme(currentTheme);
        document.body.className = currentTheme === 'dark' ? 'dark' : '';
      } catch (err) {
        console.error('Failed to load theme preferences', err);
      }
    };

    loadTheme();
  }, []);

  const handleToggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    try {
      const res = await apiClient.put('/settings', { theme: nextTheme });
      setTheme(res.data.theme);
      document.body.className = res.data.theme === 'dark' ? 'dark' : '';
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <Link to="/menu" className="brand-logo">ARCTIC FOCUS</Link>
      <div className="nav-links">
        <Link to="/menu" className="nav-link">MENU</Link>
        <Link to="/history" className="nav-link">HISTORY</Link>
        <Link to="/goals" className="nav-link">GOALS</Link>
        <Link to="/settings" className="nav-link">SETTINGS</Link>
        {user && <span className="nav-link" style={{ color: 'var(--accent-blue)' }}>{user.username}</span>}
        <button 
          onClick={handleToggleTheme}
          className="btn-outline"
          style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '9999px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-light)', background: 'transparent' }}
        >
          {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
        <button onClick={handleLogout} className="btn-outline" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-light)', background: 'transparent' }}>LOGOUT</button>
      </div>
    </nav>
  );
};

export default Navbar;