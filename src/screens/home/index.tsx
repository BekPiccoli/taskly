import React, { useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import { Header } from "@src/components/header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Home: React.FC = () => {
  const [subjects, setSubjects] = useState<object>({});
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const simulaBanco = [subjects];

  const handleSubjectsFromModal = (data: object) => {
    setSubjects(data);
  };
  console.log("SIMULA BANCO: ", simulaBanco);
  return (
    <View className="flex-1 items-center bg-blue-50 dark:bg-gray-900">
      <View>
        <Header subjectsFromModal={handleSubjectsFromModal} />
      </View>
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
              <Text className="font-bold dark:text-white">Active subjects</Text>
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
              <Text className="font-bold dark:text-white">Total classes </Text>
            </View>
          </View>
        </View>

        <View
          className=" h-28 w-full bg-slate-50 mt-4 rounded-lg shadow-lg shadow-slate-300
         dark:bg-gray-950 dark:shadow-lg  dark:shadow-slate-800"
        >
          <View className="p-6 flex flex-row">
            <FontAwesome5
              name="chalkboard-teacher"
              size={24}
              color={`${isDarkMode ? "#3C803F" : "#5AE06D"}`}
              className="mr-2 p-2 rounded-lg bg-green-100"
            />
            <View className="ml-2">
              <Text className="font-bold mb-2 dark:text-white">2</Text>
              <Text className="font-bold dark:text-white">Professors</Text>
            </View>
          </View>
        </View>
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
              <Text className="font-bold dark:text-white">Active subjects</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export { Home };
