import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  deleteAttendance,
  getAttendanceBySubject,
  getAttendanceStats,
  upsertAttendance,
} from "@functions/index";
import { type Attendance, type AttendanceStats, type Subject } from "@functions/types";
import { getId } from "@src/asyncStorageData/index";
import { AttendanceCard } from "@src/components/attendanceCard";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { AttendanceFormModal } from "./AttendanceFormModal";

interface SubjectAbsencesTabProps {
  subject: Subject;
}

const SubjectAbsencesTab: React.FC<SubjectAbsencesTabProps> = ({ subject }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const isDarkMode = useColorScheme() === "dark";

  const loadAttendance = useCallback(async () => {
    if (!subject.id) return;

    setLoading(true);
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      // Carregar registros e estatísticas em paralelo
      const [attendanceResponse, statsResponse] = await Promise.all([
        getAttendanceBySubject(userId, subject.id),
        getAttendanceStats(userId, subject.id),
      ]);

      setAttendanceRecords(attendanceResponse.attendance || []);
      setStats(statsResponse.stats || null);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar os registros de presença"
      );
    } finally {
      setLoading(false);
    }
  }, [subject.id]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const handleCreateOrUpdateAttendance = async (attendanceData: {
    date: string;
    status: string;
    subjectName?: string;
    notes?: string;
  }) => {
    try {
      const userId = await getId();
      if (!userId || !subject.id) {
        Alert.alert("Erro", "Informações do usuário ou matéria não encontradas");
        return;
      }

      await upsertAttendance(userId, subject.id, attendanceData);
      
      Alert.alert(
        "Sucesso",
        selectedAttendance
          ? "Registro de presença atualizado com sucesso!"
          : "Registro de presença criado com sucesso!"
      );
      
      setModalVisible(false);
      setSelectedAttendance(null);
      await loadAttendance();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível salvar o registro de presença"
      );
      throw error;
    }
  };

  const handleDeleteAttendance = async (date: string) => {
    try {
      const userId = await getId();
      if (!userId || !subject.id) {
        Alert.alert("Erro", "Informações do usuário ou matéria não encontradas");
        return;
      }

      await deleteAttendance(userId, subject.id, date);
      Alert.alert("Sucesso", "Registro de presença excluído com sucesso!");
      
      setModalVisible(false);
      setSelectedAttendance(null);
      await loadAttendance();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível excluir o registro de presença"
      );
      throw error;
    }
  };

  const handleAttendancePress = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setModalVisible(true);
  };

  const handleNewAttendance = () => {
    setSelectedAttendance(null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAttendance(null);
  };

  if (loading && attendanceRecords.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color={subject.color} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      {/* Estatísticas */}
      {stats && stats.total > 0 && (
        <View className="px-4 pt-4 pb-2">
          <View
            className="p-4 rounded-xl"
            style={{
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <View className="flex flex-row items-center justify-between mb-3">
              <Text
                className="text-base font-bold"
                style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
              >
                Resumo de Frequência
              </Text>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    parseFloat(stats.attendanceRate) >= 75
                      ? "#D1FAE5"
                      : parseFloat(stats.attendanceRate) >= 50
                      ? "#FEF3C7"
                      : "#FEE2E2",
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color:
                      parseFloat(stats.attendanceRate) >= 75
                        ? "#10B981"
                        : parseFloat(stats.attendanceRate) >= 50
                        ? "#F59E0B"
                        : "#EF4444",
                  }}
                >
                  {stats.attendanceRate}%
                </Text>
              </View>
            </View>

            <View className="flex flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%]">
                <Text
                  className="text-xs mb-1"
                  style={{ color: isDarkMode ? "#9CA3AF" : "#6B7280" }}
                >
                  Total de Aulas
                </Text>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
                >
                  {stats.total}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%]">
                <Text
                  className="text-xs mb-1"
                  style={{ color: "#10B981" }}
                >
                  Presenças
                </Text>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#10B981" }}
                >
                  {stats.present}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%]">
                <Text
                  className="text-xs mb-1"
                  style={{ color: "#EF4444" }}
                >
                  Faltas
                </Text>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#EF4444" }}
                >
                  {stats.absent}
                </Text>
              </View>

              <View className="flex-1 min-w-[45%]">
                <Text
                  className="text-xs mb-1"
                  style={{ color: "#F59E0B" }}
                >
                  Atrasos
                </Text>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#F59E0B" }}
                >
                  {stats.late}
                </Text>
              </View>

              {stats.justified > 0 && (
                <View className="flex-1 min-w-[45%]">
                  <Text
                    className="text-xs mb-1"
                    style={{ color: "#3B82F6" }}
                  >
                    Justificadas
                  </Text>
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: "#3B82F6" }}
                  >
                    {stats.justified}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {attendanceRecords.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" }}
            >
              <MaterialCommunityIcons
                name="calendar-remove"
                size={40}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </View>
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Nenhum registro ainda
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-400 px-8">
              Registre suas presenças e faltas para acompanhar sua frequência
              nesta disciplina
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              {attendanceRecords.length}{" "}
              {attendanceRecords.length === 1 ? "Registro" : "Registros"}
            </Text>
            {attendanceRecords.map((attendance) => (
              <AttendanceCard
                key={attendance.id || attendance.date}
                attendance={attendance}
                onPress={() => handleAttendancePress(attendance)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleNewAttendance}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: subject.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal de criação/edição */}
      <AttendanceFormModal
        visible={modalVisible}
        subject={subject}
        attendance={selectedAttendance}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateAttendance}
        onDelete={handleDeleteAttendance}
      />
    </View>
  );
};

export { SubjectAbsencesTab };
