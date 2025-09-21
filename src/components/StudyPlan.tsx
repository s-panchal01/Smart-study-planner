import React from 'react';
import { CheckSquare, Calendar, Clock } from 'lucide-react';
import { StudyPlanItem } from '../types';

interface StudyPlanProps {
  studyPlan: StudyPlanItem[];
  onMarkCompleted: (planItemIndex: number, topicIndex: number) => void;
  darkMode: boolean;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ studyPlan, onMarkCompleted, darkMode }) => {
  const today = new Date().toISOString().split('T')[0];

  const groupPlanByWeeks = (plan: StudyPlanItem[]) => {
    const weeks: StudyPlanItem[][] = [];
    let currentWeek: StudyPlanItem[] = [];
    
    plan.forEach((item, index) => {
      const dayOfWeek = new Date(item.date).getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) { // Sunday starts new week
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(item);
      
      if (index === plan.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  const weeks = groupPlanByWeeks(studyPlan);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 text-center ${
          darkMode ? 'pixel-card-dark' : 'pixel-card'
        }`}>
          <Calendar className={`w-5 h-5 mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            {studyPlan.length}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            STUDY DAYS
          </div>
        </div>
        
        <div className={`p-4 text-center ${
          darkMode ? 'pixel-card-dark' : 'pixel-card'
        }`}>
          <CheckSquare className={`w-5 h-5 mx-auto mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            {studyPlan.reduce((acc, day) => acc + day.topics.length, 0)}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            TOTAL TOPICS
          </div>
        </div>
        
        <div className={`p-4 text-center ${
          darkMode ? 'pixel-card-dark' : 'pixel-card'
        }`}>
          <Clock className={`w-5 h-5 mx-auto mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            {weeks.length}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            WEEKS
          </div>
        </div>
      </div>

      {/* Weekly Calendar View */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className={`p-6 ${
          darkMode ? 'pixel-card-dark' : 'pixel-card'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            WEEK {weekIndex + 1}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day, dayIndex) => {
              const dayPlan = week.find(item => new Date(item.date).getDay() === dayIndex);
              const isEmpty = !dayPlan;
              
              return (
                <div key={dayIndex} className={`min-h-[120px] p-3 border-3 border-black transition-all ${
                  isEmpty
                    ? darkMode 
                      ? 'bg-gray-700' 
                      : 'bg-gray-100'
                    : dayPlan.isToday
                    ? 'bg-yellow-200 dark:bg-yellow-800 border-yellow-400'
                    : darkMode
                    ? 'bg-gray-600'
                    : 'bg-white'
                }`}>
                  <div className="text-center mb-2">
                    <div className={`text-xs font-bold ${
                      dayPlan?.isToday 
                        ? 'text-yellow-800 dark:text-yellow-200' 
                        : darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {day}
                    </div>
                    {dayPlan && (
                      <div className={`text-xs ${
                        dayPlan.isToday 
                          ? 'text-yellow-700 dark:text-yellow-300' 
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(dayPlan.date).getDate()}
                      </div>
                    )}
                  </div>
                  
                  {dayPlan ? (
                    <div className="space-y-2">
                      {dayPlan.isRevision ? (
                        <div className={`text-xs px-2 py-1 border-2 border-black text-center font-bold ${
                          darkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-400 text-black'
                        }`}>
                          REVISION DAY
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-1 mb-2">
                            <div className={`w-2 h-2 rounded-full ${dayPlan.color}`}></div>
                            <span className={`text-xs font-bold ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {dayPlan.subject}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {dayPlan.topics.map((topic, topicIndex) => (
                              <button
                                key={topicIndex}
                                onClick={() => onMarkCompleted(
                                  studyPlan.findIndex(item => 
                                    item.date === dayPlan.date && 
                                    item.subject === dayPlan.subject
                                  ), 
                                  topicIndex
                                )}
                                className={`text-xs p-1 border-2 border-black w-full text-left transition-all hover:scale-105 font-bold ${
                                  topic.startsWith('✓')
                                    ? darkMode 
                                      ? 'bg-green-600 text-white line-through' 
                                      : 'bg-green-400 text-black line-through'
                                    : darkMode 
                                      ? 'bg-gray-500 text-gray-200 hover:bg-gray-400' 
                                      : 'bg-gray-200 text-black hover:bg-gray-300'
                                }`}
                              >
                                {topic.replace('✓ ', '')}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      REST DAY
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyPlan;