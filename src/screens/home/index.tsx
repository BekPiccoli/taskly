import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  createSubjects,
  deleteSubjects,
  getSubjects,
  logout,
  updateSubjects,
} from "@functions/index";
import { type Subject } from "@functions/types";
import { useNavigation } from "@react-navigation/native";
import { SubjectModal } from "@screens/newSubject";
import { getId } from "@src/asyncStorageData/index";
import { Button } from "@src/components/buttons/button";
import { Header } from "@src/components/header";
import { SubjectCard } from "@src/components/subjectCard";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Home: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState<Boolean>(false);
  const [subjects, setSubjects] = useState<Array<Subject>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [editModal, setEditModal] = useState<any>({});
  const [subjectConfigModalIsOpen, setSubjectConfigModalIsOpen] =
    useState<Boolean>(false);

  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    loadSubjects();
  }, []);

  const openConfigForSubject = (subjectId?: string) => {
    if (subjectId) setSelectedSubjectId(subjectId);
    setSubjectConfigModalIsOpen((prev) => !prev);
  };

  const handleremoveSubject = async (subjectId: string) => {
    try {
      const id = await getId();
      if (!id) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }
      await deleteSubjects(id, subjectId);
      Alert.alert("Sucesso", "Matéria removida com sucesso!");
      loadSubjects();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível remover a matéria");
    } finally {
      setSubjectConfigModalIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().then(() => {
        navigation.navigate("Login" as never);
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  const saveSubjects = async (subjectsToSave: Array<Subject>) => {
    const id = await getId();
    if (!id) {
      Alert.alert("Erro", "Usuário não encontrado");
      return;
    }

    if (subjectsToSave[0] !== undefined && subjectsToSave[0].id) {
      try {
        await updatecurrentSubjects(id, subjectsToSave[0]);
        return;
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível atualizar a matéria");
      }
      return;
    }

    const subjectsToSend = subjectsToSave[0];

    if (subjectsToSend === null || subjectsToSend === undefined) return;

    try {
      await createSubjects(id, subjectsToSend);
      Alert.alert("Sucesso", "Matéria criada com sucesso!");
      await loadSubjects();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível criar a matéria");
    }
  };

  const updatecurrentSubjects = async (id: string, subjects: Subject) => {
    try {
      await updateSubjects(id, subjects);
      Alert.alert("Sucesso", "Matéria atualizada com sucesso!");
    } catch (error: any) {
      throw error;
    } finally {
      await loadSubjects();
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const id = await getId();
      if (!id) {
        return;
      }
      const res = await getSubjects(id);
      const subjectsList = res?.subjects || res?.newSubject || [];


      if (!subjectsList || subjectsList.length === 0) {
        setSubjects([]);
        return;
      }

      setSubjects(subjectsList);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar as matérias");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectsFromModal = async (newSubject: Subject) => {
    await saveSubjects([newSubject]);
  };

  const handleEditSubject = () => {
    if (!selectedSubjectId) return;
    const currentData = subjects.find(
      (subject) => subject.id === selectedSubjectId
    );
    setEditModal(currentData);
    setSubjectConfigModalIsOpen(false);
    setModalIsOpen(true);
  };

  const showAlert = (
    confirm: string,
    cancel: string,
    functionToUse: () => void
  ) => {
    Alert.alert("Confirmação", "Tem certeza que deseja remover esta matéria?", [
      {
        text: cancel,
        style: "cancel",
      },
      { text: confirm, onPress: () => functionToUse() },
    ]);
  };

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : subjects.length === 0 ? (
        <>
          <View className="flex-1 ">
            <Button
              onPress={handleLogout}
              style="absolute top-20 left-4 h-14 w-14 bg-blue-100 flex items-center justify-center rounded-lg  z-10"
              icon={
                <MaterialCommunityIcons name="logout" size={24} color="blue" />
              }
            />

            <View className="flex-1 justify-center items-center w-screen dark:bg-gray-700">
              <Ionicons
                name="book-outline"
                size={100}
                color="#4F5DFF"
                className="p-4 bg-blue-100 rounded-lg mb-4"
              />

              <View className="mb-4 items-center px-8">
                <Text className="text-xl font-extrabold dark:text-white">
                  Nenhuma Matéria adicionada ainda!
                </Text>
                <Text className="text-center mt-2 dark:text-white">
                  Comece adicionando sua primeira matéria para acompanhar seu
                  progresso acadêmico e frequência.
                </Text>
              </View>

              <Button
                onPress={() => setModalIsOpen(true)}
                style="h-14 w-auto rounded-lg items-center justify-center flex-row mt-10 pr-4 pl-4"
                title="Adicionar Matéria"
              />
            </View>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center bg-blue-50 dark:bg-visible dark:bg-gray-900">
          <View>
            <Header
              subjectsFromModal={handleSubjectsFromModal}
              handleLogout={handleLogout}
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
              display: "flex",
              justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 w-full px-4 mt-4 gap-6">
              <Text className="text-2xl font-extrabold mb-2 dark:text-white">
                Suas Disciplinas
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 mb-6">
                Acompanhe seu progresso acadêmico
              </Text>

              <View className="flex flex-row gap-4 mb-6">
                <View
                  className="flex-1 h-24 rounded-xl p-4 shadow-md"
                  style={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#EFF6FF",
                  }}
                >
                  <View className="flex flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: "#3B82F6" }}
                    >
                      <MaterialIcons name="menu-book" size={20} color="#fff" />
                    </View>
                    <View>
                      <Text className="text-xs text-gray-600 dark:text-gray-400">
                        Disciplinas
                      </Text>
                      <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {subjects.length}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  className="flex-1 h-24 rounded-xl p-4 shadow-md"
                  style={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#F0FDF4",
                  }}
                >
                  <View className="flex flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: "#10B981" }}
                    >
                      <FontAwesome5
                        name="chalkboard-teacher"
                        size={18}
                        color="#fff"
                      />
                    </View>
                    <View>
                      <Text className="text-xs text-gray-600 dark:text-gray-400">
                        Professores
                      </Text>
                      <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {subjects.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {subjects.length > 0 &&
                subjects.map((subject: Subject, index: number) => (
                  <SubjectCard
                    key={index}
                    subject={subject}
                    onPressConfig={() => openConfigForSubject(subject.id)}
                  />
                ))}
            </View>
          </ScrollView>
        </View>
      )}
      {subjectConfigModalIsOpen && (
        <GestureHandlerRootView>
          <View className="flex-1 justify-center items-center p-4 border-t-slate-300 dark:border-t-slate-700 dark:bg-gray-700">
            <Text className="text-lg font-semibold mb-4 dark:text-white">
              Configurações da Matéria
            </Text>

            <View className="w-full gap-10">
              <Button
                onPress={handleEditSubject}
                title="Editar Matéria"
                style="h-12 w-full rounded-lg items-center justify-center flex-row bg-blue-500"
                icon={<FontAwesome name="edit" size={16} color="#fff" />}
              />

              <Button
                onPress={() => {
                  showAlert("OK", "Cancelar", () =>
                    handleremoveSubject(selectedSubjectId)
                  );
                }}
                title="Deletar Matéria"
                style="h-12 w-full rounded-lg items-center justify-center flex-row bg-red-500"
                icon={<FontAwesome name="trash" size={16} color="#fff" />}
              />

              <Button
                onPress={() => openConfigForSubject()}
                title="Fechar"
                style="h-12 w-full rounded-lg items-center justify-center flex-row bg-gray-500"
                icon={<FontAwesome name="close" size={16} color="#fff" />}
              />
            </View>
          </View>
        </GestureHandlerRootView>
      )}
      {modalIsOpen && (
        <SubjectModal
          currentData={editModal}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          onSaveSubject={handleSubjectsFromModal}
        />
      )}
    </>
  );
};

export { Home };
