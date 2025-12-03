import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createTask, deleteTask, getTasks, updateTask } from "@functions/index";
import { type Subject, type Task } from "@functions/types";
import { getId } from "@src/asyncStorageData/index";
import { TaskCard } from "@src/components/taskCard";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TaskFormModal } from "./TaskFormModal";
import { TaskViewModal } from "./TaskViewModal";

interface SubjectTasksTabProps {
  subject: Subject;
}

const SubjectTasksTab: React.FC<SubjectTasksTabProps> = ({ subject }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isDarkMode = useColorScheme() === "dark";

  const loadTasks = useCallback(async () => {
    if (!subject.id) return;

    setLoading(true);
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      const response = await getTasks(userId, { subjectId: subject.id });
      setTasks(response.tasks || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar as tarefas"
      );
    } finally {
      setLoading(false);
    }
  }, [subject.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      if (selectedTask && selectedTask.id) {
        // Atualizar tarefa existente
        await updateTask(userId, selectedTask.id, taskData);
        Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      } else {
        // Criar nova tarefa
        await createTask(userId, taskData);
        Alert.alert("Sucesso", "Tarefa criada com sucesso!");
      }
      setFormModalVisible(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível criar a tarefa"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      await deleteTask(userId, taskId);
      Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
      await loadTasks();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível excluir a tarefa"
      );
      throw error;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      await updateTask(userId, taskId, { status: newStatus });
      
      // Atualizar a task selecionada imediatamente
      if (selectedTask) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
      
      // Recarregar a lista de tasks
      await loadTasks();
      
      Alert.alert("Sucesso", "Status atualizado com sucesso!");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível atualizar o status"
      );
      throw error;
    }
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setViewModalVisible(true);
  };

  const handleEditTask = () => {
    setViewModalVisible(false);
    setFormModalVisible(true);
  };

  const handleCloseFormModal = () => {
    setFormModalVisible(false);
    if (!viewModalVisible) {
      setSelectedTask(null);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color={subject.color} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" }}
            >
              <Ionicons
                name="clipboard-outline"
                size={40}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </View>
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Nenhuma tarefa ainda
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-400 px-8">
              Adicione tarefas para organizar seus trabalhos, provas e projetos
              desta disciplina
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              {tasks.length} {tasks.length === 1 ? "Tarefa" : "Tarefas"}
            </Text>
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onPress={() => handleTaskPress(task)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          setSelectedTask(null);
          setFormModalVisible(true);
        }}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: subject.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal de visualização */}
      <TaskViewModal
        visible={viewModalVisible}
        task={selectedTask}
        subject={subject}
        onClose={handleCloseViewModal}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Modal de criação/edição */}
      <TaskFormModal
        visible={formModalVisible}
        subject={subject}
        task={selectedTask}
        onClose={handleCloseFormModal}
        onSubmit={handleCreateTask}
      />
    </View>
  );
};

export { SubjectTasksTab };
