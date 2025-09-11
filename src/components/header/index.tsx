import React from "react";
import { View, Text } from "react-native";
import { LogoTaskly } from "@components/logo";
import Button from "../buttons/button";
const Header: React.FC = () => {
  return (
    <>
      <View className="w-screen h-40 bg-slate-200 flex flex-row  items-center gap-2 dark:bg-gray-800">
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
      </View>
    </>
  );
};

export { Header };
