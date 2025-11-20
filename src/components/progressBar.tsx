import React from "react";
import { Text, View } from "react-native";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = "#3B82F6",
  height = 8,
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const remaining = total - current;

  const getProgressColor = () => {
    if (percentage >= 75) return "#10B981";
    if (percentage >= 50) return "#F59E0B"; 
    if (percentage >= 25) return "#F97316"; 
    return "#EF4444"; 
  };

  const progressColor = color || getProgressColor();

  return (
    <View className="w-full">
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          Progresso de Aulas
        </Text>
        <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {current} / {total}
        </Text>
      </View>

      <View
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full  overflow-hidden"
        style={{ height }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: progressColor,
          }}
        />
      </View>

      <View className="flex flex-row justify-between items-center mt-1">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {remaining} aulas restantes
        </Text>
        <Text
          className="text-xs font-bold"
          style={{ color: progressColor }}
        >
          {percentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

export { ProgressBar };
