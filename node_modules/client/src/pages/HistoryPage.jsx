import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      apiClient.get('/sessions'),
      apiClient.get('/stats')
    ]).then(([sessRes, statsRes]) => {
      setSessions(sessRes.data);
      setStats(statsRes.data);
    }).catch(err => console.error('Failed to fetch history', err));
  }, []);

  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(s => s.drink_id === filter);

  return (
    <div className="screen">
      <Navbar />
      
      <main className="main-content">
        <h2 className="mb-6" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Session History</h2>
        
        {stats && (
          <div className="flex gap-6 mb-8">
            <div className="card card-navy flex-1">
              <div className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Total Focus Time</div>
              <div style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', fontWeight: '700', marginTop: '8px' }}>
                {stats.total_minutes || 0} MIN
              </div>
            </div>
            <div className="card flex-1">
              <div className="input-label">Favorite Drink</div>
              <div style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', fontWeight: '700', marginTop: '8px', textTransform: 'capitalize' }}>
                {stats.fav_drink || 'None'}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h3 style={{ fontSize: '20px' }}>Past Sessions</h3>
          <div className="flex items-center gap-2">
            <label className="input-label" style={{ marginBottom: 0 }}>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
              style={{ padding: '8px 12px', width: 'auto', minWidth: '150px' }}
            >
              <option value="all">All Drinks</option>
              <option value="water">Water</option>
              <option value="coffee">Coffee</option>
              <option value="boba">Boba</option>
              <option value="lemonade">Lemonade</option>
              <option value="smoothie">Smoothie</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Drink</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(s => (
                  <tr key={s.id}>
                    <td style={{ textTransform: 'capitalize', fontWeight: '500' }}>{s.drink_id}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{Math.floor(s.actual_seconds / 60)}m</td>
                    <td className="text-center">
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '4px 12px', 
                        borderRadius: '99px', 
                        fontSize: '12px', 
                        fontWeight: '700',
                        backgroundColor: s.completed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(232, 122, 101, 0.1)',
                        color: s.completed ? 'var(--accent-green)' : 'var(--accent-salmon)'
                      }}>
                        {s.completed ? 'COMPLETED' : 'ABORTED'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>No sessions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;