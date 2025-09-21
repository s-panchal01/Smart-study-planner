export interface Subject {
  id: string;
  name: string;
  topics: string[];
  examDate: string;
  color: string;
}

export interface StudyPlanItem {
  date: string;
  dayName: string;
  subject: string;
  topics: string[];
  isToday: boolean;
  isRevision?: boolean;
  color: string;
}