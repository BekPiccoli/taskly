import { IconPicker } from "@components/inputs/iconPicker";
import { colors } from "@components/inputs/subjects";
import Fontisto from "@expo/vector-icons/Fontisto";
import { type Subject } from "@functions/types";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface subjectModalProps {
  currentData?: Subject;
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
  onSaveSubject: (data: Subject) => void;
}

type SubjectFormValues = {
  subjectName: string;
  teacherName: string;
  totalClasses: string;
  classTime: string;
  classEndTime: string;
  semester: string;
  year: string;
  collegePeriod: string;
};

const SubjectModal: React.FC<subjectModalProps> = ({
  currentData,
  modalIsOpen,
  setModalIsOpen,
  onSaveSubject,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  const [colorSelected, setcolorSelected] = useState<string>(
    currentData?.color || ""
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(
    currentData?.icon || ""
  );
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>(
    currentData?.daysOfWeek || []
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    defaultValues: {
      subjectName: currentData?.subjectName ?? "",
      teacherName: currentData?.teacherName ?? "",
      totalClasses: currentData?.totalClasses
        ? String(currentData.totalClasses)
        : "",
      classTime: currentData?.classTime ?? "",
      classEndTime: currentData?.classEndTime ?? "",
      semester: currentData?.semester ?? "",
      year: currentData?.year ? String(currentData.year) : "",
      collegePeriod: currentData?.collegePeriod ?? "",
    },
  });

  useEffect(() => {
    reset({
      subjectName: currentData?.subjectName ?? "",
      teacherName: currentData?.teacherName ?? "",
      totalClasses: currentData?.totalClasses
        ? String(currentData.totalClasses)
        : "",
      classTime: currentData?.classTime ?? "",
      classEndTime: currentData?.classEndTime ?? "",
      semester: currentData?.semester ?? "",
      year: currentData?.year ? String(currentData.year) : "",
      collegePeriod: currentData?.collegePeriod ?? "",
    });

    if (currentData) {
      setcolorSelected(currentData.color || "");
      setSelectedIcon(currentData.icon || "");
      setSelectedDaysOfWeek(currentData.daysOfWeek || []);
    } else {
      setcolorSelected("");
      setSelectedIcon("");
      setSelectedDaysOfWeek([]);
    }
  }, [currentData, reset]);

  const daysOptions = [
    { label: "Segunda", value: "SEG" },
    { label: "Terça", value: "TER" },
    { label: "Quarta", value: "QUA" },
    { label: "Quinta", value: "QUI" },
    { label: "Sexta", value: "SEX" },
    { label: "Sábado", value: "SAB" },
    { label: "Domingo", value: "DOM" },
  ];

  const toggleDaySelection = (day: string) => {
    setSelectedDaysOfWeek((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort((a, b) => {
          const order = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
          return order.indexOf(a) - order.indexOf(b);
        });
      }
    });
  };

  const handleSaveSubject = async (data: SubjectFormValues) => {
    if (!colorSelected) {
      Alert.alert("Erro", "Por favor, selecione uma cor para a disciplina!");
      return;
    }
    if (!selectedIcon) {
      Alert.alert("Erro", "Por favor, selecione um ícone para a disciplina!");
      return;
    }
    if (selectedDaysOfWeek.length === 0) {
      Alert.alert(
        "Erro",
        "Por favor, selecione pelo menos um dia da semana!"
      );
      return;
    }

    setSubmitting(true);
    try {
      const subjectData: Subject = {
        subjectName: data.subjectName.trim(),
        teacherName: data.teacherName.trim(),
        totalClasses: Number(data.totalClasses),
        classTime: data.classTime.trim(),
        classEndTime: data.classEndTime.trim(),
        semester: data.semester.trim(),
        year: Number(data.year),
        collegePeriod: data.collegePeriod.trim(),
        daysOfWeek: selectedDaysOfWeek,
        color: colorSelected,
        icon: selectedIcon,
        ...(currentData?.id ? { id: currentData.id } : {}),
      };

      await onSaveSubject(subjectData);
      setModalIsOpen(false);
    } catch (error) {
      // tratado no pai
    } finally {
      setSubmitting(false);
    }
  };

  const inputBaseStyle = {
    backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
    borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
    color: isDarkMode ? "#F9FAFB" : "#111827",
  } as const;

  const placeholderColor = isDarkMode ? "#6B7280" : "#9CA3AF";

  return (
    <Modal
      visible={Boolean(modalIsOpen)}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="rounded-t-3xl"
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            maxHeight: "95%",
          }}
        >
          {/* Header */}
          <View className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {currentData ? "✏️ Editar Matéria" : "➕ Nova Matéria"}
            </Text>
            <TouchableOpacity onPress={() => setModalIsOpen(false)}>
              <Fontisto
                name="close-a"
                size={20}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-6 py-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Se tiver cor + ícone, mostra preview */}
            {(colorSelected || selectedIcon || currentData) && (
              <View
                className="flex-row items-center mb-6 px-4 py-3 rounded-2xl"
                style={{
                  backgroundColor: (colorSelected || "#3B82F6") + "20",
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colorSelected || "#3B82F6" }}
                >
                  <Text className="text-white text-lg">
                    {selectedIcon || "📚"}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-400 dark:text-gray-400">
                    Pré-visualização da matéria
                  </Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colorSelected || "#3B82F6" }}
                  >
                    {currentData?.subjectName || "Nova disciplina"}
                  </Text>
                </View>
              </View>
            )}

            {/* Seção: Informações básicas */}
            <Text className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
              Informações básicas
            </Text>

            {/* Nome da disciplina */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-200 mb-1">
                Nome da Disciplina *
              </Text>
              <Controller
                name="subjectName"
                control={control}
                rules={{ required: "Nome da disciplina é obrigatório" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Ex: Cálculo I, História Geral, etc."
                    placeholderTextColor={placeholderColor}
                    className="px-4 py-3 rounded-lg border"
                    style={inputBaseStyle}
                  />
                )}
              />
              {errors.subjectName && (
                <Text className="text-xs text-red-400 mt-1">
                  {errors.subjectName.message}
                </Text>
              )}
            </View>

            {/* Professor */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-200 mb-1">
                Professor Responsável *
              </Text>
              <Controller
                name="teacherName"
                control={control}
                rules={{ required: "Nome do professor é obrigatório" }}
                render={({ field: { onChange, onBlur, value} }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Digite o nome do professor"
                    placeholderTextColor={placeholderColor}
                    className="px-4 py-3 rounded-lg border"
                    style={inputBaseStyle}
                  />
                )}
              />
              {errors.teacherName && (
                <Text className="text-xs text-red-400 mt-1">
                  {errors.teacherName.message}
                </Text>
              )}
            </View>

            {/* Seção: Detalhes da disciplina */}
            <Text className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
              Detalhes da disciplina
            </Text>

            <View className="flex flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Semestre *
                </Text>
                <Controller
                  name="semester"
                  control={control}
                  rules={{ required: "Semestre é obrigatório" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 2025/1"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Ano *
                </Text>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: "Ano é obrigatório" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 2025"
                      keyboardType="numeric"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>
            </View>

            <View className="flex flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Período da Faculdade *
                </Text>
                <Controller
                  name="collegePeriod"
                  control={control}
                  rules={{
                    required: "Período da faculdade é obrigatório",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 3º período"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Total de Aulas Previstas *
                </Text>
                <Controller
                  name="totalClasses"
                  control={control}
                  rules={{ required: "Total de aulas é obrigatório" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 80"
                      keyboardType="numeric"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>
            </View>

            {/* Seção: Horários */}
            <Text className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
              Horário das aulas
            </Text>

            <View className="flex flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Horário de Início *
                </Text>
                <Controller
                  name="classTime"
                  control={control}
                  rules={{ required: "Horário de início é obrigatório" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 19:00"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-200 mb-1">
                  Horário de Término
                </Text>
                <Controller
                  name="classEndTime"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Ex: 22:00"
                      placeholderTextColor={placeholderColor}
                      className="px-4 py-3 rounded-lg border"
                      style={inputBaseStyle}
                    />
                  )}
                />
              </View>
            </View>

            {/* Dias da semana */}
            <Text className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
              Dias da semana
            </Text>
            <View className="mb-6">
              <View className="flex flex-row flex-wrap gap-2">
                {daysOptions.map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    onPress={() => toggleDaySelection(day.value)}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: selectedDaysOfWeek.includes(day.value)
                        ? colorSelected || "#3B82F6"
                        : isDarkMode
                        ? "#374151"
                        : "#F3F4F6",
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: selectedDaysOfWeek.includes(day.value)
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#D1D5DB"
                          : "#6B7280",
                      }}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedDaysOfWeek.length > 0 && (
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {selectedDaysOfWeek.length} dia(s) selecionado(s)
                </Text>
              )}
            </View>

            {/* Personalização */}
            <Text className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
              Personalização
            </Text>

            {/* Ícone (sem label duplicado) */}
            <View className="mb-4">
              <IconPicker
                selectedIcon={selectedIcon}
                onSelectIcon={setSelectedIcon}
              />
            </View>

            {/* Cor */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-200 mb-2">
                Cor da Disciplina *
              </Text>
              <View className="flex flex-row flex-wrap gap-3">
                {colors.map((color: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setcolorSelected(color)}
                    className={`w-12 h-12 rounded-xl border-2 ${
                      colorSelected === color
                        ? "border-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{
                      backgroundColor: color,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  />
                ))}
              </View>
              {colorSelected && (
                <View className="flex flex-row items-center gap-2 mt-3">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Cor selecionada:
                  </Text>
                  <View
                    className="w-6 h-6 rounded-lg"
                    style={{ backgroundColor: colorSelected }}
                  />
                </View>
              )}
            </View>

            {/* Botões */}
            <View className="flex flex-row gap-3 mb-6">
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => setModalIsOpen(false)}
                  disabled={submitting}
                  className="h-12 w-full rounded-lg items-center justify-center bg-gray-500"
                  style={{ opacity: submitting ? 0.5 : 1 }}
                >
                  <Text className="text-white font-semibold">Cancelar</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <TouchableOpacity
                  onPress={handleSubmit(handleSaveSubject)}
                  disabled={submitting}
                  className="h-12 w-full rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: colorSelected || "#3B82F6",
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  <Text className="text-white font-semibold">
                    {submitting ? "Salvando..." : "Salvar Matéria"}
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

export { SubjectModal };
