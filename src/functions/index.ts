import axios from "axios";
import { saveId, getId, removeId } from "@asyncStorageData/index";
import { type Subject } from "./types";
const taskly_api = "http://localhost:3001";
// const taskly_api = "http://192.168.100.7:3001";

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
    console.error("erro: ", error);
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
    console.error("Logout error:", error);
  } finally {
    await removeId();
  }
};

export const createSubjects = async (id: string, subjects: Subject) => {
  try {
    const res = await axios.post(`${taskly_api}/subjects/createSubjects`, {
      id: id,
      subject: subjects,
    });
    return res.data;
  } catch (error) {
    console.error("Create Subjects error:", error);
    throw error;
  }
};

export const getSubjects = async (id: string) => {
  try {
    const res = await axios.post(`${taskly_api}/subjects/getSubjects`, {
      id,
    });

    if (!res.data || res.data === undefined || res.data.length === 0) {
      return;
    }
    return res.data;
  } catch (error) {
    console.error("Get Subjects error:", error);
  }
};

export const updateSubjects = async (id: string, subjects: Subject) => {
  try {
    const res = await axios.patch(`${taskly_api}/subjects/updateSubject`, {
      id,
      subject: subjects,
    });
    return res.data;
  } catch (error) {
    console.error("Update Subjects error:", error);
  }
};

export const deleteSubjects = async (id: string, subjectId: string) => {
  try {
    const res = await axios.delete(`${taskly_api}/subjects/deleteSubject`, {
      data: { id, subjectId },
    });
    return res.data;
  } catch (error) {
    console.error("Delete Subjects error:", error);
  }
};
