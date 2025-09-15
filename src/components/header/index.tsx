import React from "react";
import { View, Text } from "react-native";
import { LogoTaskly } from "@components/logo";
import { Button } from "@components/buttons/button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const Header: React.FC = () => {
  return (
    <>
      <View className="w-screen h-40 bg-bgLight flex flex-row  items-center  justify-between gap-2 dark:bg-gray-950">
        <View className="flex flex-row items-center justify-center mt-6">
          <LogoTaskly width={100} height={100} alt="Taskly Logo" />
          <View className="">
            <Text className="text-black text-lg font-extrabold dark:text-white">
              TASKLY
            </Text>
            <Text className="text-gray-600 text-sm font-medium dark:text-gray-400">
              Organizar acadêmico
            </Text>
          </View>
        </View>
        <Button
          title="Adicionar Matéria"
          onPress={() => {}}
          style="rounded-lg flex flex-row items-center justify-center  mr-4 mt-8 p-2"
          icon={
            <FontAwesome5
              name="plus"
              size={12}
              color="white"
              className="mr-2"
            />
          }
        />
      </View>
    </>
  );
};

export { Header };
