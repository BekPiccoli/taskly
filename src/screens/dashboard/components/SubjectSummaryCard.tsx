import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type SubjectSummary } from "@functions/types";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface SubjectSummaryCardProps {
  subject: SubjectSummary;
}

const SubjectSummaryCard: React.FC<SubjectSummaryCardProps> = ({ subject }) => {
  const isDarkMode = useColorScheme() === "dark";
  const navigation = useNavigation();

  const renderIcon = (iconName: string, size = 24) => {
    const color = "#fff";
    const iconLibraries = [
      {
        Component: MaterialIcons,
        icons: [
          "book",
          "science",
          "calculate",
          "biotech",
          "psychology",
          "language",
          "brush",
          "music-note",
          "sports-soccer",
          "computer",
          "gavel",
          "business",
          "history-edu",
          "engineering",
          "theater-comedy",
        ],
      },
      {
        Component: MaterialCommunityIcons,
        icons: [
          "chemistry",
          "flask",
          "atom",
          "dna",
          "brain",
          "math-compass",
          "calculator-variant",
          "laptop",
          "code-tags",
          "earth",
          "basketball",
          "palette",
          "guitar-acoustic",
          "file-document-outline",
          "scale-balance",
        ],
      },
      {
        Component: FontAwesome5,
        icons: [
          "book-open-variant",
          "graduation-cap",
          "flask",
          "microscope",
          "chalkboard-teacher",
          "globe-americas",
        ],
      },
      { Component: Ionicons, icons: ["star", "rocket", "bulb", "telescope"] },
    ];

    for (const { Component, icons } of iconLibraries) {
      if (icons.includes(iconName)) {
        return <Component name={iconName as any} size={size} color={color} />;
      }
    }
    return <MaterialIcons name="book" size={size} color={color} />;
  };

  const { attendance } = subject;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        borderLeftWidth: 6,
        borderLeftColor: subject.color,
      }}
      onPress={() =>
        navigation.navigate("SubjectDetails", { subjectId: subject.subjectId })
      }
    >
      {/* Header with subject color */}
      <View
        className="px-4 py-3 flex flex-row items-center"
        style={{
          backgroundColor: subject.color + "20",
        }}
      >
        <View
          className="w-12 h-12 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: subject.color }}
        >
          {renderIcon(subject.icon, 22)}
        </View>
        <Text
          className="flex-1 text-base font-bold"
          style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
        >
          {subject.subjectName}
        </Text>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Tasks Info */}
        <View className="flex flex-row items-center mb-3">
          <MaterialIcons
            name="assignment"
            size={18}
            color={isDarkMode ? "#9CA3AF" : "#6B7280"}
          />
          <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {subject.pendingTasks === 0
              ? "Nenhuma tarefa pendente"
              : `${subject.pendingTasks} tarefa${
                  subject.pendingTasks > 1 ? "s" : ""
                } pendente${subject.pendingTasks > 1 ? "s" : ""}`}
          </Text>
        </View>

        {/* Attendance Info */}
        <View className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <View className="flex flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Frequência
            </Text>
            <View className="flex flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: attendance.isAtRisk ? "#EF4444" : "#10B981",
                }}
              />
              <Text
                className="text-sm font-bold"
                style={{
                  color: attendance.isAtRisk ? "#EF4444" : "#10B981",
                }}
              >
                {attendance.attendanceRate.toFixed(1)}%
              </Text>
            </View>
          </View>

          {attendance.isAtRisk && (
            <View
              className="mt-2 p-2 rounded-lg flex flex-row items-center"
              style={{
                backgroundColor: isDarkMode ? "#7F1D1D" : "#FEE2E2",
              }}
            >
              <FontAwesome name="warning" size={14} color="#DC2626" />
              <Text className="ml-2 text-xs font-semibold text-red-700">
                Em risco de reprovação por faltas
              </Text>
            </View>
          )}

          <View className="flex flex-row justify-between mt-3">
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Aulas
              </Text>
              <Text className="text-sm font-bold text-gray-900 dark:text-white">
                {attendance.totalClasses}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Presenças
              </Text>
              <Text className="text-sm font-bold text-green-600">
                {attendance.presences}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Faltas
              </Text>
              <Text className="text-sm font-bold text-red-600">
                {attendance.absences}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Atrasos
              </Text>
              <Text className="text-sm font-bold text-orange-600">
                {attendance.lates}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { SubjectSummaryCard };
