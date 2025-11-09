import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveId = async (id: string | null) => {
  await AsyncStorage.setItem("userId", id || "");
};

export const getId = async () => {
  const storedId = await AsyncStorage.getItem("userId");
  if (!storedId) return null;
  return storedId;
};

export const removeId = async () => {
  await AsyncStorage.removeItem("userId");
};
