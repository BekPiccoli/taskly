import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type Note, type Subject } from "@functions/types";
import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

interface NoteViewModalProps {
  visible: boolean;
  note: Note | null;
  subject: Subject;
  onClose: () => void;
  onEdit: () => void;
}

const NoteViewModal: React.FC<NoteViewModalProps> = ({
  visible,
  note,
  subject,
  onClose,
  onEdit,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  if (!note) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    const date = timestamp._seconds
      ? new Date(timestamp._seconds * 1000)
      : new Date(timestamp);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Estilos para o Markdown
  const markdownStyles = {
    body: {
      color: isDarkMode ? "#F9FAFB" : "#111827",
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      fontSize: 24,
      fontWeight: "bold" as const,
      color: isDarkMode ? "#F9FAFB" : "#111827",
      marginBottom: 12,
      marginTop: 16,
    },
    heading2: {
      fontSize: 20,
      fontWeight: "bold" as const,
      color: isDarkMode ? "#F9FAFB" : "#111827",
      marginBottom: 10,
      marginTop: 14,
    },
    heading3: {
      fontSize: 18,
      fontWeight: "bold" as const,
      color: isDarkMode ? "#F9FAFB" : "#111827",
      marginBottom: 8,
      marginTop: 12,
    },
    strong: {
      fontWeight: "bold" as const,
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    em: {
      fontStyle: "italic" as const,
    },
    strikethrough: {
      textDecorationLine: "line-through" as const,
    },
    link: {
      color: subject.color,
      textDecorationLine: "underline" as const,
    },
    list_item: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      marginBottom: 4,
    },
    bullet_list: {
      marginBottom: 12,
    },
    ordered_list: {
      marginBottom: 12,
    },
    code_inline: {
      backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
      color: subject.color,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "monospace",
    },
    code_block: {
      backgroundColor: isDarkMode ? "#1F2937" : "#F9FAFB",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
    },
    fence: {
      backgroundColor: isDarkMode ? "#1F2937" : "#F9FAFB",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? "#374151" : "#E5E7EB",
    },
    blockquote: {
      backgroundColor: isDarkMode ? "#1F2937" : "#F9FAFB",
      borderLeftWidth: 4,
      borderLeftColor: subject.color,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
      fontStyle: "italic",
    },
    hr: {
      backgroundColor: isDarkMode ? "#374151" : "#E5E7EB",
      height: 1,
      marginVertical: 16,
    },
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="rounded-t-3xl"
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            maxHeight: "90%",
          }}
        >
          {/* Header */}
          <View className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-1 pr-4">
              <View className="flex flex-row items-center mb-1">
                {note.pinned && (
                  <MaterialCommunityIcons
                    name="pin"
                    size={18}
                    color="#F59E0B"
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  className="text-xl font-bold flex-1"
                  style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  numberOfLines={2}
                >
                  {note.title}
                </Text>
              </View>
              <Text
                className="text-xs"
                style={{ color: isDarkMode ? "#6B7280" : "#9CA3AF" }}
              >
                {formatDate(note.updatedAt || note.createdAt)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome
                name="close"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Matéria */}
          <View className="px-6 pt-4">
            <View
              className="px-4 py-2 rounded-lg self-start"
              style={{ backgroundColor: subject.color + "20" }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: subject.color }}
              >
                {subject.subjectName}
              </Text>
            </View>
          </View>

          {/* Conteúdo com Markdown */}
          <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={true}>
            <Markdown style={markdownStyles}>{note.content}</Markdown>
          </ScrollView>

          {/* Botão de editar */}
          <View className="px-6 pb-6 pt-2">
            <TouchableOpacity
              onPress={onEdit}
              className="h-12 w-full rounded-lg items-center justify-center"
              style={{ backgroundColor: subject.color }}
            >
              <View className="flex flex-row items-center">
                <FontAwesome name="edit" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">
                  Editar Anotação
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { NoteViewModal };
