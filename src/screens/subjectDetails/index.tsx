import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Subject } from "@functions/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SubjectAbsencesTab } from "./tabs/SubjectAbsencesTab";
import { SubjectNotesTab } from "./tabs/SubjectNotesTab";
import { SubjectTasksTab } from "./tabs/SubjectTasksTab";

type TabType = "tasks" | "notes" | "absences";

const SubjectDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === "dark";
  
  // Receber dados da matéria via parâmetros de navegação
  // @ts-ignore
  const subject = route.params?.subject as Subject;
  
  const [activeTab, setActiveTab] = useState<TabType>("tasks");

  if (!subject) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-600 dark:text-gray-400">
          Matéria não encontrada
        </Text>
      </View>
    );
  }

  const renderIcon = (iconName: string, size = 24) => {
    const color = "#fff";
    
    const iconLibraries = [
      { Component: MaterialIcons, icons: ["book", "science", "calculate", "biotech", "psychology", "language", "brush", "music-note", "sports-soccer", "computer", "gavel", "business", "history-edu", "engineering", "theater-comedy"] },
      { Component: MaterialCommunityIcons, icons: ["chemistry", "flask", "atom", "dna", "brain", "math-compass", "calculator-variant", "laptop", "code-tags", "earth", "basketball", "palette", "guitar-acoustic", "file-document-outline", "scale-balance"] },
    ];

    for (const { Component, icons } of iconLibraries) {
      if (icons.includes(iconName)) {
        return <Component name={iconName as any} size={size} color={color} />;
      }
    }

    return <MaterialIcons name="book" size={size} color={color} />;
  };

  const formatDaysOfWeek = () => {
    if (!subject.daysOfWeek || subject.daysOfWeek.length === 0) {
      return "Não definido";
    }
    if (Array.isArray(subject.daysOfWeek)) {
      return subject.daysOfWeek.join(", ");
    }
    return subject.daysOfWeek;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return <SubjectTasksTab subject={subject} />;
      case "notes":
        return <SubjectNotesTab subject={subject} />;
      case "absences":
        return <SubjectAbsencesTab subject={subject} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      {/* Header com informações da matéria */}
      <View
        className="pb-6 pt-12 px-6"
        style={{ backgroundColor: subject.color }}
      >
        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Nome e ícone da matéria */}
        <View className="flex flex-row items-center mb-4">
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            {renderIcon(subject.icon || "book", 32)}
          </View>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">
              {subject.subjectName}
            </Text>
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle" size={16} color="rgba(255, 255, 255, 0.9)" />
              <Text className="text-white text-base ml-2 opacity-90">
                {subject.teacherName}
              </Text>
            </View>
          </View>
        </View>

        {/* Informações adicionais */}
        <View className="flex flex-row flex-wrap gap-2">
          <View
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <Text className="text-white text-sm font-semibold">
              {subject.semester}
            </Text>
          </View>
          <View
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <Text className="text-white text-sm font-semibold">
              {subject.year}
            </Text>
          </View>
          <View
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <Text className="text-white text-sm font-semibold">
              {subject.collegePeriod}
            </Text>
          </View>
        </View>

        {/* Horário e dias */}
        <View className="mt-4 space-y-2">
          <View className="flex flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="rgba(255, 255, 255, 0.9)" />
            <Text className="text-white text-sm ml-2">{formatDaysOfWeek()}</Text>
          </View>
          <View className="flex flex-row items-center">
            <Ionicons name="time-outline" size={18} color="rgba(255, 255, 255, 0.9)" />
            <Text className="text-white text-sm ml-2">
              {subject.classTime}
              {subject.classEndTime ? ` - ${subject.classEndTime}` : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View
        className="flex flex-row border-b"
        style={{
          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          borderBottomColor: isDarkMode ? "#374151" : "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("tasks")}
          className="flex-1 py-4 items-center"
          style={{
            borderBottomWidth: activeTab === "tasks" ? 3 : 0,
            borderBottomColor: subject.color,
          }}
        >
          <MaterialIcons
            name="assignment"
            size={22}
            color={
              activeTab === "tasks"
                ? subject.color
                : isDarkMode
                ? "#9CA3AF"
                : "#6B7280"
            }
          />
          <Text
            className="text-sm font-semibold mt-1"
            style={{
              color:
                activeTab === "tasks"
                  ? subject.color
                  : isDarkMode
                  ? "#9CA3AF"
                  : "#6B7280",
            }}
          >
            Tarefas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("notes")}
          className="flex-1 py-4 items-center"
          style={{
            borderBottomWidth: activeTab === "notes" ? 3 : 0,
            borderBottomColor: subject.color,
          }}
        >
          <MaterialCommunityIcons
            name="notebook"
            size={22}
            color={
              activeTab === "notes"
                ? subject.color
                : isDarkMode
                ? "#9CA3AF"
                : "#6B7280"
            }
          />
          <Text
            className="text-sm font-semibold mt-1"
            style={{
              color:
                activeTab === "notes"
                  ? subject.color
                  : isDarkMode
                  ? "#9CA3AF"
                  : "#6B7280",
            }}
          >
            Anotações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("absences")}
          className="flex-1 py-4 items-center"
          style={{
            borderBottomWidth: activeTab === "absences" ? 3 : 0,
            borderBottomColor: subject.color,
          }}
        >
          <MaterialCommunityIcons
            name="calendar-remove"
            size={22}
            color={
              activeTab === "absences"
                ? subject.color
                : isDarkMode
                ? "#9CA3AF"
                : "#6B7280"
            }
          />
          <Text
            className="text-sm font-semibold mt-1"
            style={{
              color:
                activeTab === "absences"
                  ? subject.color
                  : isDarkMode
                  ? "#9CA3AF"
                  : "#6B7280",
            }}
          >
            Faltas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View className="flex-1">{renderTabContent()}</View>
    </View>
  );
};

export { SubjectDetailsScreen };
