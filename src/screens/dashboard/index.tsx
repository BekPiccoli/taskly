import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getDashboardOverview } from "@functions/index";
import { type DashboardOverview } from "@functions/types";
import { useNavigation } from "@react-navigation/native";
import { getId } from "@src/asyncStorageData/index";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { DashboardStatsCard } from "./components/DashboardStatsCard";
import { SubjectSummaryCard } from "./components/SubjectSummaryCard";
import { UpcomingTaskCard } from "./components/UpcomingTaskCard";

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const id = await getId();
      if (!id) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      const response = await getDashboardOverview(id, 5);
      setDashboard(response.data);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar o dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: isDarkMode ? "#111827" : "#F9FAFB" }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">
          Carregando dashboard...
        </Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View
        className="flex-1 justify-center items-center p-8"
        style={{ backgroundColor: isDarkMode ? "#111827" : "#F9FAFB" }}
      >
        <MaterialIcons name="dashboard" size={80} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-600 dark:text-gray-400 mt-4">
          Nenhum dado disponível
        </Text>
        <TouchableOpacity
          onPress={loadDashboard}
          className="mt-6 px-6 py-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-semibold">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { upcomingTasks, tasksSummary, subjectsSummary, attendanceSummary } =
    dashboard;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#111827" : "#F9FAFB" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Dashboard
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400">
          Visão geral do seu progresso acadêmico
        </Text>
      </View>

      {/* Stats Cards Grid */}
      <View className="px-6 mb-6">
        <View className="flex flex-row gap-3 mb-3">
          <DashboardStatsCard
            icon={
              <MaterialIcons name="assignment" size={24} color="#3B82F6" />
            }
            label="Total de Tarefas"
            value={tasksSummary.total.toString()}
            color="#3B82F6"
            bgColor={isDarkMode ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF"}
          />
          <DashboardStatsCard
            icon={
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#F59E0B"
              />
            }
            label="Pendentes"
            value={tasksSummary.pending.toString()}
            color="#F59E0B"
            bgColor={isDarkMode ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7"}
          />
        </View>

        <View className="flex flex-row gap-3 mb-3">
          <DashboardStatsCard
            icon={
              <FontAwesome5 name="check-circle" size={22} color="#10B981" />
            }
            label="Entregues"
            value={tasksSummary.delivered.toString()}
            color="#10B981"
            bgColor={isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5"}
          />
          <DashboardStatsCard
            icon={
              <MaterialCommunityIcons
                name="check-all"
                size={24}
                color="#8B5CF6"
              />
            }
            label="Concluídas"
            value={tasksSummary.completed.toString()}
            color="#8B5CF6"
            bgColor={isDarkMode ? "rgba(139, 92, 246, 0.15)" : "#EDE9FE"}
          />
        </View>

        {tasksSummary.overdue > 0 && (
          <View
            className="p-4 rounded-xl flex flex-row items-center"
            style={{ backgroundColor: isDarkMode ? "#7F1D1D" : "#FEE2E2" }}
          >
            <MaterialIcons name="warning" size={24} color="#DC2626" />
            <Text className="ml-3 font-semibold" style={{ color: "#DC2626" }}>
              {tasksSummary.overdue} tarefa(s) atrasada(s)
            </Text>
          </View>
        )}
      </View>

      {/* Attendance Summary */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Resumo de Frequência
        </Text>
        <View
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          }}
        >
          <View className="flex flex-row items-center justify-between mb-4">
            <View className="flex flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor:
                    attendanceSummary.attendanceRate >= 75
                      ? isDarkMode
                        ? "rgba(16, 185, 129, 0.2)"
                        : "#D1FAE5"
                      : isDarkMode
                      ? "rgba(239, 68, 68, 0.2)"
                      : "#FEE2E2",
                }}
              >
                <MaterialCommunityIcons
                  name="chart-arc"
                  size={24}
                  color={
                    attendanceSummary.attendanceRate >= 75
                      ? "#10B981"
                      : "#EF4444"
                  }
                />
              </View>
              <View>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa de Presença
                </Text>
                <Text
                  className="text-2xl font-bold"
                  style={{
                    color:
                      attendanceSummary.attendanceRate >= 75
                        ? "#10B981"
                        : "#EF4444",
                  }}
                >
                  {attendanceSummary.attendanceRate.toFixed(1)}%
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Total de Aulas
              </Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {attendanceSummary.totalClasses}
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Presenças
              </Text>
              <Text className="text-lg font-bold text-green-600">
                {attendanceSummary.presences}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Faltas
              </Text>
              <Text className="text-lg font-bold text-red-600">
                {attendanceSummary.absences}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Atrasos
              </Text>
              <Text className="text-lg font-bold text-orange-600">
                {attendanceSummary.lates}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Justificadas
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                {attendanceSummary.justified}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming Tasks */}
      <View className="px-6 mb-6">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Próximas Tarefas
          </Text>
          {upcomingTasks.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate("Home" as never)}>
              <Text className="text-blue-600 font-semibold">Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>

        {upcomingTasks.length === 0 ? (
          <View
            className="p-8 rounded-2xl items-center"
            style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}
          >
            <FontAwesome5 name="tasks" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
              Nenhuma tarefa pendente! 🎉
            </Text>
          </View>
        ) : (
          upcomingTasks.map((task) => (
            <UpcomingTaskCard key={task.id} task={task} />
          ))
        )}
      </View>

      {/* Subjects Summary */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Resumo por Disciplina
        </Text>

        {subjectsSummary.length === 0 ? (
          <View
            className="p-8 rounded-2xl items-center"
            style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}
          >
            <MaterialIcons name="school" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
              Nenhuma disciplina cadastrada
            </Text>
          </View>
        ) : (
          subjectsSummary.map((subject) => (
            <SubjectSummaryCard key={subject.subjectId} subject={subject} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export { Dashboard };
