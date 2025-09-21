import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import StudyPlannerPage from './pages/StudyPlannerPage';
import PomodoroPage from './pages/PomodoroPage';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('pixel-app-darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('pixel-app-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <NotificationProvider>
      <div className={`min-h-screen transition-all duration-300 ${
        darkMode ? 'retro-bg-dark text-white' : 'retro-bg text-black'
      }`}>
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <Routes>
          <Route path="/" element={<StudyPlannerPage darkMode={darkMode} />} />
          <Route path="/pomodoro" element={<PomodoroPage darkMode={darkMode} />} />
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;