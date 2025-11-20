export type Subject = {
  id?: string;
  subjectName: string;
  teacherName: string;
  color: string;
  icon: string;
  totalClasses: number;
  classTime: string; // Horário de início da aula
  semester: string;
  year: number;
  collegePeriod: string;
  daysOfWeek?: string[];
  classEndTime?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type TaskType = "assignment" | "exam" | "quiz" | "presentation" | "project" | "other";
export type TaskStatus = "pending" | "delivered" | "completed";

export type Task = {
  id?: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  subjectId: string;
  subjectName?: string;
  dueOn: number; // Formato YYYYMMDD
  notes?: string;
  isOverdue?: boolean;
  createdAt?: any;
  updatedAt?: any;
};
