import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  logout,
  createSubjects,
  getSubjects,
  deleteSubjects,
  updateSubjects,
} from "@functions/index";
import { useNavigation } from "@react-navigation/native";
import { getId } from "@src/asyncStorageData/index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SubjectModal } from "@screens/newSubject";
import { Button } from "@src/components/buttons/button";
import { Header } from "@src/components/header";
import { type Subject } from "@functions/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

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
      if (!id) return;
      await deleteSubjects(id, subjectId);
      loadSubjects();
    } catch (error) {
      console.error("Failed to remove subject:", error);
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
    if (!id) return;
    if (subjectsToSave[0] !== undefined && subjectsToSave[0].id) {
      try {
        updatecurrentSubjects(id, subjectsToSave[0]);
        return;
      } catch (error) {
        console.error("Failed to update subjects:", error);
      }
    }

    const subjectsToSend = subjectsToSave[0];

    if (subjectsToSend === null || subjectsToSend === undefined) return;

    try {
      await createSubjects(id, subjectsToSend);
      await loadSubjects();
    } catch (error) {
      console.error("Failed to create subjects:", error);
    }
  };

  const updatecurrentSubjects = async (id: string, subjects: Subject) => {
    try {
      await updateSubjects(id, subjects);
    } catch (error) {
      console.error("Failed to update subjects:", error);
    } finally {
      await loadSubjects();
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const id = await getId();
      if (!id) return;
      const res = await getSubjects(id);

      const newSubject = res.newSubject;

      if (!newSubject) return;
      setSubjects(newSubject);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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
              <Text className="text-xl font-extrabold dark:text-white">
                Suas Matérias Cadastradas
              </Text>

              <View
                className="h-28 w-full bg-slate-50 shadow-lg shadow-slate-300  mt-4 rounded-lg 
         dark:bg-gray-950 dark:shadow-lg  dark:shadow-slate-800"
              >
                <View className="p-6 flex flex-row">
                  <MaterialIcons
                    name="menu-book"
                    size={24}
                    color={isDarkMode ? "#294A69" : "#3781CC"}
                    className="mr-2 p-2 rounded-lg bg-blue-100 dark:bg-blue-300"
                  />
                  <View className="ml-2">
                    <Text className="font-bold dark:text-white">
                      Matérias Cadastradas
                    </Text>
                    <Text className="font-bold mt-2 dark:text-white">
                      {subjects.length}
                    </Text>
                  </View>
                </View>
              </View>
              <View className=" h-28 w-full bg-slate-50 mt-4 rounded-lg shadow-lg shadow-slate-300 dark:bg-gray-950 dark:shadow-lg  dark:shadow-slate-800">
                <View className="p-6 flex flex-row">
                  <FontAwesome5
                    name="chalkboard-teacher"
                    size={24}
                    color={`${isDarkMode ? "#3C803F" : "#5AE06D"}`}
                    className="mr-2 p-2 rounded-lg bg-green-100"
                  />
                  <View className="ml-2">
                    <Text className="font-bold dark:text-white">
                      Professors
                    </Text>
                    <Text className="font-bold mt-2 dark:text-white">
                      {subjects.length}
                    </Text>
                  </View>
                </View>
              </View>
              {subjects.length > 0 &&
                subjects.map((object: Subject, index: number) => (
                  <View
                    key={index}
                    className={`h-auto w-full flex flex-col bg-slate-50 shadow-lg shadow-slate-300   mt-4 rounded-lg dark:bg-gray-950 dark:shadow-lg  dark:shadow-slate-800`}
                    style={{
                      borderTopWidth: 6,
                      borderTopColor: object.color,
                    }}
                  >
                    <View className=" flex justify-between flex-row">
                      <View className="p-6 flex flex-row">
                        <View
                          className="h-12 w-12 rounded-lg flex items-center justify-center mr-4"
                          style={{ backgroundColor: object.color }}
                        >
                          <Text className="text-white text-2xl font-bold text-center mt-1">
                            {object.subjectName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View className="flex flex-col">
                          <Text className="font-bold mb-2 dark:text-white">
                            {object.subjectName}
                          </Text>

                          <View className="flex flex-row items-center">
                            <FontAwesome
                              name="user-o"
                              size={10}
                              color={isDarkMode ? "white" : "black"}
                              className="mb-2 mr-2"
                            />
                            <Text className="mb-2 dark:text-white">
                              {object.teacherName}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Entypo
                        name="dots-three-vertical"
                        size={12}
                        color={isDarkMode ? "white" : "black"}
                        className="mt-6 mr-4"
                        onPress={() => openConfigForSubject(object.id)}
                      />
                    </View>

                    <View className="w-full flex flex-row  px-6 mb-4">
                      <View className="bg-gray-100 w-11/12 p-2 rounded-b-lg rounded-t-lg dark:bg-gray-800">
                        <Text className="text-black dark:text-white">
                          {object.collegePeriod}º Período
                        </Text>
                      </View>
                    </View>

                    <View className="pl-6 flex flex-row mb-4">
                      <View className="flex flex-row items-center ">
                        <Feather
                          name="calendar"
                          size={18}
                          color={isDarkMode ? "white" : "black"}
                          className="mr-2"
                        />
                        <Text className="text-black dark:text-white">
                          {object.classTime} Aulas restantes
                        </Text>
                      </View>
                    </View>

                    <View className="pl-6 flex flex-row items-center justify-between mb-4">
                      <Text className="text-black dark:text-white">
                        Frequência
                      </Text>
                      <Text className=" font-medium mr-6 p-2 rounded-lg bg-green-200 dark:text-white">
                        <Text className="text-white dark:text-black">50%</Text>
                      </Text>
                    </View>
                  </View>
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
