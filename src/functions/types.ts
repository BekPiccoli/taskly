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

export type Note = {
  id?: string;
  title: string;
  content: string;
  subjectId: string;
  subjectName?: string;
  pinned?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type AttendanceStatus = "present" | "absent" | "late" | "justified";

export type Attendance = {
  id?: string; // Data no formato YYYY-MM-DD (usado como ID no backend)
  date: string; // Formato YYYY-MM-DD
  status: AttendanceStatus;
  subjectId: string;
  subjectName?: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type AttendanceStats = {
  total: number;
  present: number;
  absent: number;
  late: number;
  justified: number;
  attendanceRate: string; // Porcentagem em string (ex: "80.00")
};

// ========================================
// DASHBOARD TYPES
// ========================================

export type UpcomingTask = {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  type: TaskType;
  status: TaskStatus;
  dueOn: number; // Formato YYYYMMDD
  isOverdue: boolean;
};

export type TasksSummary = {
  total: number;
  pending: number;
  delivered: number;
  completed: number;
  overdue: number;
};

export type SubjectSummary = {
  subjectId: string;
  subjectName: string;
  color: string;
  icon: string;
  pendingTasks: number;
  attendance: {
    totalClasses: number;
    absences: number;
    presences: number;
    lates: number;
    justified: number;
    attendanceRate: number;
    isAtRisk: boolean;
  };
};

export type AttendanceSummary = {
  totalClasses: number;
  absences: number;
  presences: number;
  lates: number;
  justified: number;
  attendanceRate: number;
};

export type DashboardOverview = {
  upcomingTasks: UpcomingTask[];
  tasksSummary: TasksSummary;
  subjectsSummary: SubjectSummary[];
  attendanceSummary: AttendanceSummary;
};
