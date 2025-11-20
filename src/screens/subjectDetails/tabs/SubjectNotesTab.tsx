import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type Subject } from "@functions/types";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

interface SubjectNotesTabProps {
  subject: Subject;
}

const SubjectNotesTab: React.FC<SubjectNotesTabProps> = ({ subject }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 dark:bg-gray-900 px-8">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" }}
      >
        <MaterialCommunityIcons
          name="notebook-outline"
          size={48}
          color={subject.color}
        />
      </View>
      
      <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">
        Anotações
      </Text>
      
      <Text className="text-center text-gray-600 dark:text-gray-400 text-base mb-6">
        Área de anotações ainda não implementada neste MVP.
      </Text>
      
      <View
        className="p-4 rounded-xl"
        style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}
      >
        <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Em breve você poderá criar e organizar suas anotações de aula diretamente aqui! 📝
        </Text>
      </View>
    </View>
  );
};

export { SubjectNotesTab };
