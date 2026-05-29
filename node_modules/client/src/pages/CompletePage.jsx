import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DrinkCanvas from '../components/DrinkCanvas';
import apiClient from '../api/client';

const CompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, drink } = location.state || {};
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!session || !drink) {
      navigate('/menu');
      return;
    }

    apiClient.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats', err));
  }, [session, drink, navigate]);

  if (!session || !drink) return null;

  const em = Math.floor(session.actual_seconds / 60);
  const es = session.actual_seconds % 60;

  return (
    <div className="screen flex items-center justify-center">
      <div className="main-content items-center text-center" style={{ maxWidth: '600px', paddingTop: '80px' }}>
        
        <div style={{ color: 'var(--accent-salmon)', fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Session Complete
        </div>
        
        <h1 style={{ fontSize: '48px', letterSpacing: '-1px', marginBottom: '40px' }}>Great Work!</h1>
        
        <div className="card w-full flex-col items-center justify-center mb-8" style={{ padding: '40px' }}>
          <DrinkCanvas drink={drink} prog={1} animating={true} width={160} />
          
          <h2 className="mt-6 mb-2" style={{ fontSize: '24px' }}>Your {drink.name} is ready.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{drink.doneMsg}</p>
          
          <div className="flex gap-6 mt-6 pt-6 w-full justify-center" style={{ borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div className="input-label">Focused for</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>{String(em).padStart(2, '0')}:{String(es).padStart(2, '0')}</div>
            </div>
            {stats && (
              <>
                <div>
                  <div className="input-label">Streak</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.streak} Days</div>
                </div>
                <div>
                  <div className="input-label">Week</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.weekly_sessions} / {stats.weekly_sessions_goal || 5}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/menu" className="btn btn-yellow">STUDY AGAIN</Link>
          <Link to="/history" className="btn btn-outline">VIEW HISTORY</Link>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;