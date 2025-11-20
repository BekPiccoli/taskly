import { getId, removeId, saveId } from "@asyncStorageData/index";
import { API_URL } from "@env";
import axios from "axios";
import { type Subject, type Task } from "./types";

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
