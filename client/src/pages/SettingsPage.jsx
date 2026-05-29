import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/settings')
      .then(res => {
        setSettings(res.data);
      })
      .catch(err => console.error('Failed to fetch settings', err));
  }, []);

  const handleUpdateSettings = async (updates) => {
    try {
      const res = await apiClient.put('/settings', { ...settings, ...updates });
      setSettings(res.data);
      if (updates.theme !== undefined) {
        document.body.className = updates.theme === 'dark' ? 'dark' : '';
      }
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put('/settings', { email, password });
      setPassword('');
      // Success feedback could go here
    } catch (err) {
      console.error('Failed to update account', err);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="screen">
      <Navbar />
      
      <main className="main-content" style={{ maxWidth: '600px' }}>
        <h2 className="mb-6" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Settings</h2>
        
        <div className="card mb-8">
          <h3 className="mb-6" style={{ fontSize: '20px' }}>Preferences</h3>
          
          <div className="flex justify-between items-center py-4">
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Default Drink</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pre-select this drink.</div>
            </div>
            <select 
              value={settings.default_drink || 'none'} 
              onChange={(e) => handleUpdateSettings({ default_drink: e.target.value })}
              className="input-field"
              style={{ width: '150px', padding: '8px 12px' }}
            >
              <option value="none">None</option>
              <option value="water">Water</option>
              <option value="coffee">Coffee</option>
              <option value="boba">Boba</option>
              <option value="lemonade">Lemonade</option>
              <option value="smoothie">Smoothie</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleAccountUpdate} className="card mb-8">
          <h3 className="mb-6" style={{ fontSize: '20px' }}>Account Settings</h3>
          
          <div className="mb-4">
            <label className="input-label">Update Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>
          
          <div className="mb-6">
            <label className="input-label">Update Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Update Account'}
          </button>
        </form>

        <div className="text-center">
          <button 
            className="btn btn-outline" 
            style={{ color: 'var(--accent-salmon)', borderColor: 'rgba(232, 122, 101, 0.3)' }}
            onClick={() => { if(window.confirm("Are you sure you want to delete your account forever?")) { /* delete logic */ } }}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;