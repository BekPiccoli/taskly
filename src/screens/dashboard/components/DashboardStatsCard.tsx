import React from "react";
import { Text, useColorScheme, View } from "react-native";

interface DashboardStatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  icon,
  label,
  value,
  color,
  bgColor,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View
      className="flex-1 rounded-2xl p-4 shadow-sm"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
      }}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </View>
      <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </Text>
      <Text
        className="text-2xl font-extrabold"
        style={{ color: isDarkMode ? color : color }}
      >
        {value}
      </Text>
    </View>
  );
};

export { DashboardStatsCard };
