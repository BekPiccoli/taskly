import { ProgressBar } from "@components/progressBar";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Subject } from "@functions/types";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface SubjectCardProps {
  subject: Subject;
  onPressConfig: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onPressConfig }) => {
  const isDarkMode = useColorScheme() === "dark";
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate("SubjectDetails", { subject });
  };

  const renderIcon = (iconName: string, size = 28) => {
    const color = "#fff";
    const iconLibraries = [
      { Component: MaterialIcons, icons: ["book", "science", "calculate", "biotech", "psychology", "language", "brush", "music-note", "sports-soccer", "computer", "gavel", "business", "history-edu", "engineering", "theater-comedy"] },
      { Component: MaterialCommunityIcons, icons: ["chemistry", "flask", "atom", "dna", "brain", "math-compass", "calculator-variant", "laptop", "code-tags", "earth", "basketball", "palette", "guitar-acoustic", "file-document-outline", "scale-balance"] },
      { Component: FontAwesome5, icons: ["book-open-variant", "graduation-cap", "flask", "microscope", "chalkboard-teacher", "globe-americas"] },
      { Component: Ionicons, icons: ["star", "rocket", "bulb", "telescope"] },
    ];

    for (const { Component, icons } of iconLibraries) {
      if (icons.includes(iconName)) {
        return <Component name={iconName as any} size={size} color={color} />;
      }
    }
    return <MaterialIcons name="book" size={size} color={color} />;
  };

  const calculateProgress = () => {
    const total = typeof subject.totalClasses === "number" 
      ? subject.totalClasses 
      : parseInt(String(subject.totalClasses) || "0");
    const completed = 0;
    return { completed, total };
  };

  const { completed, total } = calculateProgress();

  const formatDaysOfWeek = () => {
    if (!subject.daysOfWeek || subject.daysOfWeek.length === 0) {
      return "Não definido";
    }
    if (Array.isArray(subject.daysOfWeek)) {
      return subject.daysOfWeek.join(", ");
    }
    return subject.daysOfWeek;
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.8}
      className="w-full mb-6 rounded-2xl overflow-hidden shadow-lg shadow-slate-300 dark:shadow-slate-800"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
      }}
    >
      <View
        className="px-6 py-5 flex flex-row justify-between items-center"
        style={{
          backgroundColor: subject.color,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <View className="flex flex-row items-center flex-1">
          <View
            className="w-14 h-14 rounded-xl items-center justify-center mr-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            {renderIcon(subject.icon || "book", 28)}
          </View>

          <View className="flex-1">
            <Text className="text-white text-lg font-bold mb-1">
              {subject.subjectName}
            </Text>
            <View className="flex flex-row items-center">
              <FontAwesome
                name="user-circle"
                size={14}
                color="rgba(255, 255, 255, 0.9)"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white text-sm opacity-90">
                {subject.teacherName}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={onPressConfig}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Entypo name="dots-three-vertical" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View className="p-6">
        <View className="flex flex-row items-center mb-4 flex-wrap gap-2">
          <View
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)",
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: subject.color }}
            >
              {subject.semester}
            </Text>
          </View>
          <View
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(16, 185, 129, 0.1)",
            }}
          >
            <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
              {subject.year}
            </Text>
          </View>
          <View
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(168, 85, 247, 0.1)",
            }}
          >
            <Text className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {subject.collegePeriod}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <ProgressBar
            current={completed}
            total={total}
            color={subject.color}
          />
        </View>
        <View className="space-y-2">
          <View className="flex flex-row items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Ionicons
              name="calendar-outline"
              size={18}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
              {formatDaysOfWeek()}
            </Text>
          </View>

          <View className="flex flex-row items-center mt-2">
            <Ionicons
              name="time-outline"
              size={18}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {subject.classTime}
              {subject.classEndTime ? ` - ${subject.classEndTime}` : ""}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { SubjectCard };
