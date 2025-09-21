import { Subject, StudyPlanItem } from '../types';

export const generateStudyPlan = (subjects: Subject[]): StudyPlanItem[] => {
  const studyPlan: StudyPlanItem[] = [];
  const today = new Date();
  
  // Sort subjects by exam date (earliest first)
  const sortedSubjects = [...subjects].sort((a, b) => 
    new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  // Calculate total available days and days per subject
  const earliestExam = new Date(sortedSubjects[0].examDate);
  const totalDays = Math.max(1, Math.ceil((earliestExam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Create a more sophisticated distribution
  const subjectSchedule: Array<{
    subject: Subject;
    topics: string[];
    daysUntilExam: number;
    priority: number;
    remainingTopics: string[];
  }> = sortedSubjects.map(subject => {
    const daysUntilExam = Math.ceil((new Date(subject.examDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const priority = Math.max(1, Math.ceil(10 / Math.max(1, daysUntilExam))); // Higher priority for closer exams
    
    return {
      subject,
      topics: subject.topics,
      daysUntilExam,
      priority,
      remainingTopics: [...subject.topics],
    };
  });

  const currentDate = new Date(today);
  const totalTopics = sortedSubjects.reduce((sum, subject) => sum + subject.topics.length, 0);
  const studyDaysRatio = Math.min(0.8, totalTopics / Math.max(totalDays, 1)); // 80% study days max
  
  // Generate study plan day by day
  for (let dayOffset = 0; dayOffset < totalDays * 1.2; dayOffset++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + dayOffset);
    
    const dateString = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const isToday = dateString === today.toISOString().split('T')[0];
    
    // Check if any subjects have exams today or have passed
    const availableSubjects = subjectSchedule.filter(item => 
      new Date(item.subject.examDate) >= date && item.remainingTopics.length > 0
    );
    
    if (availableSubjects.length === 0) break;

    // Determine if this should be a study day or rest day
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const shouldStudy = Math.random() < studyDaysRatio || (availableSubjects.some(s => s.daysUntilExam <= 3));

    if (!shouldStudy && !isWeekend && Math.random() > 0.7) {
      // Occasional rest day
      continue;
    }

    // Every 7th day might be a revision day
    if (dayOffset > 0 && dayOffset % 7 === 0 && Math.random() > 0.5) {
      // Create revision day with mixed topics from different subjects
      const revisionTopics: string[] = [];
      availableSubjects.forEach(subjectItem => {
        if (subjectItem.subject.topics.length > subjectItem.remainingTopics.length) {
          // Add some completed topics for revision
          const completedTopics = subjectItem.subject.topics.filter(
            topic => !subjectItem.remainingTopics.includes(topic)
          );
          if (completedTopics.length > 0) {
            revisionTopics.push(`Review: ${completedTopics[Math.floor(Math.random() * completedTopics.length)]}`);
          }
        }
      });

      if (revisionTopics.length > 0) {
        studyPlan.push({
          date: dateString,
          dayName,
          subject: 'Mixed Review',
          topics: revisionTopics.slice(0, 3), // Limit revision topics
          isToday,
          isRevision: true,
          color: 'bg-yellow-500',
        });
        continue;
      }
    }

    // Select subject based on priority and remaining topics
    const weightedSubjects = availableSubjects.map(item => ({
      ...item,
      weight: item.priority * item.remainingTopics.length / Math.max(1, item.daysUntilExam),
    }));
    
    weightedSubjects.sort((a, b) => b.weight - a.weight);
    const selectedSubject = weightedSubjects[0];
    
    // Determine number of topics for this day (1-3 topics max)
    const maxTopicsPerDay = Math.min(3, selectedSubject.remainingTopics.length);
    const topicsPerDay = Math.max(1, Math.min(
      maxTopicsPerDay,
      Math.ceil(selectedSubject.remainingTopics.length / Math.max(1, selectedSubject.daysUntilExam - 2))
    ));
    
    // Assign topics
    const dailyTopics = selectedSubject.remainingTopics.splice(0, topicsPerDay);
    
    if (dailyTopics.length > 0) {
      studyPlan.push({
        date: dateString,
        dayName,
        subject: selectedSubject.subject.name,
        topics: dailyTopics,
        isToday,
        color: selectedSubject.subject.color,
      });
    }
  }

  return studyPlan.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};