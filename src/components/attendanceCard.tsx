import Ionicons from "@expo/vector-icons/Ionicons";
import { type Attendance } from "@functions/types";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface AttendanceCardProps {
  attendance: Attendance;
  onPress: () => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  onPress,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  const getStatusInfo = () => {
    switch (attendance.status) {
      case "present":
        return {
          label: "Presente",
          icon: "checkmark-circle" as const,
          color: "#10B981", // Verde
          bgColor: isDarkMode ? "#064E3B" : "#D1FAE5",
        };
      case "absent":
        return {
          label: "Falta",
          icon: "close-circle" as const,
          color: "#EF4444", // Vermelho
          bgColor: isDarkMode ? "#7F1D1D" : "#FEE2E2",
        };
      case "late":
        return {
          label: "Atrasado",
          icon: "time" as const,
          color: "#F59E0B", // Amarelo
          bgColor: isDarkMode ? "#78350F" : "#FEF3C7",
        };
      case "justified":
        return {
          label: "Justificada",
          icon: "document-text" as const,
          color: "#3B82F6", // Azul
          bgColor: isDarkMode ? "#1E3A8A" : "#DBEAFE",
        };
      default:
        return {
          label: "Desconhecido",
          icon: "help-circle" as const,
          color: "#6B7280",
          bgColor: isDarkMode ? "#374151" : "#E5E7EB",
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="flex flex-row items-center p-4">
        {/* Ícone de status */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: statusInfo.bgColor }}
        >
          <Ionicons name={statusInfo.icon} size={24} color={statusInfo.color} />
        </View>

        {/* Informações */}
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between mb-1">
            <Text
              className="text-base font-bold"
              style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
            >
              {formatDate(attendance.date)}
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: statusInfo.bgColor }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.label}
              </Text>
            </View>
          </View>

          {attendance.notes && attendance.notes.trim() !== "" && (
            <Text
              className="text-sm mt-1"
              numberOfLines={2}
              style={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }}
            >
              {attendance.notes}
            </Text>
          )}
        </View>

        {/* Seta para indicar que é clicável */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDarkMode ? "#6B7280" : "#9CA3AF"}
          style={{ marginLeft: 8 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export { AttendanceCard };
