import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/ProgressRing';
import apiClient from '../api/client';

const GoalsPage = () => {
  const [goal, setGoal] = useState(null);
  const [targetMins, setTargetMins] = useState(150);
  const [targetSessions, setTargetSessions] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/goals')
      .then(res => {
        setGoal(res.data);
        setTargetMins(res.data.target_minutes);
        setTargetSessions(res.data.sessions_target);
      })
      .catch(err => console.error('Failed to fetch goals', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/goals', {
        target_minutes: parseInt(targetMins),
        sessions_target: parseInt(targetSessions)
      });
      setGoal(res.data);
      // Removed alert, we could use a toast later
    } catch (err) {
      console.error('Failed to update goals', err);
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return null;

  const progressPct = Math.min(100, (goal.actual_minutes / goal.target_minutes) * 100);

  return (
    <div className="screen">
      <Navbar />
      
      <main className="main-content" style={{ maxWidth: '700px' }}>
        <h2 className="mb-6" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Weekly Goals</h2>
        
        <div className="card flex items-center justify-between gap-8 mb-8" style={{ padding: '40px' }}>
          <ProgressRing percentage={progressPct} size={160} color="var(--accent-yellow)" />
          <div className="flex-1">
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Current Progress</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="input-label" style={{ marginBottom: 0 }}>Minutes</span>
                <span style={{ fontWeight: '600' }}>{goal.actual_minutes} / {goal.target_minutes}</span>
              </div>
              <div className="progress-bar-bg" style={{ marginTop: 0 }}>
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, (goal.actual_minutes / goal.target_minutes) * 100)}%`, backgroundColor: 'var(--accent-yellow)' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="input-label" style={{ marginBottom: 0 }}>Sessions</span>
                <span style={{ fontWeight: '600' }}>{goal.actual_sessions} / {goal.sessions_target}</span>
              </div>
              <div className="progress-bar-bg" style={{ marginTop: 0 }}>
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, (goal.actual_sessions / goal.sessions_target) * 100)}%`, backgroundColor: 'var(--accent-blue)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h3 className="mb-6" style={{ fontSize: '20px' }}>Update Targets</h3>
          
          <div className="flex gap-6 mb-6">
            <div className="flex-1">
              <label className="input-label">Weekly Minutes</label>
              <input 
                type="number" 
                className="input-field" 
                value={targetMins}
                onChange={(e) => setTargetMins(e.target.value)}
                required
                min="1"
              />
            </div>
            
            <div className="flex-1">
              <label className="input-label">Weekly Sessions</label>
              <input 
                type="number" 
                className="input-field" 
                value={targetSessions}
                onChange={(e) => setTargetSessions(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Goals'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default GoalsPage;