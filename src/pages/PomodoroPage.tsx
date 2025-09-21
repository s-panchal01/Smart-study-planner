import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface PomodoroPageProps {
  darkMode: boolean;
}

const PomodoroPage: React.FC<PomodoroPageProps> = ({ darkMode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { showNotification, requestPermission } = useNotification();

  const sessionDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const sessionNames = {
    work: 'WORK TIME',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK',
  };

  const sessionColors = {
    work: 'text-red-400',
    shortBreak: 'text-green-400',
    longBreak: 'text-blue-400',
  };

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Play 8-bit sound
  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    
    // Create 8-bit style beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      playSound();
      
      if (currentSession === 'work') {
        const newCompletedPomodoros = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedPomodoros);
        
        // Determine next session
        const nextSession = newCompletedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
        setCurrentSession(nextSession);
        setTimeLeft(sessionDurations[nextSession]);
        
        showNotification(
          'Work Session Complete!',
          `Great job! Time for a ${nextSession === 'longBreak' ? 'long' : 'short'} break.`
        );
      } else {
        setCurrentSession('work');
        setTimeLeft(sessionDurations.work);
        
        showNotification(
          'Break Time Over!',
          'Ready to get back to work? Let\'s focus!'
        );
      }
      
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentSession, completedPomodoros, playSound, showNotification]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setIsActive(!isActive);
      } else if (event.code === 'KeyR') {
        event.preventDefault();
        handleReset();
      } else if (event.code === 'KeyS') {
        event.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(sessionDurations[currentSession]);
  };

  const handleSkip = () => {
    setIsActive(false);
    setTimeLeft(0); // This will trigger the session change logic
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDurations[currentSession] - timeLeft) / sessionDurations[currentSession]) * 100;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          POMODORO TIMER
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          FOCUS • WORK • ACHIEVE
        </p>
      </div>

      {/* Main Timer Display */}
      <div className={`${darkMode ? 'pixel-card-dark' : 'pixel-card'} text-center mb-8`}>
        <div className={`text-lg font-bold mb-4 ${sessionColors[currentSession]}`}>
          {sessionNames[currentSession]}
        </div>
        
        <div className={`pixel-timer-display mb-6 ${sessionColors[currentSession]}`}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div className="pixel-progress mb-6">
          <div 
            className="pixel-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleStart}
            className={`pixel-button ${isActive ? 'pixel-button-yellow' : 'pixel-button-green'} text-sm`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleReset}
            className="pixel-button pixel-button-blue text-sm"
          >
            <Square className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSkip}
            className="pixel-button pixel-button-purple text-sm"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`pixel-button ${soundEnabled ? 'pixel-button-green' : 'pixel-button-red'} text-sm`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          SPACE: Start/Pause • R: Reset • S: Skip
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${darkMode ? 'pixel-card-dark' : 'pixel-card'} text-center`}>
          <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            {completedPomodoros}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            COMPLETED POMODOROS
          </div>
        </div>
        
        <div className={`${darkMode ? 'pixel-card-dark' : 'pixel-card'} text-center`}>
          <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {Math.floor(completedPomodoros / 4)}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            LONG BREAKS EARNED
          </div>
        </div>
        
        <div className={`${darkMode ? 'pixel-card-dark' : 'pixel-card'} text-center`}>
          <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {Math.floor((completedPomodoros * 25) / 60)}h {(completedPomodoros * 25) % 60}m
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            TOTAL FOCUS TIME
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className={`${darkMode ? 'pixel-card-dark' : 'pixel-card'} text-center`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          HOW IT WORKS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-red-400 font-bold mb-2">WORK SESSION</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              25 minutes of focused work
            </div>
          </div>
          <div>
            <div className="text-green-400 font-bold mb-2">SHORT BREAK</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              5 minutes to recharge
            </div>
          </div>
          <div>
            <div className="text-blue-400 font-bold mb-2">LONG BREAK</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              15 minutes after 4 pomodoros
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PomodoroPage;