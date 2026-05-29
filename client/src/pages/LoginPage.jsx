import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient, { setClientToken } from '../api/client';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();

  if (authenticated) return <Navigate to="/menu" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };
      
      const res = await apiClient.post(endpoint, payload);
      const { token, user } = res.data;
      
      setClientToken(token);
      login(token, user);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen flex items-center justify-center">
      <div className="w-full" style={{ maxWidth: '420px', padding: '24px' }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '32px', color: 'var(--card-dark)', letterSpacing: '-0.5px' }}>ARCTIC FOCUS</h1>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>A personal pocket sanctuary for deep work sessions.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="card">
          <h2 className="mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          {error && <div className="mb-4" style={{ color: 'var(--accent-salmon)', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
          
          {!isLogin && (
            <div className="mb-4">
              <label className="input-label">Username</label>
              <input 
                type="text" 
                className="input-field" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
          
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;