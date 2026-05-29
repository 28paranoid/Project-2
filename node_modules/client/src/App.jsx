import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import TimerPage from './pages/TimerPage';
import CompletePage from './pages/CompletePage';
import HistoryPage from './pages/HistoryPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  
  if (loading) return null;
  if (!authenticated) return <Navigate to="/login" />;
  
  return children;
};

const App = () => {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute>
            <MenuPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/timer" 
        element={
          <ProtectedRoute>
            <TimerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/complete" 
        element={
          <ProtectedRoute>
            <CompletePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to={authenticated ? "/menu" : "/login"} />} />
    </Routes>
  );
};

export default App;
