import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DRINKS } from '../utils/drinkPixelArt';
import DrinkCard from '../components/DrinkCard';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

const MenuPage = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  const handleSelectDrink = (drink) => {
    navigate('/timer', { state: { drinkId: drink.id, plannedMinutes: drink.minutes } });
  };

  const progressPct = Math.min(100, ((stats?.weekly_minutes || 0) / (stats?.weekly_goal_target || 150)) * 100);
  const streak = stats?.streak || 0;
  const hasStreak = streak > 0;

  return (
    <div className="screen">
      <Navbar />
      
      <main className="main-content">
        <div className="flex gap-6 mb-8" style={{ flexWrap: 'wrap' }}>
          <div className="card card-navy" style={{ flex: '1 1 200px' }}>
            <div className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Current Streak</div>
            <div style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: '700', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {streak} Days
              <span className={hasStreak ? 'fire-emoji fire-emoji--active' : 'fire-emoji'}>
                🔥
              </span>
            </div>
          </div>
          
          <div className="card" style={{ flex: '2 1 300px' }}>
            <div className="flex justify-between items-center mb-2">
              <div className="input-label" style={{ marginBottom: 0 }}>Weekly Goal</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {stats?.weekly_minutes || 0} / {stats?.weekly_goal_target || 150} MIN
              </div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>

        <h2 className="mb-6" style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>Select your focus drink</h2>
        
        <div className="drinks-grid">
          {DRINKS.map(drink => (
            <DrinkCard key={drink.id} drink={drink} onClick={() => handleSelectDrink(drink)} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MenuPage;
