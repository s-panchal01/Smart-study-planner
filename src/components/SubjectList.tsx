import React from 'react';
import { Trash2, Calendar, BookOpen } from 'lucide-react';
import { Subject } from '../types';

interface SubjectListProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
  darkMode: boolean;
}

const SubjectList: React.FC<SubjectListProps> = ({ subjects, onDelete, darkMode }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const daysLeft = getDaysUntilExam(subject.examDate);
        const isUrgent = daysLeft <= 7;
        
        return (
          <div
            key={subject.id}
            className={`p-6 transition-all duration-200 hover:scale-[1.02] ${
              darkMode ? 'pixel-card-dark' : 'pixel-card'
            }`}
          >
            {/* Subject Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    {subject.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(subject.examDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {subject.topics.length} topics
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 border-2 border-black text-xs font-bold ${
                  isUrgent 
                    ? 'bg-red-400 text-white'
                    : daysLeft <= 14
                    ? 'bg-yellow-400 text-black'
                    : 'bg-green-400 text-white'
                }`}>
                  {daysLeft > 0 ? `${daysLeft} DAYS LEFT` : 'EXAM TODAY!'}
                </div>
                <button
                  onClick={() => onDelete(subject.id)}
                  className="pixel-button pixel-button-red text-xs p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mt-4">
              {subject.topics.map((topic, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 border-2 border-black text-xs font-bold transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectList;