import { ScrollView, Text, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { SubjectModal } from "@screens/newSubject";
import { Button } from "@src/components/buttons/button";
import { Header } from "@src/components/header";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

const Home: React.FC = () => {
  const [simulaBanco, setSimulaBanco] = useState<any>([]);
  const [modalIsOpen, setModalIsOpen] = useState<Boolean>(false);
  const [subjects, setSubjects] = useState<JSON[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    loadSubjects();
  }, [subjects, simulaBanco]);

  const handleremoveSubject = () => {
    AsyncStorage.removeItem("subjects");
    setSimulaBanco([]);
  };

  const saveSubjects = async (subjectsToSave: Array<JSON>) => {
    try {
      if (!subjectsToSave || subjectsToSave.length === 0) return;
      await AsyncStorage.setItem("subjects", JSON.stringify(subjectsToSave));
      console.log("Dados salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const storedSubjects = await AsyncStorage.getItem("subjects");
      if (storedSubjects && storedSubjects !== null) {
        const parsedSubjects = JSON.parse(storedSubjects);
        const subjectsArray = Array.isArray(parsedSubjects)
          ? parsedSubjects
          : [parsedSubjects];
        setSimulaBanco(subjectsArray);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectsFromModal = async (newSubject: any) => {
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    await saveSubjects(updatedSubjects);
  };

  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : simulaBanco.length === 0 ? (
        <View className=" flex-1 justify-center items-center w-screen h-40">
          <Ionicons
            name="book-outline"
            size={100}
            color="#4F5DFF"
            className="p-4 bg-blue-100 rounded-lg mb-4 "
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
          {modalIsOpen && (
            <SubjectModal
              modalIsOpen={true}
              setModalIsOpen={setModalIsOpen}
              onSaveSubject={handleSubjectsFromModal}
            />
          )}
        </View>
      ) : (
        <View className="flex-1 items-center bg-blue-50 dark:bg-visible dark:bg-gray-900">
          <View>
            <Header subjectsFromModal={handleSubjectsFromModal} />
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
                Your subjects
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
                    <Text className="font-bold mb-2 dark:text-white">2</Text>
                    <Text className="font-bold dark:text-white">
                      Active subjects
                    </Text>
                  </View>
                </View>
              </View>

              <View
                className=" h-28 w-full bg-slate-50 mt-4 rounded-lg shadow-lg shadow-slate-300
         dark:bg-gray-950 dark:shadow-lg  dark:shadow-slate-800"
              >
                <View className="p-6 flex flex-row">
                  <FontAwesome6
                    name="user-graduate"
                    size={24}
                    color={`${isDarkMode ? "#A3418F" : "#BE89E0"}`}
                    className="mr-2 p-2 rounded-lg bg-purple-100"
                  />
                  <View className="ml-2">
                    <Text className="font-bold mb-2 dark:text-white">2</Text>
                    <Text className="font-bold dark:text-white">
                      Total classes
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
                    <Text className="font-bold mb-2 dark:text-white">2</Text>
                    <Text className="font-bold dark:text-white">
                      Professors
                    </Text>
                  </View>
                </View>
              </View>
              {simulaBanco.length > 0 &&
                simulaBanco.map((object: any, index: number) => (
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
                              color="black"
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
                        color="black"
                        className="mt-6 mr-4"
                        onPress={() => {
                          handleremoveSubject();
                        }}
                      />
                    </View>

                    <View className="w-full flex flex-row  px-6 mb-4">
                      <View className="bg-gray-100 w-11/12 p-2 rounded-b-lg rounded-t-lg">
                        <Text>{object.collegePeriod}º Período</Text>
                      </View>
                    </View>

                    <View className="pl-6 flex flex-row mb-4">
                      <View className="flex flex-row items-center ">
                        <Feather
                          name="calendar"
                          size={18}
                          color="black"
                          className="mr-2"
                        />
                        <Text className="">
                          {object.classTime} Aulas restantes
                        </Text>
                      </View>
                    </View>

                    <View className="pl-6 flex flex-row items-center justify-between mb-4">
                      <Text>Frequência </Text>
                      <Text className=" font-medium mr-6 p-2 rounded-lg bg-green-200 dark:text-white">
                        50%
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export { Home };
