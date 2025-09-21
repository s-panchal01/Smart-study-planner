import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Quote, Plus } from 'lucide-react';
import SubjectForm from '../components/SubjectForm';
import SubjectList from '../components/SubjectList';
import StudyPlan from '../components/StudyPlan';
import MotivationalQuotes from '../components/MotivationalQuotes';
import { Subject, StudyPlanItem } from '../types';
import { generateStudyPlan } from '../utils/studyPlanGenerator';

interface StudyPlannerPageProps {
  darkMode: boolean;
}

const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({ darkMode }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem('pixel-studyPlanner-subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Save subjects to localStorage whenever subjects change
  useEffect(() => {
    localStorage.setItem('pixel-studyPlanner-subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject: Omit<Subject, 'id' | 'color'>) => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
      color: colors[subjects.length % colors.length],
    };
    setSubjects([...subjects, newSubject]);
    setShowForm(false);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    setStudyPlan([]);
  };

  const handleGenerateStudyPlan = () => {
    if (subjects.length === 0) return;
    const plan = generateStudyPlan(subjects);
    setStudyPlan(plan);
  };

  const markTopicCompleted = (planItemIndex: number, topicIndex: number) => {
    const updatedPlan = [...studyPlan];
    updatedPlan[planItemIndex].topics[topicIndex] = `✓ ${updatedPlan[planItemIndex].topics[topicIndex].replace('✓ ', '')}`;
    setStudyPlan(updatedPlan);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Motivational Quotes */}
      <MotivationalQuotes darkMode={darkMode} />

      {subjects.length === 0 ? (
        /* Welcome Screen */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-8 pixel-bounce">
              <Calendar className={`w-24 h-24 mx-auto ${darkMode ? 'text-yellow-400' : 'text-purple-600'}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              READY TO LEVEL UP YOUR STUDIES?
            </h2>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Add your subjects and let our 8-bit algorithm create the perfect study schedule!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="pixel-button pixel-button-green text-sm pixel-pulse"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              ADD FIRST SUBJECT
            </button>
          </div>
        </div>
      ) : (
        /* Main Content */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Subjects */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                YOUR SUBJECTS
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="pixel-button pixel-button-green text-xs"
              >
                <Plus className="w-3 h-3 inline mr-1" />
                ADD SUBJECT
              </button>
            </div>
            
            <SubjectList 
              subjects={subjects} 
              onDelete={deleteSubject} 
              darkMode={darkMode}
            />

            {subjects.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={handleGenerateStudyPlan}
                  className="w-full pixel-button pixel-button-purple text-sm py-4"
                >
                  GENERATE STUDY PLAN
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Study Plan */}
          <div className="space-y-6">
            {studyPlan.length > 0 && (
              <>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  YOUR STUDY PLAN
                </h2>
                <StudyPlan 
                  studyPlan={studyPlan} 
                  onMarkCompleted={markTopicCompleted}
                  darkMode={darkMode}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Subject Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full ${
            darkMode ? 'pixel-card-dark' : 'pixel-card'
          }`}>
            <SubjectForm 
              onSubmit={addSubject} 
              onCancel={() => setShowForm(false)}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default StudyPlannerPage;