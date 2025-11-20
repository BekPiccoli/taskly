import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Task } from "@functions/types";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const isDarkMode = useColorScheme() === "dark";

  const formatDueDate = (dueOn: number): string => {
    const dateStr = String(dueOn);
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short",
      year: "numeric"
    });
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case "assignment":
        return <MaterialIcons name="assignment" size={20} color="#3B82F6" />;
      case "exam":
        return <MaterialCommunityIcons name="file-document-edit" size={20} color="#EF4444" />;
      case "quiz":
        return <MaterialCommunityIcons name="help-circle" size={20} color="#F59E0B" />;
      case "presentation":
        return <MaterialIcons name="present-to-all" size={20} color="#8B5CF6" />;
      case "project":
        return <MaterialCommunityIcons name="folder-open" size={20} color="#10B981" />;
      case "other":
        return <MaterialIcons name="more-horiz" size={20} color="#6B7280" />;
      default:
        return <MaterialIcons name="task" size={20} color="#6B7280" />;
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
    return types[task.type] || task.type;
  };
  const getStatusLabel = () => {
    const statuses: Record<string, string> = {
      pending: "Pendente",
      delivered: "Entregue",
      completed: "Concluído",
    };
    return statuses[task.status] || task.status;
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return { bg: isDarkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)", text: "#10B981" };
      case "delivered":
        return { bg: isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)", text: "#3B82F6" };
      case "pending":
        return { bg: isDarkMode ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.1)", text: "#F59E0B" };
      default:
        return { bg: isDarkMode ? "rgba(107, 114, 128, 0.2)" : "rgba(107, 114, 128, 0.1)", text: "#6B7280" };
    }
  };

  const statusColor = getStatusColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-full mb-4 rounded-xl overflow-hidden shadow-md"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        borderLeftWidth: 4,
        borderLeftColor: task.isOverdue && task.status === "pending" ? "#EF4444" : "#3B82F6",
      }}
    >
      <View className="p-4">
        <View className="flex flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text 
              className="text-base font-bold mb-1"
              style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
            >
              {task.title}
            </Text>
            {task.subjectName && (
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {task.subjectName}
              </Text>
            )}
          </View>
          
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusColor.bg }}
          >
            <Text className="text-xs font-semibold" style={{ color: statusColor.text }}>
              {getStatusLabel()}
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            {getTypeIcon()}
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {getTypeLabel()}
            </Text>
          </View>

          <View className="flex flex-row items-center">
            {task.isOverdue && task.status === "pending" ? (
              <MaterialIcons name="warning" size={16} color="#EF4444" />
            ) : (
              <FontAwesome name="calendar" size={14} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
            )}
            <Text 
              className="text-sm ml-2"
              style={{ 
                color: task.isOverdue && task.status === "pending" ? "#EF4444" : isDarkMode ? "#9CA3AF" : "#6B7280" 
              }}
            >
              {formatDueDate(task.dueOn)}
            </Text>
          </View>
        </View>

        {task.notes && task.notes.trim() !== "" && (
          <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Text 
              className="text-sm text-gray-600 dark:text-gray-400"
              numberOfLines={2}
            >
              {task.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export { TaskCard };
