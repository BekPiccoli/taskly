import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type Subject } from "@functions/types";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

interface SubjectAbsencesTabProps {
  subject: Subject;
}

const SubjectAbsencesTab: React.FC<SubjectAbsencesTabProps> = ({ subject }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 dark:bg-gray-900 px-8">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" }}
      >
        <MaterialCommunityIcons
          name="calendar-remove"
          size={48}
          color={subject.color}
        />
      </View>
      
      <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">
        Controle de Faltas
      </Text>
      
      <Text className="text-center text-gray-600 dark:text-gray-400 text-base mb-6">
        Aqui você poderá controlar suas faltas nessa disciplina (em desenvolvimento).
      </Text>
      
      <View
        className="p-4 rounded-xl"
        style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}
      >
        <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Em breve você poderá registrar e acompanhar sua frequência nas aulas! 📅
        </Text>
      </View>
    </View>
  );
};

export { SubjectAbsencesTab };
