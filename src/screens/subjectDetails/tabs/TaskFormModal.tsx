import FontAwesome from "@expo/vector-icons/FontAwesome";
import { type Subject, type Task, type TaskType } from "@functions/types";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

interface TaskFormModalProps {
  visible: boolean;
  subject: Subject;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  subject,
  task = null,
  onClose,
  onSubmit,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const isEditing = !!task;
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("assignment");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [dateInput, setDateInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Atualizar estados quando a task mudar
  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setType(task.type);
      setNotes(task.notes || "");
      
      // Converter dueOn para Date
      const dateStr = String(task.dueOn);
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      const taskDate = new Date(year, month, day);
      setDueDate(taskDate);
      
      // Formatar para exibição
      const dayStr = String(day).padStart(2, "0");
      const monthStr = String(month + 1).padStart(2, "0");
      setDateInput(`${dayStr}/${monthStr}/${year}`);
    } else {
      // Limpar quando não houver task (modo criação)
      setTitle("");
      setType("assignment");
      setNotes("");
      setDueDate(new Date());
      setDateInput("");
    }
  }, [task, visible]);

  const taskTypes: { value: TaskType; label: string }[] = [
    { value: "assignment", label: "Trabalho" },
    { value: "exam", label: "Prova" },
    { value: "quiz", label: "Quiz" },
    { value: "presentation", label: "Apresentação" },
    { value: "project", label: "Projeto" },
    { value: "other", label: "Outro" },
  ];

  const handleSubmit = async () => {
    // Validações
    if (!title.trim()) {
      Alert.alert("Erro", "Por favor, insira um título para a tarefa");
      return;
    }

    // Converter data para formato YYYYMMDD
    const year = dueDate.getFullYear();
    const month = String(dueDate.getMonth() + 1).padStart(2, "0");
    const day = String(dueDate.getDate()).padStart(2, "0");
    const dueOn = parseInt(`${year}${month}${day}`);

    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      type,
      status: "pending",
      subjectId: subject.id!,
      subjectName: subject.subjectName,
      dueOn,
      notes: notes.trim(),
    };

    setSubmitting(true);
    try {
      await onSubmit(taskData);
      // Limpar formulário
      setTitle("");
      setType("assignment");
      setNotes("");
      setDueDate(new Date());
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
              {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6 py-4" keyboardShouldPersistTaps="handled">
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
                placeholder="Ex: Trabalho sobre React Native"
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                className="px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  color: isDarkMode ? "#F9FAFB" : "#111827",
                }}
              />
            </View>

            {/* Tipo */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tipo *
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                {taskTypes.map((taskType) => (
                  <TouchableOpacity
                    key={taskType.value}
                    onPress={() => setType(taskType.value)}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor:
                        type === taskType.value
                          ? subject.color
                          : isDarkMode
                          ? "#374151"
                          : "#F3F4F6",
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          type === taskType.value
                            ? "#FFFFFF"
                            : isDarkMode
                            ? "#D1D5DB"
                            : "#6B7280",
                      }}
                    >
                      {taskType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Data de entrega */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Data de Entrega *
              </Text>
              <View className="flex flex-row gap-2">
                <TextInput
                  value={dateInput}
                  onChangeText={(text) => {
                    // Permitir apenas números e /
                    const cleaned = text.replace(/[^\d/]/g, "");
                    setDateInput(cleaned);
                    
                    // Tentar parsear quando tiver formato completo DD/MM/YYYY
                    if (cleaned.length === 10) {
                      const parts = cleaned.split("/");
                      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                        const day = parseInt(parts[0]);
                        const month = parseInt(parts[1]) - 1;
                        const year = parseInt(parts[2]);
                        
                        if (day > 0 && day <= 31 && month >= 0 && month < 12 && year >= 2000) {
                          const newDate = new Date(year, month, day);
                          setDueDate(newDate);
                        }
                      }
                    }
                  }}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                  maxLength={10}
                  keyboardType="numeric"
                  className="flex-1 px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                    borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                    color: isDarkMode ? "#F9FAFB" : "#111827",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    const today = new Date();
                    setDueDate(today);
                    const day = String(today.getDate()).padStart(2, "0");
                    const month = String(today.getMonth() + 1).padStart(2, "0");
                    const year = today.getFullYear();
                    setDateInput(`${day}/${month}/${year}`);
                  }}
                  className="px-4 py-3 rounded-lg border items-center justify-center"
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                    borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  }}
                >
                  <FontAwesome
                    name="calendar"
                    size={20}
                    color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Data selecionada: {formatDate(dueDate)}
              </Text>
            </View>

            {/* Anotações */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Anotações (Opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Adicione detalhes sobre a tarefa..."
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  color: isDarkMode ? "#F9FAFB" : "#111827",
                  minHeight: 100,
                }}
              />
            </View>

            {/* Botões */}
            <View className="flex flex-row gap-3 mb-6">
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
                    opacity: submitting ? 0.5 : 1 
                  }}
                >
                  <Text className="text-white font-semibold">
                    {submitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Tarefa"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export { TaskFormModal };
