import axios from "axios";
import { saveId, getId, removeId } from "@asyncStorageData/index";

// const taskly_api = "http://localhost:3001";
const taskly_api = "http://192.168.100.7:3001";

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
  console.log(res.data);
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

export const createSubjects = async (id: string, subjects: object) => {
  try {
    const res = await axios.post(`${taskly_api}/createSubjects`, {
      id,
      subjects,
    });
    return res.data;
  } catch (error) {
    console.error("Create Subjects error:", error);
    throw error;
  }
};

export const getSubjects = async (id: string) => {
  try {
    const res = await axios.post(`${taskly_api}/getSubjects`, {
      id: id,
    });
    console.log("Get Subjects response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Get Subjects error:", error);
    throw error;
  }
};
