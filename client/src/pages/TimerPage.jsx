import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DRINKS, meltStatus } from '../utils/drinkPixelArt';
import { useTimer } from '../hooks/useTimer';
import DrinkCanvas from '../components/DrinkCanvas';
import apiClient from '../api/client';

const FOCUS_BG = '#0D2137';
const FOCUS_TEXT = '#E8F4FF';
const FOCUS_TEXT_MUTED = 'rgba(200, 225, 255, 0.55)';
const FOCUS_TRACK = 'rgba(255,255,255,0.1)';

const TimerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { drinkId, plannedMinutes } = location.state || {};
  
  const drink = DRINKS.find(d => d.id === drinkId);
  const totalSeconds = (plannedMinutes || 0) * 60;
  
  const { remSec, isPaused, toggle, isComplete, elapsed } = useTimer(totalSeconds);

  useEffect(() => {
    if (!drink) {
      navigate('/menu');
    }
  }, [drink, navigate]);

  useEffect(() => {
    if (drink) {
      const m = Math.floor(remSec / 60);
      const s = remSec % 60;
      const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      document.title = `${timeStr} — ${drink.name} | Arctic Focus`;
    }
    return () => {
      document.title = 'Arctic Focus';
    };
  }, [remSec, drink]);

  useEffect(() => {
    if (isComplete) {
      handleComplete();
    }
  }, [isComplete]);

  const handleComplete = async () => {
    try {
      const res = await apiClient.post('/sessions', {
        drink_id: drinkId,
        planned_minutes: plannedMinutes,
        actual_seconds: totalSeconds,
        completed: true
      });
      navigate('/complete', { state: { session: res.data, drink } });
    } catch (err) {
      console.error('Failed to save session', err);
      navigate('/complete', { state: { session: { drink_id: drinkId, planned_minutes: plannedMinutes, actual_seconds: totalSeconds }, drink } });
    }
  };

  const handleQuit = async () => {
    if (window.confirm("Are you sure you want to quit? Your timer progress will be lost!")) {
      try {
        await apiClient.post('/sessions', {
          drink_id: drinkId,
          planned_minutes: plannedMinutes,
          actual_seconds: elapsed,
          completed: false
        });
      } catch (err) {
        console.error('Failed to save quit session', err);
      }
      navigate('/menu');
    }
  };

  if (!drink) return null;

  const prog = totalSeconds > 0 ? (totalSeconds - remSec) / totalSeconds : 0;
  const m = Math.floor(remSec / 60);
  const s = remSec % 60;
  const pct = Math.round(prog * 100);

  return (
    <div className="screen" style={{ backgroundColor: FOCUS_BG }}>
      <nav className="top-nav" style={{ backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div className="brand-logo" style={{ fontSize: '16px', color: FOCUS_TEXT_MUTED }}>{drink.name}</div>
        <button
          onClick={handleQuit}
          className="btn-outline"
          style={{
            padding: '6px 16px',
            fontSize: '12px',
            borderRadius: '99px',
            fontFamily: 'var(--font-heading)',
            color: FOCUS_TEXT_MUTED,
            borderColor: 'rgba(255,255,255,0.18)',
          }}
        >
          QUIT
        </button>
      </nav>

      <main className="main-content items-center justify-center" style={{ padding: '20px' }}>
        <div style={{
          transform: isPaused ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.5s ease',
          opacity: isPaused ? 0.7 : 1,
        }}>
          <DrinkCanvas drink={drink} prog={prog} animating={!isPaused} width={200} />
        </div>
        
        <div
          className="mt-8 mb-4 text-center"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '72px',
            fontWeight: '800',
            letterSpacing: '-2px',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: '1',
            color: FOCUS_TEXT,
          }}
        >
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>

        <div className="w-full mb-6" style={{ maxWidth: '320px' }}>
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: '12px', fontWeight: '600', color: FOCUS_TEXT_MUTED, textTransform: 'uppercase' }}>Ice Melted</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: FOCUS_TEXT }}>{pct}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: FOCUS_TRACK, borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #4A9FD4, #7EC8F0)',
              borderRadius: '99px',
              transition: 'width 1s linear',
            }} />
          </div>
        </div>

        <div className="text-center mb-8" style={{ minHeight: '24px', fontSize: '15px', color: FOCUS_TEXT_MUTED, fontStyle: 'italic' }}>
          {isPaused ? 'Paused — Take a breath...' : meltStatus(prog)}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={toggle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '0.5px',
              padding: '14px 36px',
              borderRadius: '99px',
              cursor: 'pointer',
              border: 'none',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              background: isPaused ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.12)',
              color: isPaused ? '#1C1E26' : FOCUS_TEXT,
              backdropFilter: 'blur(8px)',
              boxShadow: isPaused ? '0 4px 16px rgba(240,177,52,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default TimerPage;
