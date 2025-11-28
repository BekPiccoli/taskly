import { getTasks } from "@functions/index";
import { getId } from "@src/asyncStorageData";
import * as Notifications from "expo-notifications";

export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
};

export const getPendingTasks = async () => {
  try {
    const id = await getId();
    if (!id) throw new Error("User ID not found");
    const response = await getTasks(id, { status: "pending" });
    console.log("Pending tasks fetched successfully:", response.tasks);
    return response.tasks;
  } catch (error) {
    console.error("Error fetching pending tasks:", error);
    throw error;
  }
};

export const getTasksWithSelectedFields = async () => {
  try {
    const id = await getId();
    if (!id) throw new Error("User ID not found");
    const response = await getTasks(id);
    const tasks = response.tasks.map((task: any) => ({
      id: task.id,
      dueOn:
        typeof task.dueOn === "number"
          ? new Date(task.dueOn).toLocaleString()
          : null,
      notes: task.notes,
      subjectName: task.subjectName,
      type: task.type,
    }));
    console.log("Tasks with selected fields fetched successfully:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks with selected fields:", error);
    throw error;
  }
};

export const notifyTasksDueToday = async () => {
  try {
    const id = await getId();
    if (!id) throw new Error("User ID not found");
    const response = await getTasks(id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    response.tasks.forEach((task: any) => {
      if (typeof task.dueOn === "number") {
        const dueOnStr = task.dueOn.toString();
        const year = parseInt(dueOnStr.substring(0, 4), 10);
        const month = parseInt(dueOnStr.substring(4, 6), 10) - 1;
        const day = parseInt(dueOnStr.substring(6, 8), 10);
        const dueDate = new Date(year, month, day);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          console.log(`Task due today: ${task.subjectName}`);
          sendLocalNotification(
            "Tarefa vence hoje!",
            `A o prazo para a tarefa de "${task.subjectName}" do tipo "${task.type}" vence hoje! \n  Suas anotações: ${task.notes || "Sem detalhes adicionais."}`
          );
        }
      }
    });
  } catch (error) {
    console.error("Error notifying tasks due today:", error);
    throw error;
  }
};
