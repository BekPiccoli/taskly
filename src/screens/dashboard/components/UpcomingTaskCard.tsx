import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type UpcomingTask } from "@functions/types";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface UpcomingTaskCardProps {
  task: UpcomingTask;
}

const UpcomingTaskCard: React.FC<UpcomingTaskCardProps> = ({ task }) => {
  const isDarkMode = useColorScheme() === "dark";
  const navigation = useNavigation();

  const formatDueDate = (dueOn: number): string => {
    const dateStr = String(dueOn);
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const getDaysUntil = (dueOn: number): number => {
    const dateStr = String(dueOn);
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));

    const dueDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getDaysUntilText = (dueOn: number): string => {
    const days = getDaysUntil(dueOn);

    if (days === 0) return "Hoje";
    if (days === 1) return "Amanhã";
    if (days <= 7) return `Em ${days} dias`;
    return formatDueDate(dueOn);
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case "assignment":
        return <MaterialIcons name="assignment" size={18} color="#3B82F6" />;
      case "exam":
        return (
          <MaterialCommunityIcons
            name="file-document-edit"
            size={18}
            color="#EF4444"
          />
        );
      case "quiz":
        return (
          <MaterialCommunityIcons
            name="help-circle"
            size={18}
            color="#F59E0B"
          />
        );
      case "presentation":
        return (
          <MaterialIcons name="present-to-all" size={18} color="#8B5CF6" />
        );
      case "project":
        return (
          <MaterialCommunityIcons
            name="folder-open"
            size={18}
            color="#10B981"
          />
        );
      default:
        return <MaterialIcons name="task" size={18} color="#6B7280" />;
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

  const days = getDaysUntil(task.dueOn);
  const urgencyColor = days <= 3 ? "#EF4444" : days <= 7 ? "#F59E0B" : "#10B981";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        borderLeftWidth: 4,
        borderLeftColor: urgencyColor,
      }}
      onPress={() =>
        navigation.navigate("SubjectDetails", { subjectId: task.subjectId })
      }
    >
      <View className="p-4">
        <View className="flex flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-3">
            <Text
              className="text-base font-bold mb-1"
              style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
            >
              {task.title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {task.subjectName}
            </Text>
          </View>

          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.2)" : "#EFF6FF" }}
          >
            <Text className="text-xs font-semibold text-blue-600">
              {getDaysUntilText(task.dueOn)}
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-between mt-2">
          <View className="flex flex-row items-center">
            {getTypeIcon()}
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {getTypeLabel()}
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <FontAwesome
              name="calendar"
              size={14}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {formatDueDate(task.dueOn)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { UpcomingTaskCard };
