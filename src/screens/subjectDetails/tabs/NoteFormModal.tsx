import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type Note, type Subject } from "@functions/types";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface NoteFormModalProps {
  visible: boolean;
  subject: Subject;
  note?: Note | null; // Se fornecido, é modo de edição
  onClose: () => void;
  onSubmit: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onDelete?: (noteId: string) => Promise<void>;
}

const NoteFormModal: React.FC<NoteFormModalProps> = ({
  visible,
  subject,
  note,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Preencher campos se estiver editando
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setPinned(note.pinned || false);
    } else {
      // Limpar campos se for nova nota
      setTitle("");
      setContent("");
      setPinned(false);
    }
  }, [note, visible]);

  const handleSubmit = async () => {
    // Validações
    if (!title.trim()) {
      Alert.alert("Erro", "Por favor, insira um título para a anotação");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Erro", "Por favor, insira o conteúdo da anotação");
      return;
    }

    const noteData: Omit<Note, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      content: content.trim(),
      subjectId: subject.id!,
      subjectName: subject.subjectName,
      pinned,
    };

    setSubmitting(true);
    try {
      await onSubmit(noteData);
      // Limpar formulário
      setTitle("");
      setContent("");
      setPinned(false);
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!note?.id || !onDelete) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta anotação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              await onDelete(note.id!);
            } catch (error) {
              // Erro já tratado no componente pai
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const isEditMode = !!note;

  // Função para inserir markdown no texto
  const insertMarkdown = (before: string, after: string) => {
    // Simplesmente adiciona o markdown no final do conteúdo
    const newContent = content + before + after;
    setContent(newContent);
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
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {isEditMode ? "Editar Anotação" : "Nova Anotação"}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={submitting}>
              <FontAwesome
                name="close"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-6 py-4"
            keyboardShouldPersistTaps="handled"
          >
            {/* Matéria */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Disciplina
              </Text>
              <View
                className="px-4 py-3 rounded-lg"
                style={{ backgroundColor: subject.color + "20" }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: subject.color }}
                >
                  {subject.subjectName}
                </Text>
              </View>
            </View>

            {/* Título */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Resumo da Aula 5"
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                className="px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  color: isDarkMode ? "#F9FAFB" : "#111827",
                }}
              />
            </View>

            {/* Conteúdo */}
            <View className="mb-4">
              <View className="flex flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Conteúdo *
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Suporta Markdown
                </Text>
              </View>

              {/* Barra de ferramentas Markdown */}
              <View
                className="flex flex-row flex-wrap gap-2 p-2 rounded-t-lg border-x border-t mb-[-1px]"
                style={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                }}
              >
                <TouchableOpacity
                  onPress={() => insertMarkdown("**", "**")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="font-bold text-sm"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    B
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("*", "*")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="italic text-sm"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    I
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("~~", "~~")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="text-sm line-through"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    S
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("`", "`")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color: isDarkMode ? "#F9FAFB" : "#111827",
                      fontFamily: "monospace",
                    }}
                  >
                    {"</>"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("# ", "")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    H1
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("- ", "")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    • Lista
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertMarkdown("> ", "")}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    ""
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Digite o conteúdo da sua anotação aqui..."
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                className="px-4 py-3 rounded-b-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  color: isDarkMode ? "#F9FAFB" : "#111827",
                  minHeight: 200,
                }}
              />
            </View>

            {/* Fixar anotação */}
            <View className="mb-6">
              <TouchableOpacity
                onPress={() => setPinned(!pinned)}
                className="flex flex-row items-center justify-between p-4 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                }}
              >
                <View className="flex flex-row items-center">
                  <MaterialCommunityIcons
                    name={pinned ? "pin" : "pin-outline"}
                    size={24}
                    color={pinned ? "#F59E0B" : isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text
                    className="ml-3 font-semibold"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  >
                    Fixar anotação
                  </Text>
                </View>
                <View
                  className="w-12 h-6 rounded-full items-center"
                  style={{
                    backgroundColor: pinned
                      ? "#F59E0B"
                      : isDarkMode
                      ? "#4B5563"
                      : "#D1D5DB",
                    flexDirection: "row",
                    justifyContent: pinned ? "flex-end" : "flex-start",
                    paddingHorizontal: 2,
                  }}
                >
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Botões */}
            <View className="mb-6">
              {/* Botão de excluir (somente no modo de edição) */}
              {isEditMode && onDelete && (
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={submitting}
                  className="h-12 w-full rounded-lg items-center justify-center mb-3 bg-red-500"
                  style={{ opacity: submitting ? 0.5 : 1 }}
                >
                  <View className="flex flex-row items-center">
                    <FontAwesome name="trash" size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-2">
                      Excluir Anotação
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Botões de ação */}
              <View className="flex flex-row gap-3">
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={onClose}
                    disabled={submitting}
                    className="h-12 w-full rounded-lg items-center justify-center bg-gray-500"
                    style={{ opacity: submitting ? 0.5 : 1 }}
                  >
                    <Text className="text-white font-semibold">Cancelar</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    className="h-12 w-full rounded-lg items-center justify-center"
                    style={{
                      backgroundColor: subject.color,
                      opacity: submitting ? 0.5 : 1,
                    }}
                  >
                    <Text className="text-white font-semibold">
                      {submitting
                        ? "Salvando..."
                        : isEditMode
                        ? "Salvar Alterações"
                        : "Criar Anotação"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export { NoteFormModal };
