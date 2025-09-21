import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

interface SubjectFormProps {
  onSubmit: (subject: { name: string; topics: string[]; examDate: string }) => void;
  onCancel: () => void;
  darkMode: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit, onCancel, darkMode }) => {
  const [name, setName] = useState('');
  const [topics, setTopics] = useState<string[]>(['']);
  const [examDate, setExamDate] = useState('');

  const addTopicField = () => {
    setTopics([...topics, '']);
  };

  const removeTopicField = (index: number) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index: number, value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = value;
    setTopics(updatedTopics);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !examDate) {
      alert('Please fill in all required fields');
      return;
    }

    const filteredTopics = topics.filter(topic => topic.trim());
    if (filteredTopics.length === 0) {
      alert('Please add at least one topic');
      return;
    }

    onSubmit({
      name: name.trim(),
      topics: filteredTopics,
      examDate,
    });

    // Reset form
    setName('');
    setTopics(['']);
    setExamDate('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
          ADD NEW SUBJECT
        </h3>
        <button
          onClick={onCancel}
          className="pixel-button pixel-button-red text-xs p-2"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Name */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-black'
          }`}>
            SUBJECT NAME *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="MATHEMATICS, PHYSICS..."
            className={`pixel-input text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            required
          />
        </div>

        {/* Topics */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-black'
          }`}>
            TOPICS *
          </label>
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => updateTopic(index, e.target.value)}
                  placeholder={`TOPIC ${index + 1}`}
                  className={`flex-1 pixel-input text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                />
                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopicField(index)}
                    className="pixel-button pixel-button-red text-xs p-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTopicField}
            className="mt-3 pixel-button pixel-button-blue text-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2">ADD TOPIC</span>
          </button>
        </div>

        {/* Exam Date */}
        <div>
          <label className={`block text-xs font-bold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-black'
          }`}>
            EXAM DATE *
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-black'
            }`} />
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 pixel-input text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 pixel-button pixel-button-red text-xs py-3"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="flex-1 pixel-button pixel-button-green text-xs py-3"
          >
            ADD SUBJECT
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;