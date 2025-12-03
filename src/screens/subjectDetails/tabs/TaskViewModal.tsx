import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Subject, type Task } from "@functions/types";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface TaskViewModalProps {
  visible: boolean;
  task: Task | null;
  subject: Subject;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (taskId: string) => Promise<void>;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => Promise<void>;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({
  visible,
  task,
  subject,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(task);

  // Atualizar currentTask quando task mudar
  React.useEffect(() => {
    if (task) {
      setCurrentTask(task);
    }
  }, [task]);

  if (!currentTask) return null;

  const formatDueDate = (dueOn: number): string => {
    const dateStr = String(dueOn);
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const getTypeIcon = () => {
    switch (currentTask.type) {
      case "assignment":
        return <MaterialIcons name="assignment" size={24} color="#3B82F6" />;
      case "exam":
        return (
          <MaterialCommunityIcons
            name="file-document-edit"
            size={24}
            color="#EF4444"
          />
        );
      case "quiz":
        return (
          <MaterialCommunityIcons
            name="help-circle"
            size={24}
            color="#F59E0B"
          />
        );
      case "presentation":
        return <MaterialIcons name="present-to-all" size={24} color="#8B5CF6" />;
      case "project":
        return (
          <MaterialCommunityIcons
            name="folder-open"
            size={24}
            color="#10B981"
          />
        );
      case "other":
        return <MaterialIcons name="more-horiz" size={24} color="#6B7280" />;
      default:
        return <MaterialIcons name="task" size={24} color="#6B7280" />;
    }
  };

  const getTypeLabel = () => {
    const types: Record<string, string> = {
      assignment: "Trabalho",
      exam: "Prova",
      quiz: "Quiz",
      presentation: "Apresentação",
      project: "Projeto",
      other: "Outro",
    };
    return types[currentTask.type] || currentTask.type;
  };

  const getStatusLabel = () => {
    const statuses: Record<string, string> = {
      pending: "Pendente",
      delivered: "Entregue",
      completed: "Concluído",
    };
    return statuses[currentTask.status] || currentTask.status;
  };

  const getStatusColor = () => {
    switch (currentTask.status) {
      case "completed":
        return {
          bg: isDarkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
          text: "#10B981",
        };
      case "delivered":
        return {
          bg: isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
          text: "#3B82F6",
        };
      case "pending":
        return {
          bg: isDarkMode ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.1)",
          text: "#F59E0B",
        };
      default:
        return {
          bg: isDarkMode ? "rgba(107, 114, 128, 0.2)" : "rgba(107, 114, 128, 0.1)",
          text: "#6B7280",
        };
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!currentTask.id) return;
            setDeleting(true);
            try {
              await onDelete(currentTask.id);
              onClose();
            } catch (error) {
              // Erro já tratado no componente pai
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (!currentTask.id || currentTask.status === newStatus) return;
    
    setChangingStatus(true);
    try {
      await onStatusChange(currentTask.id, newStatus);
      // Atualizar o estado local imediatamente
      setCurrentTask({ ...currentTask, status: newStatus });
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setChangingStatus(false);
    }
  };

  const statusColor = getStatusColor();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="rounded-t-3xl"
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            maxHeight: "90%",
          }}
        >
          {/* Header */}
          <View className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Detalhes da Tarefa
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome
                name="close"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6 py-4">
            {/* Disciplina */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                DISCIPLINA
              </Text>
              <View
                className="px-4 py-3 rounded-lg flex-row items-center"
                style={{ backgroundColor: subject.color + "20" }}
              >
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: subject.color }}
                />
                <Text className="font-semibold" style={{ color: subject.color }}>
                  {subject.subjectName}
                </Text>
              </View>
            </View>

            {/* Título */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                TÍTULO
              </Text>
              <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {currentTask.title}
              </Text>
            </View>

            {/* Tipo e Status */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  TIPO
                </Text>
                <View
                  className="px-4 py-3 rounded-lg flex-row items-center"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                  }}
                >
                  {getTypeIcon()}
                  <Text
                    className="ml-3 font-semibold"
                    style={{
                      color: isDarkMode ? "#D1D5DB" : "#374151",
                    }}
                  >
                    {getTypeLabel()}
                  </Text>
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  STATUS
                </Text>
                <View
                  className="px-4 py-3 rounded-lg items-center justify-center"
                  style={{ backgroundColor: statusColor.bg }}
                >
                  <Text
                    className="font-semibold"
                    style={{ color: statusColor.text }}
                  >
                    {getStatusLabel()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Data de entrega */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                DATA DE ENTREGA
              </Text>
              <View
                className="px-4 py-3 rounded-lg flex-row items-center"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                }}
              >
                {currentTask.isOverdue && currentTask.status === "pending" ? (
                  <MaterialIcons name="warning" size={20} color="#EF4444" />
                ) : (
                  <FontAwesome
                    name="calendar"
                    size={18}
                    color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                )}
                <Text
                  className="ml-3 font-semibold capitalize"
                  style={{
                    color:
                      currentTask.isOverdue && currentTask.status === "pending"
                        ? "#EF4444"
                        : isDarkMode
                        ? "#D1D5DB"
                        : "#374151",
                  }}
                >
                  {formatDueDate(currentTask.dueOn)}
                </Text>
              </View>
              {currentTask.isOverdue && currentTask.status === "pending" && (
                <Text className="text-sm text-red-500 mt-2">
                  ⚠️ Esta tarefa está atrasada
                </Text>
              )}
            </View>

            {/* Anotações */}
            {currentTask.notes && currentTask.notes.trim() !== "" && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  ANOTAÇÕES
                </Text>
                <View
                  className="px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                  }}
                >
                  <Text
                    className="text-base leading-6"
                    style={{
                      color: isDarkMode ? "#D1D5DB" : "#374151",
                    }}
                  >
                    {currentTask.notes}
                  </Text>
                </View>
              </View>
            )}

            {/* Alterar Status */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                ALTERAR STATUS
              </Text>
              <View className="flex-row gap-2 flex-wrap">
                <TouchableOpacity
                  onPress={() => handleStatusChange("pending")}
                  disabled={changingStatus || currentTask.status === "pending"}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      currentTask.status === "pending"
                        ? "#F59E0B"
                        : isDarkMode
                        ? "#374151"
                        : "#F3F4F6",
                    opacity: changingStatus ? 0.5 : 1,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color:
                        currentTask.status === "pending"
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#D1D5DB"
                          : "#6B7280",
                    }}
                  >
                    Pendente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStatusChange("delivered")}
                  disabled={changingStatus || currentTask.status === "delivered"}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      currentTask.status === "delivered"
                        ? "#3B82F6"
                        : isDarkMode
                        ? "#374151"
                        : "#F3F4F6",
                    opacity: changingStatus ? 0.5 : 1,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color:
                        currentTask.status === "delivered"
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#D1D5DB"
                          : "#6B7280",
                    }}
                  >
                    Entregue
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStatusChange("completed")}
                  disabled={changingStatus || currentTask.status === "completed"}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      currentTask.status === "completed"
                        ? "#10B981"
                        : isDarkMode
                        ? "#374151"
                        : "#F3F4F6",
                    opacity: changingStatus ? 0.5 : 1,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color:
                        currentTask.status === "completed"
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#D1D5DB"
                          : "#6B7280",
                    }}
                  >
                    Concluído
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botões de ação */}
            <View className="flex-row gap-3 mt-4 mb-6">
              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleting}
                className="flex-1 h-12 rounded-lg items-center justify-center flex-row"
                style={{
                  backgroundColor: "#EF4444",
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                <FontAwesome name="trash" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">
                  {deleting ? "Excluindo..." : "Excluir"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onEdit}
                disabled={deleting}
                className="flex-1 h-12 rounded-lg items-center justify-center flex-row"
                style={{
                  backgroundColor: subject.color,
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                <FontAwesome name="edit" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">Editar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export { TaskViewModal };
