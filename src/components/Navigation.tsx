import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Timer, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  return (
    <nav className="pixel-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-400 border-3 border-black pixel-bounce">
                <Book className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  PIXEL PRODUCTIVITY
                </h1>
                <p className="text-xs text-gray-200">
                  8-BIT STUDY PLANNER
                </p>
              </div>
            </div>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`pixel-button ${
                  location.pathname === '/' ? 'pixel-button-yellow' : 'pixel-button-blue'
                } text-xs`}
              >
                STUDY PLANNER
              </Link>
              <Link
                to="/pomodoro"
                className={`pixel-button ${
                  location.pathname === '/pomodoro' ? 'pixel-button-yellow' : 'pixel-button-green'
                } text-xs`}
              >
                POMODORO TIMER
              </Link>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`pixel-button ${darkMode ? 'pixel-button-yellow' : 'pixel-button-purple'} p-3`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-2">
          <Link
            to="/"
            className={`pixel-button ${
              location.pathname === '/' ? 'pixel-button-yellow' : 'pixel-button-blue'
            } text-xs flex-1 text-center`}
          >
            STUDY
          </Link>
          <Link
            to="/pomodoro"
            className={`pixel-button ${
              location.pathname === '/pomodoro' ? 'pixel-button-yellow' : 'pixel-button-green'
            } text-xs flex-1 text-center`}
          >
            TIMER
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;