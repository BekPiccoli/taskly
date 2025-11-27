import Ionicons from "@expo/vector-icons/Ionicons";
import { type Attendance, type AttendanceStatus, type Subject } from "@functions/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface AttendanceFormModalProps {
  visible: boolean;
  subject: Subject;
  attendance?: Attendance | null;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    status: AttendanceStatus;
    subjectName?: string;
    notes?: string;
  }) => Promise<void>;
  onDelete?: (date: string) => Promise<void>;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  visible,
  subject,
  attendance,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const [loading, setLoading] = useState(false);

  // Form state
  const [dateString, setDateString] = useState(""); // Formato DD/MM/YYYY
  const [dateObject, setDateObject] = useState(new Date()); // Para o DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [notes, setNotes] = useState("");

  const isEditMode = !!attendance;

  // Resetar form quando modal abre/fecha
  useEffect(() => {
    if (visible) {
      if (attendance) {
        // Modo edição: preencher com dados existentes
        const dateStr = formatDateToBR(attendance.date);
        setDateString(dateStr);
        setDateObject(parseISOToDate(attendance.date));
        setStatus(attendance.status);
        setNotes(attendance.notes || "");
      } else {
        // Modo criação: valores padrão (hoje)
        const today = new Date();
        setDateString(formatDateToBR(formatDateToYYYYMMDD(today)));
        setDateObject(today);
        setStatus("present");
        setNotes("");
      }
    }
  }, [visible, attendance]);

  const parseISOToDate = (isoString: string): Date => {
    const [year, month, day] = isoString.split("-");
    return new Date(parseInt(year!), parseInt(month!) - 1, parseInt(day!));
  };

  const formatDateToYYYYMMDD = (dateObj: Date): string => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateToBR = (dateYYYYMMDD: string): string => {
    try {
      const [year, month, day] = dateYYYYMMDD.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateYYYYMMDD;
    }
  };

  const formatDateToISO = (dateBR: string): string => {
    try {
      // DD/MM/YYYY -> YYYY-MM-DD
      const parts = dateBR.split("/");
      if (parts.length !== 3) return dateBR;
      
      const [day, month, year] = parts;
      if (!day || !month || !year) return dateBR;
      
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch {
      return dateBR;
    }
  };

  const validateDate = (dateBR: string): boolean => {
    // Validar formato DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateBR.match(regex);
    
    if (!match || match.length < 4) return false;
    
    const day = parseInt(match[1]!);
    const month = parseInt(match[2]!);
    const year = parseInt(match[3]!);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 2000 || year > 2100) return false;
    
    return true;
  };

  // Função para aplicar máscara DD/MM/YYYY automaticamente
  const handleDateInputChange = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");
    
    let formatted = "";
    
    // Adiciona as barras automaticamente
    for (let i = 0; i < numbers.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        formatted += "/";
      }
      formatted += numbers[i];
    }
    
    setDateString(formatted);
    
    // Se a data estiver completa, atualizar o dateObject também
    if (formatted.length === 10 && validateDate(formatted)) {
      try {
        const [day, month, year] = formatted.split("/");
        const newDate = new Date(parseInt(year!), parseInt(month!) - 1, parseInt(day!));
        setDateObject(newDate);
      } catch (error) {
        // Ignora erros de parsing
      }
    }
  };

  // Handler do DatePicker
  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDateObject(selectedDate);
      setDateString(formatDateToBR(formatDateToYYYYMMDD(selectedDate)));
    }
    
    if (event.type === "dismissed" && Platform.OS === "ios") {
      setShowDatePicker(false);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Validações
    if (!validateDate(dateString)) {
      Alert.alert("Erro", "Por favor, insira uma data válida no formato DD/MM/YYYY");
      return;
    }

    if (!status) {
      Alert.alert("Erro", "Por favor, selecione um status");
      return;
    }

    setLoading(true);
    try {
      const formattedDate = formatDateToISO(dateString);
      await onSubmit({
        date: formattedDate,
        status,
        subjectName: subject.subjectName,
        notes: notes.trim(),
      });
    } catch (error: any) {
      // Erro já tratado no componente pai
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!attendance || !onDelete) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este registro de presença?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await onDelete(attendance.date);
            } catch (error: any) {
              // Erro já tratado no componente pai
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusLabel = (statusValue: AttendanceStatus): string => {
    const labels = {
      present: "Presente",
      absent: "Falta",
      late: "Atrasado",
      justified: "Justificada",
    };
    return labels[statusValue];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="rounded-t-3xl pt-6 pb-8 px-6"
          style={{
            backgroundColor: isDarkMode ? "#111827" : "#FFFFFF",
            maxHeight: "90%",
          }}
        >
          {/* Header */}
          <View className="flex flex-row items-center justify-between mb-6">
            <Text
              className="text-2xl font-bold"
              style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
            >
              {isEditMode ? "Editar Presença" : "Registrar Presença"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6" }}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Matéria (apenas exibição) */}
            <View className="mb-4">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: isDarkMode ? "#D1D5DB" : "#374151" }}
              >
                Matéria
              </Text>
              <View
                className="px-4 py-3 rounded-lg flex flex-row items-center"
                style={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#F9FAFB",
                  borderWidth: 1,
                  borderColor: subject.color,
                }}
              >
                <View
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: subject.color }}
                />
                <Text
                  className="text-base font-medium"
                  style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                >
                  {subject.subjectName}
                </Text>
              </View>
            </View>

            {/* Data */}
            <View className="mb-4">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: isDarkMode ? "#D1D5DB" : "#374151" }}
              >
                Data da Aula *
              </Text>
              <View className="flex flex-row items-center space-x-2">
                <View 
                  className="flex-1 flex flex-row items-center px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                    borderColor: isDarkMode ? "#374151" : "#D1D5DB",
                    opacity: isEditMode ? 0.6 : 1,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <TextInput
                    value={dateString}
                    onChangeText={handleDateInputChange}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                    editable={!isEditMode}
                    keyboardType="numeric"
                    maxLength={10}
                    className="flex-1 ml-3 text-base"
                    style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                  />
                </View>
                
                {!isEditMode && (
                  <TouchableOpacity
                    onPress={openDatePicker}
                    className="px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: subject.color,
                    }}
                  >
                    <Ionicons name="calendar" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              <Text
                className="text-xs mt-1"
                style={{ color: isDarkMode ? "#6B7280" : "#9CA3AF" }}
              >
                {isEditMode 
                  ? "A data não pode ser alterada no modo de edição"
                  : "Digite ou clique no calendário para selecionar"}
              </Text>
            </View>

            {/* Status */}
            <View className="mb-4">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: isDarkMode ? "#D1D5DB" : "#374151" }}
              >
                Status *
              </Text>
              <View
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  borderColor: isDarkMode ? "#374151" : "#D1D5DB",
                }}
              >
                <Picker
                  selectedValue={status}
                  onValueChange={(value) => setStatus(value as AttendanceStatus)}
                  style={{
                    color: isDarkMode ? "#F9FAFB" : "#111827",
                  }}
                >
                  <Picker.Item label="🟢 Presente" value="present" />
                  <Picker.Item label="🔴 Falta" value="absent" />
                  <Picker.Item label="🟡 Atrasado" value="late" />
                  <Picker.Item label="🔵 Justificada" value="justified" />
                </Picker>
              </View>
            </View>

            {/* Observações */}
            <View className="mb-4">
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: isDarkMode ? "#D1D5DB" : "#374151" }}
              >
                Observações (opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Ex: Chegou 15min atrasado, Atestado médico..."
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  borderColor: isDarkMode ? "#374151" : "#D1D5DB",
                  color: isDarkMode ? "#F9FAFB" : "#111827",
                  minHeight: 100,
                }}
              />
            </View>
          </ScrollView>

          {/* Botões de ação */}
          <View className="space-y-3">
            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="py-4 rounded-lg items-center justify-center"
              style={{
                backgroundColor: loading ? "#9CA3AF" : subject.color,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  {isEditMode ? "Atualizar" : "Salvar"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Botão Excluir (apenas modo edição) */}
            {isEditMode && onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading}
                className="py-4 rounded-lg items-center justify-center border-2"
                style={{
                  borderColor: "#EF4444",
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                }}
              >
                <Text className="text-base font-bold" style={{ color: "#EF4444" }}>
                  Excluir Registro
                </Text>
              </TouchableOpacity>
            )}

            {/* Botão Cancelar */}
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              className="py-4 rounded-lg items-center justify-center"
              style={{
                backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
              }}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: isDarkMode ? "#D1D5DB" : "#6B7280" }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DateTimePicker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={dateObject}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDatePickerChange}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(2000, 0, 1)}
            locale="pt-BR"
          />
        )}
      </View>
    </Modal>
  );
};

export { AttendanceFormModal };
