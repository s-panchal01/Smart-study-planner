import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface MotivationalQuotesProps {
  darkMode: boolean;
}

const MotivationalQuotes: React.FC<MotivationalQuotesProps> = ({ darkMode }) => {
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Your future is created by what you do today, not tomorrow.",
    "Education is the most powerful weapon you can use to change the world.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Don't watch the clock; do what it does. Keep going.",
    "The way to get started is to quit talking and begin doing.",
    "Innovation distinguishes between a leader and a follower.",
    "The only impossible journey is the one you never begin.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Everything you've ever wanted is on the other side of fear.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "The future belongs to those who believe in the beauty of their dreams."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true);
      }, 500);
    }, 45000); // Change quote every 45 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="mb-8">
      <div className={`speech-bubble transition-all duration-500 ${
        isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
      } ${darkMode ? 'bg-gray-800 text-white border-white' : 'bg-white text-black border-black'}`}>
        <div className="flex items-start space-x-4">
          <Quote className={`w-6 h-6 flex-shrink-0 pixel-pulse ${
            darkMode ? 'text-yellow-400' : 'text-purple-600'
          }`} />
          <div>
            <p className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              "{quotes[currentQuoteIndex]}"
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              DAILY MOTIVATION • QUOTE {currentQuoteIndex + 1} OF {quotes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuotes;