import { getId, removeId, saveId } from "@asyncStorageData/index";
import { API_URL } from "@env";
import axios from "axios";
import { type Note, type Subject, type Task } from "./types";

const taskly_api = API_URL;

export const verifyAuthentication = async () => {
  try {
    const id = await getId();
    if (!id) {
      return;
    }
    const res = await axios.post(`${taskly_api}/verifyAuthentication`, {
      id: id,
    });
    const isAuthenticated = res.data.isAuthenticated;
    return isAuthenticated;
  } catch (error) {
  }
};
export const register = async (email: string, password: string) => {
  const res = await axios.post(`${taskly_api}/signup`, {
    email,
    password,
  });
  const id = res.data.id;
  saveId(id);
};

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${taskly_api}/login`, {
    email,
    password,
  });

  const id = res.data.id;
  const idExist = await getId();


  if (!idExist) await saveId(id);
};

export const logout = async () => {
  try {
    const id = await getId();
    await axios.post(`${taskly_api}/logout`, {
      id: id,
    });
  } catch (error) {
  } finally {
    await removeId();
  }
};

export const createSubjects = async (id: string, subjects: Subject) => {
  try {
    const res = await axios.post(`${taskly_api}/subjects`, {
      id: id,
      subject: subjects,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao criar matéria";
    const errorDetails = error.response?.data?.details;

    
    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const getSubjects = async (id: string) => {
  try {
    const res = await axios.get(`${taskly_api}/subjects`, {
      params: { userId: id }
    });
    if (!res.data || res.data === undefined) {
      return { subjects: [] };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar matérias";
    throw new Error(errorMessage);
  }
};

export const updateSubjects = async (id: string, subjects: Subject) => {
  try {
    if (!subjects.id) {
      throw new Error("Subject ID is required for update");
    }

    const res = await axios.patch(`${taskly_api}/subjects/${subjects.id}`, {
      id,
      subject: subjects,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao atualizar matéria";
    const errorDetails = error.response?.data?.details;
    
    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const deleteSubjects = async (id: string, subjectId: string) => {
  try {
    const res = await axios.delete(`${taskly_api}/subjects/${subjectId}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao deletar matéria";
    throw new Error(errorMessage);
  }
};

export const createTask = async (id: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const res = await axios.post(`${taskly_api}/tasks`, {
      id: id,
      task: task,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao criar tarefa";
    const errorDetails = error.response?.data?.details;

    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const getTasks = async (id: string, filters?: {
  subjectId?: string;
  status?: string;
  type?: string;
  isOverdue?: boolean;
  dueOnStart?: number;
  dueOnEnd?: number;
}) => {
  try {
    const params: any = { userId: id };
    
    if (filters) {
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.isOverdue !== undefined) params.isOverdue = filters.isOverdue;
      if (filters.dueOnStart) params.dueOnStart = filters.dueOnStart;
      if (filters.dueOnEnd) params.dueOnEnd = filters.dueOnEnd;
    }

    const res = await axios.get(`${taskly_api}/tasks`, { params });
    
    if (!res.data || res.data === undefined) {
      return { tasks: [] };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar tarefas";
    throw new Error(errorMessage);
  }
};

export const getTaskById = async (id: string, taskId: string) => {
  try {
    const res = await axios.get(`${taskly_api}/tasks/${taskId}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar tarefa";
    throw new Error(errorMessage);
  }
};

export const updateTask = async (id: string, taskId: string, updates: Partial<Task>) => {
  try {
    const res = await axios.patch(`${taskly_api}/tasks/${taskId}`, {
      id,
      updates,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao atualizar tarefa";
    const errorDetails = error.response?.data?.details;
    
    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const deleteTask = async (id: string, taskId: string) => {
  try {
    const res = await axios.delete(`${taskly_api}/tasks/${taskId}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao deletar tarefa";
    throw new Error(errorMessage);
  }
};

// ========================================
// NOTES (ANOTAÇÕES)
// ========================================

export const createNote = async (id: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const res = await axios.post(`${taskly_api}/notes`, {
      id: id,
      note: note,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao criar anotação";
    const errorDetails = error.response?.data?.details;

    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const getNotes = async (id: string, filters?: {
  subjectId?: string;
  pinned?: boolean;
  search?: string;
}) => {
  try {
    const params: any = { userId: id };
    
    if (filters) {
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.pinned !== undefined) params.pinned = filters.pinned;
      if (filters.search) params.search = filters.search;
    }

    const res = await axios.get(`${taskly_api}/notes`, { params });
    
    if (!res.data || res.data === undefined) {
      return { notes: [] };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar anotações";
    throw new Error(errorMessage);
  }
};

export const getNoteById = async (id: string, noteId: string) => {
  try {
    const res = await axios.get(`${taskly_api}/notes/${noteId}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar anotação";
    throw new Error(errorMessage);
  }
};

export const updateNote = async (id: string, noteId: string, updates: Partial<Note>) => {
  try {
    const res = await axios.patch(`${taskly_api}/notes/${noteId}`, {
      id,
      ...updates,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao atualizar anotação";
    const errorDetails = error.response?.data?.details;
    
    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const deleteNote = async (id: string, noteId: string) => {
  try {
    const res = await axios.delete(`${taskly_api}/notes/${noteId}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao deletar anotação";
    throw new Error(errorMessage);
  }
};

// ========================================
// ATTENDANCE (FALTAS/PRESENÇAS)
// ========================================

export const getAttendanceBySubject = async (
  id: string,
  subjectId: string,
  filters?: {
    status?: string;
    dateStart?: string;
    dateEnd?: string;
    limit?: number;
  }
) => {
  try {
    const params: any = { userId: id };

    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.dateStart) params.dateStart = filters.dateStart;
      if (filters.dateEnd) params.dateEnd = filters.dateEnd;
      if (filters.limit) params.limit = filters.limit;
    }

    const res = await axios.get(`${taskly_api}/subjects/${subjectId}/attendance`, { params });

    if (!res.data || res.data === undefined) {
      return { attendance: [] };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar registros de presença";
    throw new Error(errorMessage);
  }
};

export const getAttendanceStats = async (id: string, subjectId: string) => {
  try {
    const params = { userId: id };
    const res = await axios.get(`${taskly_api}/subjects/${subjectId}/attendance-stats`, { params });

    if (!res.data || res.data === undefined) {
      return {
        stats: {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          justified: 0,
          attendanceRate: "0.00",
        },
      };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar estatísticas de presença";
    throw new Error(errorMessage);
  }
};

export const upsertAttendance = async (
  id: string,
  subjectId: string,
  attendanceData: {
    date: string;
    status: string;
    subjectName?: string;
    notes?: string;
  }
) => {
  try {
    const res = await axios.post(`${taskly_api}/subjects/${subjectId}/attendance`, {
      id: id,
      attendance: attendanceData,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao salvar registro de presença";
    const errorDetails = error.response?.data?.details;

    if (errorDetails) {
      throw new Error(`${errorMessage}: ${errorDetails.join(", ")}`);
    }
    throw new Error(errorMessage);
  }
};

export const deleteAttendance = async (id: string, subjectId: string, date: string) => {
  try {
    const res = await axios.delete(`${taskly_api}/subjects/${subjectId}/attendance/${date}`, {
      data: { id },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao deletar registro de presença";
    throw new Error(errorMessage);
  }
};

// ========================================
// DASHBOARD
// ========================================

export const getDashboardOverview = async (id: string, upcomingLimit?: number) => {
  try {
    const params: any = { userId: id };
    
    if (upcomingLimit) {
      params.upcomingLimit = upcomingLimit;
    }

    const res = await axios.get(`${taskly_api}/dashboard`, { params });
    
    if (!res.data || res.data === undefined) {
      return {
        data: {
          upcomingTasks: [],
          tasksSummary: {
            total: 0,
            pending: 0,
            delivered: 0,
            completed: 0,
            overdue: 0,
          },
          subjectsSummary: [],
          attendanceSummary: {
            totalClasses: 0,
            absences: 0,
            presences: 0,
            lates: 0,
            justified: 0,
            attendanceRate: 0,
          },
        },
      };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar dashboard";
    throw new Error(errorMessage);
  }
};

export const getTasksSummary = async (id: string) => {
  try {
    const params = { userId: id };
    const res = await axios.get(`${taskly_api}/dashboard/tasks-summary`, { params });
    
    if (!res.data || res.data === undefined) {
      return {
        data: {
          total: 0,
          pending: 0,
          delivered: 0,
          completed: 0,
          overdue: 0,
        },
      };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar resumo de tarefas";
    throw new Error(errorMessage);
  }
};

export const getUpcomingTasks = async (id: string, limit?: number) => {
  try {
    const params: any = { userId: id };
    
    if (limit) {
      params.limit = limit;
    }

    const res = await axios.get(`${taskly_api}/dashboard/upcoming-tasks`, { params });
    
    if (!res.data || res.data === undefined) {
      return { data: [] };
    }
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Erro ao buscar próximas tarefas";
    throw new Error(errorMessage);
  }
};
