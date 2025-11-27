import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type Note } from "@functions/types";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const isDarkMode = useColorScheme() === "dark";

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    
    // Se for um objeto do Firestore com _seconds
    const date = timestamp._seconds 
      ? new Date(timestamp._seconds * 1000)
      : new Date(timestamp);
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Truncar conteúdo para preview (removendo sintaxe Markdown)
  const getPreview = () => {
    // Remove markdown básico para preview limpo
    let cleanContent = note.content
      .replace(/[#*_~`]/g, '') // Remove símbolos markdown
      .replace(/\n/g, ' ') // Remove quebras de linha
      .trim();
    
    if (cleanContent.length <= 100) {
      return cleanContent;
    }
    return cleanContent.substring(0, 100) + "...";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 rounded-xl p-4 border"
      style={{
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
      }}
      activeOpacity={0.7}
    >
      {/* Header com título e pin */}
      <View className="flex flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <View className="flex flex-row items-center">
            {note.pinned && (
              <MaterialCommunityIcons
                name="pin"
                size={16}
                color="#F59E0B"
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              className="text-base font-bold flex-1"
              style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
              numberOfLines={2}
            >
              {note.title}
            </Text>
          </View>
        </View>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={isDarkMode ? "#6B7280" : "#9CA3AF"}
        />
      </View>

      {/* Preview do conteúdo */}
      <Text
        className="text-sm mb-3"
        style={{ color: isDarkMode ? "#D1D5DB" : "#6B7280" }}
        numberOfLines={3}
      >
        {getPreview()}
      </Text>

      {/* Footer com data */}
      <View className="flex flex-row items-center">
        <MaterialCommunityIcons
          name="clock-outline"
          size={14}
          color={isDarkMode ? "#6B7280" : "#9CA3AF"}
        />
        <Text
          className="text-xs ml-1"
          style={{ color: isDarkMode ? "#6B7280" : "#9CA3AF" }}
        >
          {formatDate(note.updatedAt || note.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export { NoteCard };
